import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertSubscriptionSchema, WellnessData } from "@shared/schema";
import { setupAuth, hashPassword, comparePasswords } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
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

  const httpServer = createServer(app);
  return httpServer;
}
