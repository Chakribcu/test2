import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertSubscriptionSchema, WellnessData } from "@shared/schema";
import { setupAuth, hashPassword, comparePasswords } from "./auth";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // Automatically seed sample order data for demo
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      await storage.seedOrdersIfNeeded();
    }
    next();
  });
  
  // Contact form submissions
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Contact form submitted successfully", 
        id: contact.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        console.error("Error in /api/contact:", error);
        res.status(500).json({ success: false, message: "An error occurred while processing your request" });
      }
    }
  });

  // Waitlist registrations
  app.post("/api/waitlist", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSubscriptionSchema.parse({
        email: req.body.email,
        subscriptionType: "waitlist",
      });
      
      const subscription = await storage.createSubscription(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Successfully added to waitlist", 
        id: subscription.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid email address", errors: error.errors });
      } else if ((error as any).code === "DUPLICATE_EMAIL") {
        res.status(200).json({ success: true, message: "Email already registered for waitlist" });
      } else {
        console.error("Error in /api/waitlist:", error);
        res.status(500).json({ success: false, message: "An error occurred while processing your request" });
      }
    }
  });

  // Newsletter subscriptions
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSubscriptionSchema.parse({
        email: req.body.email,
        subscriptionType: "newsletter",
      });
      
      const subscription = await storage.createSubscription(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Successfully subscribed to newsletter", 
        id: subscription.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid email address", errors: error.errors });
      } else if ((error as any).code === "DUPLICATE_EMAIL") {
        res.status(200).json({ success: true, message: "Email already subscribed to newsletter" });
      } else {
        console.error("Error in /api/newsletter:", error);
        res.status(500).json({ success: false, message: "An error occurred while processing your request" });
      }
    }
  });
  
  // Update user profile endpoint
  app.patch("/api/user/profile", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to update your profile" });
    }

    try {
      // Only allow certain fields to be updated
      const profileData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
      };
      
      const updatedUser = await storage.updateUserProfile(req.user.id, profileData);
      
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error in /api/user/profile:", error);
      res.status(500).json({ success: false, message: "An error occurred while updating your profile" });
    }
  });
  
  // Change password endpoint
  app.patch("/api/user/password", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to change your password" });
    }
    
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          success: false, 
          message: "Current password and new password are required" 
        });
      }
      
      // Verify current password
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the password
      const updatedUser = await storage.updateUserPassword(req.user.id, hashedPassword);
      
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("Error in /api/user/password:", error);
      res.status(500).json({ success: false, message: "An error occurred while changing your password" });
    }
  });

  // Wellness dashboard API routes
  app.get("/api/user/wellness-data", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to access wellness data" });
    }
    
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      
      let wellnessData;
      
      // If date range is provided, use it
      if (startDate && endDate) {
        wellnessData = await storage.getWellnessDataByDateRange(
          userId, 
          new Date(startDate as string), 
          new Date(endDate as string)
        );
      } else {
        // Otherwise get all data for this user
        wellnessData = await storage.getWellnessDataByUserId(userId);
      }
      
      // Process the data for the frontend
      const processedData = processWellnessDataForDashboard(wellnessData);
      res.status(200).json(processedData);
    } catch (error) {
      console.error("Error in /api/user/wellness-data:", error);
      res.status(500).json({ success: false, message: "An error occurred while fetching wellness data" });
    }
  });

  app.post("/api/user/wellness-data", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to update wellness data" });
    }
    
    try {
      const userId = req.user.id;
      const wellnessData = req.body;
      
      // Add userId to the data
      wellnessData.userId = userId;
      
      const newRecord = await storage.createWellnessData(wellnessData);
      res.status(201).json({ 
        success: true, 
        message: "Wellness data saved successfully",
        data: newRecord
      });
    } catch (error) {
      console.error("Error in POST /api/user/wellness-data:", error);
      res.status(500).json({ success: false, message: "An error occurred while saving wellness data" });
    }
  });

  app.get("/api/user/recent-purchases", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to access purchase history" });
    }
    
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const purchases = await storage.getRecentPurchasesByUserId(userId, limit);
      res.status(200).json({ 
        success: true,
        data: purchases
      });
    } catch (error) {
      console.error("Error in /api/user/recent-purchases:", error);
      res.status(500).json({ success: false, message: "An error occurred while fetching purchase history" });
    }
  });

  // Password Reset APIs
  app.post("/api/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal that the user doesn't exist for security reasons
        return res.status(200).json({ 
          success: true, 
          message: "If your email exists in our system, you will receive a password reset link" 
        });
      }
      
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Store the reset token (in a real app, we would save this to the database)
      // For demo purposes, we'll just log it
      console.log(`Reset token for ${email}: ${resetToken}`);
      console.log(`Reset link: http://localhost:3000/reset-password/${resetToken}`);
      
      // In a real app, we would send an email with a link to reset the password
      // For this demo, we'll pretend we sent an email
      
      res.status(200).json({ 
        success: true, 
        message: "If your email exists in our system, you will receive a password reset link" 
      });
    } catch (error) {
      console.error("Error in /api/forgot-password:", error);
      res.status(500).json({ success: false, message: "An error occurred while processing your request" });
    }
  });
  
  app.post("/api/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ success: false, message: "Token and password are required" });
      }
      
      // In a real app, we would validate the token and find the user
      // For this demo, we'll assume the token is valid and return success
      
      // Hash the new password
      const hashedPassword = await hashPassword(password);
      
      // In a real app, we would update the user's password in the database
      // For this demo, we'll just pretend we updated it
      
      res.status(200).json({ 
        success: true, 
        message: "Password has been reset successfully" 
      });
    } catch (error) {
      console.error("Error in /api/reset-password:", error);
      res.status(500).json({ success: false, message: "An error occurred while resetting your password" });
    }
  });

  // Order APIs
  app.get("/api/orders", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to access orders" });
    }
    
    try {
      const userId = req.user.id;
      const orders = await storage.getOrdersByUserId(userId);
      
      res.status(200).json({ 
        success: true,
        data: orders
      });
    } catch (error) {
      console.error("Error in /api/orders:", error);
      res.status(500).json({ success: false, message: "An error occurred while fetching your orders" });
    }
  });
  
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "You must be logged in to access order details" });
    }
    
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Get the order with its items
      const orderWithItems = await storage.getOrderWithItems(orderId);
      
      if (!orderWithItems) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      
      // Ensure the order belongs to the current user
      if (orderWithItems.order.userId !== userId) {
        return res.status(403).json({ success: false, message: "You don't have permission to view this order" });
      }
      
      res.status(200).json({ 
        success: true,
        data: orderWithItems
      });
    } catch (error) {
      console.error("Error in /api/orders/:id:", error);
      res.status(500).json({ success: false, message: "An error occurred while fetching order details" });
    }
  });
  
  // Helper function to process wellness data for the dashboard
  function processWellnessDataForDashboard(data: WellnessData[]) {
    // If no data, return a default structure
    if (!data || data.length === 0) {
      const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return {
        sleepHours: [7, 6.5, 8, 7.2, 6.8, 7.5, 8.2],
        waterIntake: [2000, 1800, 2200, 2100, 1900, 2300, 2400],
        activityMinutes: [30, 45, 20, 35, 50, 40, 25],
        stepsCount: [6000, 7500, 5000, 6200, 8000, 7000, 5500],
        moodScores: [7, 8, 6, 7, 9, 8, 7],
        weekLabels
      };
    }
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Get the most recent 7 days of data or pad with defaults
    const recentData = sortedData.slice(-7);
    
    // Extract data into separate arrays
    const result = {
      sleepHours: recentData.map(d => Number(d.sleepHours) || 0),
      waterIntake: recentData.map(d => Number(d.waterIntake) || 0),
      activityMinutes: recentData.map(d => Number(d.activityMinutes) || 0),
      stepsCount: recentData.map(d => Number(d.stepsCount) || 0),
      moodScores: recentData.map(d => Number(d.moodScore) || 0),
      weekLabels: recentData.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      })
    };
    
    return result;
  }

  // Chatbot API endpoint with mood detection
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // In a real implementation, this would call an AI service like OpenAI or Anthropic
      // For the demo, we're using a simple simulation
      
      // Basic mood detection (simple implementation)
      const detectMood = (text: string): 'positive' | 'negative' | 'neutral' | 'confused' => {
        const positiveWords = ['thanks', 'great', 'awesome', 'good', 'excellent', 'love', 'happy', 'perfect', 'yes'];
        const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'poor', 'wrong', 'unhappy', 'disappointed', 'no'];
        const confusedWords = ['confused', 'not sure', 'don\'t understand', 'what', 'how', 'why', 'when', 'where', 'who'];
        
        const lowerText = text.toLowerCase();
        
        let positiveScore = positiveWords.filter(word => lowerText.includes(word)).length;
        let negativeScore = negativeWords.filter(word => lowerText.includes(word)).length;
        let confusedScore = confusedWords.filter(word => lowerText.includes(word)).length;
        
        if (confusedScore > Math.max(positiveScore, negativeScore)) return 'confused';
        if (positiveScore > negativeScore) return 'positive';
        if (negativeScore > positiveScore) return 'negative';
        return 'neutral';
      };
      
      // Common product questions and answers
      const faqResponses: {[key: string]: string} = {
        "size": "We recommend using our foot measuring tool in the app or website for the most accurate size. If you're between sizes, we suggest going up a half size for a more comfortable fit.",
        "return": "We offer a 30-day satisfaction guarantee. If you're not completely satisfied, you can return unworn shoes in their original packaging for a full refund or exchange.",
        "shipping": "We offer free standard shipping on all orders over $75. Standard shipping takes 3-5 business days, and expedited options are available at checkout.",
        "material": "Our wellness shoes are made with sustainable, eco-friendly materials including recycled PET, natural rubber, and organic cotton where possible.",
        "warranty": "All KavinoRa products come with a 1-year limited warranty against manufacturing defects under normal use.",
        "wash": "Most of our shoes can be spot cleaned with mild soap and water. For detailed care instructions, please check the product-specific care guide that came with your purchase.",
        "discount": "We offer a 10% discount for first-time customers when you sign up for our newsletter. We also have seasonal sales and special offers for loyalty program members.",
        "location": "KavinoRa products are available in our online store and select retail partners nationwide. Use our store locator to find a retailer near you."
      };
      
      // Check for keywords in the message to determine response
      const lowerMsg = message.toLowerCase();
      let response = "I'm sorry, I don't have specific information about that. Would you like me to connect you with a human representative?";
      
      // Check each keyword group for matches
      for (const [keyword, answer] of Object.entries(faqResponses)) {
        if (lowerMsg.includes(keyword)) {
          response = answer;
          break;
        }
      }
      
      // Handle greetings
      if (lowerMsg.match(/^(hi|hello|hey|greetings)/i)) {
        response = `Hello! How can I help you with KavinoRa products today?`;
      }
      
      // Handle thanks
      if (lowerMsg.match(/thank|thanks|appreciate|grateful/i)) {
        response = `You're welcome! Is there anything else I can help you with today?`;
      }
      
      // Handle goodbyes
      if (lowerMsg.match(/bye|goodbye|see you|talk later/i)) {
        response = `Goodbye! Thanks for chatting with KavinoRa support. Have a great day!`;
      }
      
      // Generate suggested follow-up questions based on the current topic
      let suggestedQuestions = [];
      if (lowerMsg.includes('size')) {
        suggestedQuestions = [
          { id: "sq1", text: "How do I measure my foot size at home?" },
          { id: "sq2", text: "Do your shoes run small or large?" },
        ];
      } else if (lowerMsg.includes('return')) {
        suggestedQuestions = [
          { id: "sq1", text: "How do I start a return process?" },
          { id: "sq2", text: "Can I exchange instead of returning?" },
        ];
      } else if (lowerMsg.includes('shipping')) {
        suggestedQuestions = [
          { id: "sq1", text: "Do you ship internationally?" },
          { id: "sq2", text: "How can I track my order?" },
        ];
      } else {
        suggestedQuestions = [
          { id: "sq1", text: "Tell me about your materials" },
          { id: "sq2", text: "What's your return policy?" },
          { id: "sq3", text: "How do I care for my shoes?" },
        ];
      }
      
      // Detect mood in user's message
      const mood = detectMood(message);
      
      // Log chat for analytics (in a real app, store in database)
      console.log(`Chat: User ${userId || 'anonymous'} said "${message}" (mood: ${mood})`);
      
      // In a real implementation, this would use a more sophisticated AI or routing system
      res.json({
        response,
        mood,
        suggestedQuestions
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });
  
  // AI Product Description Generator
  app.post('/api/generate-description', async (req: Request, res: Response) => {
    try {
      // This would normally call an AI service like OpenAI or Anthropic
      // For demo purposes, we'll return a mock response
      const { 
        productName, 
        productType, 
        keywords, 
        targetAudience, 
        toneOfVoice, 
        benefitsToHighlight, 
        lengthPreference 
      } = req.body;
      
      // Templates based on tone of voice
      const toneTemplates: {[key: string]: string} = {
        'professional': `Introducing the revolutionary ${productName}, a premium ${productType} designed with your wellness in mind. Crafted using advanced ergonomic technology, these shoes provide exceptional support for ${targetAudience || "all users"}. ${keywords?.slice(0, 3).join(", ") || "Comfort, support, and innovation"} are at the core of our design philosophy.`,
        
        'casual': `Meet the ${productName} – your new favorite ${productType}! These awesome shoes are perfect for ${targetAudience || "anyone looking for comfort"}. With features like ${keywords?.slice(0, 2).join(" and ") || "cushioned support and breathable materials"}, your feet will thank you all day long!`,
        
        'luxury': `Exquisite craftsmanship meets unparalleled comfort in the ${productName}, our signature ${productType}. Meticulously designed for ${targetAudience || "discerning individuals"}, this exceptional footwear embodies sophistication while incorporating ${keywords?.slice(0, 2).join(" and ") || "premium materials and expert design"}.`,
        
        'scientific': `The ${productName} ${productType} is engineered based on biomechanical principles to optimize foot health. Clinical studies have shown that the ${keywords?.slice(0, 1)?.[0] || "ergonomic design"} significantly reduces pressure points and improves posture alignment for ${targetAudience || "users"}.`,
        
        'empathetic': `We understand the challenges that ${targetAudience || "many people"} face when finding comfortable footwear. That's why we created the ${productName}, a ${productType} specifically designed with your needs in mind. The ${keywords?.slice(0, 2).join(" and ") || "supportive architecture and gentle cushioning"} work together to provide relief.`
      };
      
      // Select template based on tone, defaulting to professional
      const baseTemplate = toneTemplates[toneOfVoice as string] || toneTemplates.professional;
      
      // Add benefits if provided
      let fullDescription = baseTemplate;
      if (benefitsToHighlight && benefitsToHighlight.length > 0) {
        fullDescription += ` The key benefits include ${benefitsToHighlight.join(", ")}, making it the perfect choice for enhancing your daily wellness routine.`;
      }
      
      // Adjust length if needed
      if (lengthPreference === 'short') {
        fullDescription = fullDescription.split('. ').slice(0, 2).join('. ') + '.';
      } else if (lengthPreference === 'long' && benefitsToHighlight) {
        fullDescription += ` Each feature is thoughtfully incorporated to ensure maximum comfort and support. The ${productName} represents our commitment to wellness, quality, and sustainability, providing you with footwear that truly makes a difference in your daily life.`;
      }
      
      // Add tone-specific closing
      if (toneOfVoice === "professional") {
        fullDescription += " Invest in your wellness today with this scientifically backed solution.";
      } else if (toneOfVoice === "casual") {
        fullDescription += " Why wait? Your feet will thank you!";
      } else if (toneOfVoice === "luxury") {
        fullDescription += " Experience the exclusive comfort that only premium wellness innovation can provide.";
      }
      
      // Create bullet points
      const bulletPoints = [
        `Enhanced comfort with proprietary cushioning`,
        `Ergonomic design supports natural foot alignment`,
        `Breathable materials for all-day freshness`,
        `Durable construction ensures lasting quality`,
        ...(benefitsToHighlight || []).map((benefit: string) => `${benefit}`)
      ];
      
      // Generate short description
      const shortDescription = fullDescription.split('.')[0] + ".";
      
      // Create SEO recommendations
      const seoTitle = `${productName} | Premium ${productType} for Ultimate Comfort`;
      const seoMetaDescription = `Discover the ${productName}, innovative ${productType} designed for ${targetAudience || "optimal comfort"}. Features ${keywords?.slice(0, 3).join(", ") || "superior comfort and support"}.`;
      
      // Log generation request (in a real app, store in database)
      console.log(`Description generated for ${productName}`);
      
      // Return the generated content
      res.json({
        description: fullDescription,
        shortDescription,
        bulletPoints,
        seoKeywords: [
          ...(keywords || []),
          "foot comfort",
          "wellness footwear",
          "ergonomic shoes",
          "foot pain relief"
        ],
        seoTitle,
        seoMetaDescription
      });
    } catch (error) {
      console.error('Description generation error:', error);
      res.status(500).json({ error: 'Failed to generate product description' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
