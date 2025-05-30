import { pgTable, text, serial, integer, boolean, timestamp, numeric, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for future e-commerce functionality
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone").unique(),
  street: text("street"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  resolved: boolean("resolved").default(false),
});

// Waitlist/newsletter subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscriptionType: text("subscription_type").notNull(), // "waitlist" or "newsletter"
  createdAt: timestamp("created_at").defaultNow(),
});

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  street: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  message: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  email: true,
  subscriptionType: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Schema for wellness data
export const wellnessData = pgTable("wellness_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull().defaultNow(),
  sleepHours: numeric("sleep_hours", { precision: 3, scale: 1 }),
  waterIntake: integer("water_intake"),
  activityMinutes: integer("activity_minutes"),
  stepsCount: integer("steps_count"),
  moodScore: integer("mood_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWellnessSchema = createInsertSchema(wellnessData);

export type InsertWellnessData = z.infer<typeof insertWellnessSchema>;
export type WellnessData = typeof wellnessData.$inferSelect;

// Schema for user purchase history
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productCategory: text("product_category").notNull(),
  productImage: text("product_image"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPurchaseSchema = createInsertSchema(purchases);

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

// Schema for orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("processing"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  shippingStatus: text("shipping_status").notNull().default("processing"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Create Zod schemas for orders
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
