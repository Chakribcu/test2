import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertSubscriptionSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
