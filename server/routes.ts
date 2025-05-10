import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, insertSubscriptionSchema } from "@shared/schema";
import { setupAuth } from "./auth";

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

  const httpServer = createServer(app);
  return httpServer;
}
