import { 
  User, InsertUser, users,
  Contact, InsertContact, contacts,
  Subscription, InsertSubscription, subscriptions,
  WellnessData, InsertWellnessData, wellnessData,
  Purchase, InsertPurchase, purchases,
  Order, InsertOrder, orders,
  OrderItem, InsertOrderItem, orderItems
} from "@shared/schema";

// Interface for all storage methods
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: number, userData: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>): Promise<User | undefined>;
  updateUserPassword(id: number, password: string): Promise<User | undefined>;
  
  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactResolved(id: number, resolved: boolean): Promise<Contact | undefined>;
  
  // Subscription methods
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionByEmail(email: string, type: string): Promise<Subscription | undefined>;
  getAllSubscriptions(type?: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Wellness data methods
  getWellnessData(id: number): Promise<WellnessData | undefined>;
  getWellnessDataByUserId(userId: number): Promise<WellnessData[]>;
  getWellnessDataByDateRange(userId: number, startDate: Date, endDate: Date): Promise<WellnessData[]>;
  createWellnessData(data: InsertWellnessData): Promise<WellnessData>;
  updateWellnessData(id: number, data: Partial<Omit<WellnessData, 'id' | 'userId'>>): Promise<WellnessData | undefined>;
  
  // Purchase methods
  getPurchase(id: number): Promise<Purchase | undefined>;
  getPurchasesByUserId(userId: number): Promise<Purchase[]>;
  getRecentPurchasesByUserId(userId: number, limit?: number): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updateOrderPaymentStatus(id: number, paymentStatus: string): Promise<Order | undefined>;
  updateOrderShippingStatus(id: number, shippingStatus: string): Promise<Order | undefined>;
  
  // Order Item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderWithItems(orderId: number): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  
  // Session store
  sessionStore: session.Store;
  
  // Demo data seeding
  seedWellnessDataIfNeeded(): Promise<void>;
  seedOrdersIfNeeded(): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private subscriptions: Map<number, Subscription>;
  private wellnessRecords: Map<number, WellnessData>;
  private purchases: Map<number, Purchase>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private userIdCounter: number;
  private contactIdCounter: number;
  private subscriptionIdCounter: number;
  private wellnessIdCounter: number;
  private purchaseIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private hasSeededData: boolean;
  private hasSeededOrders: boolean;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.subscriptions = new Map();
    this.wellnessRecords = new Map();
    this.purchases = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.userIdCounter = 1;
    this.contactIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.wellnessIdCounter = 1;
    this.purchaseIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.hasSeededData = false;
    this.hasSeededOrders = false;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      street: insertUser.street || null,
      city: insertUser.city || null,
      state: insertUser.state || null,
      postalCode: insertUser.postalCode || null,
      country: insertUser.country || null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserProfile(id: number, userData: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user,
      ...userData,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserPassword(id: number, password: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user,
      password
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: now,
      resolved: false
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContactResolved(id: number, resolved: boolean): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact: Contact = {
      ...contact,
      resolved
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  // Subscription methods
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionByEmail(email: string, type: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (sub) => sub.email === email && sub.subscriptionType === type
    );
  }

  async getAllSubscriptions(type?: string): Promise<Subscription[]> {
    if (type) {
      return Array.from(this.subscriptions.values()).filter(
        (sub) => sub.subscriptionType === type
      );
    }
    return Array.from(this.subscriptions.values());
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    // Check if email already exists for this subscription type
    const existing = await this.getSubscriptionByEmail(
      insertSubscription.email,
      insertSubscription.subscriptionType
    );
    
    if (existing) {
      const error = new Error("Email already exists for this subscription type") as any;
      error.code = "DUPLICATE_EMAIL";
      throw error;
    }
    
    const id = this.subscriptionIdCounter++;
    const now = new Date();
    const subscription: Subscription = { 
      ...insertSubscription, 
      id, 
      createdAt: now
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  // Wellness data methods
  async getWellnessData(id: number): Promise<WellnessData | undefined> {
    return this.wellnessRecords.get(id);
  }

  async getWellnessDataByUserId(userId: number): Promise<WellnessData[]> {
    return Array.from(this.wellnessRecords.values())
      .filter(record => record.userId === userId);
  }

  async getWellnessDataByDateRange(userId: number, startDate: Date, endDate: Date): Promise<WellnessData[]> {
    return Array.from(this.wellnessRecords.values())
      .filter(record => {
        const recordDate = new Date(record.date);
        return record.userId === userId && 
               recordDate >= startDate && 
               recordDate <= endDate;
      });
  }

  async createWellnessData(data: InsertWellnessData): Promise<WellnessData> {
    const id = this.wellnessIdCounter++;
    const now = new Date();
    
    const wellnessRecord: WellnessData = {
      id,
      userId: data.userId,
      date: data.date || now,
      sleepHours: data.sleepHours || null,
      waterIntake: data.waterIntake || null,
      activityMinutes: data.activityMinutes || null,
      stepsCount: data.stepsCount || null,
      moodScore: data.moodScore || null,
      createdAt: now
    };
    
    this.wellnessRecords.set(id, wellnessRecord);
    return wellnessRecord;
  }

  async updateWellnessData(id: number, data: Partial<Omit<WellnessData, 'id' | 'userId'>>): Promise<WellnessData | undefined> {
    const existingRecord = await this.getWellnessData(id);
    if (!existingRecord) return undefined;

    const updatedRecord: WellnessData = {
      ...existingRecord,
      ...data
    };

    this.wellnessRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  // Purchase methods
  async getPurchase(id: number): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }

  async getPurchasesByUserId(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values())
      .filter(purchase => purchase.userId === userId);
  }

  async getRecentPurchasesByUserId(userId: number, limit: number = 5): Promise<Purchase[]> {
    return Array.from(this.purchases.values())
      .filter(purchase => purchase.userId === userId)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      .slice(0, limit);
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const id = this.purchaseIdCounter++;
    const now = new Date();
    
    const newPurchase: Purchase = {
      id,
      userId: purchase.userId,
      productId: purchase.productId,
      productName: purchase.productName,
      productCategory: purchase.productCategory,
      productImage: purchase.productImage || null,
      price: purchase.price,
      purchaseDate: purchase.purchaseDate || now,
      createdAt: now
    };
    
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber
    );
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    
    const newOrder: Order = {
      id,
      orderNumber: order.orderNumber || `ORD-${Date.now()}-${id}`,
      userId: order.userId,
      status: order.status || "processing",
      paymentStatus: order.paymentStatus || "pending",
      shippingStatus: order.shippingStatus || "processing",
      total: order.total,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      createdAt: now,
      updatedAt: now
    };
    
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateOrderPaymentStatus(id: number, paymentStatus: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      paymentStatus,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateOrderShippingStatus(id: number, shippingStatus: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      shippingStatus,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const now = new Date();
    
    const newOrderItem: OrderItem = {
      id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      productName: orderItem.productName,
      quantity: orderItem.quantity,
      price: orderItem.price,
      image: orderItem.image || null,
      createdAt: now
    };
    
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async getOrderWithItems(orderId: number): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;
    
    const items = await this.getOrderItems(orderId);
    return { order, items };
  }
  
  // Seed order data
  async seedOrdersIfNeeded(): Promise<void> {
    if (this.hasSeededOrders || this.users.size === 0) {
      return;
    }

    // Get the first user to seed data for
    const userId = 1;
    const now = new Date();
    
    // Sample shipping address
    const shippingAddress = {
      name: "John Doe",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA"
    };
    
    // Create some sample orders
    const orderStatuses = ["processing", "shipped", "delivered", "cancelled"];
    const paymentStatuses = ["paid", "pending", "failed"];
    const shippingStatuses = ["processing", "shipped", "delivered"];
    const paymentMethods = ["Credit Card", "PayPal", "Apple Pay"];
    
    for (let i = 0; i < 5; i++) {
      const orderDate = new Date();
      orderDate.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Orders within last 60 days
      
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      const shippingStatus = shippingStatuses[Math.floor(Math.random() * shippingStatuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Create the order
      const order = await this.createOrder({
        orderNumber: `ORD-${Date.now()}-${i}`,
        userId,
        status: orderStatus,
        paymentStatus,
        shippingStatus,
        total: "0", // Will be updated after adding items
        shippingAddress,
        paymentMethod,
        createdAt: orderDate,
        updatedAt: orderDate
      });
      
      // Sample products to add to order
      const products = [
        { id: 1, name: "Comfort Plus Insoles", price: 39.99, image: "/product-1.jpg" },
        { id: 2, name: "Bamboo Compression Socks", price: 19.99, image: "/product-2.jpg" },
        { id: 3, name: "Wellness Tea Collection", price: 24.99, image: "/product-3.jpg" },
        { id: 4, name: "Posture Support Cushion", price: 49.99, image: "/product-4.jpg" },
        { id: 5, name: "Premium Walking Shoes", price: 129.99, image: "/product-5.jpg" }
      ];
      
      // Add random number of products to each order
      let orderTotal = 0;
      const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per order
      const selectedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, numItems);
      
      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2 items of each product
        const itemTotal = product.price * quantity;
        orderTotal += itemTotal;
        
        await this.createOrderItem({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price.toString(),
          image: product.image,
          createdAt: orderDate
        });
      }
      
      // Update the order total
      await this.updateOrderStatus(order.id, order.status);
    }
    
    this.hasSeededOrders = true;
    console.log("Seeded order data");
  }
  
  // Demo data seeding method
  async seedWellnessDataIfNeeded(): Promise<void> {
    if (this.hasSeededData || this.users.size === 0) {
      return;
    }

    // Get the first user to seed data for
    const userId = 1;
    const now = new Date();
    
    // Sample wellness data for the past week
    const weekDays = 7;
    for (let i = 0; i < weekDays; i++) {
      const date = new Date();
      date.setDate(now.getDate() - (weekDays - i - 1));
      
      await this.createWellnessData({
        userId,
        date,
        sleepHours: (6.5 + Math.random() * 2).toFixed(1), // Between 6.5 and 8.5 hours
        waterIntake: Math.floor(1800 + Math.random() * 800), // Between 1800ml and 2600ml
        activityMinutes: Math.floor(25 + Math.random() * 35), // Between 25 and 60 minutes
        stepsCount: Math.floor(4000 + Math.random() * 5000), // Between 4000 and 9000 steps
        moodScore: Math.floor(6 + Math.random() * 4), // Between 6 and 10
      });
    }

    // Sample purchase history
    const products = [
      { id: 1, name: "Comfort Plus Insoles", category: "Footwear", price: 39.99, image: "/product-1.jpg" },
      { id: 2, name: "Bamboo Compression Socks", category: "Accessories", price: 19.99, image: "/product-2.jpg" },
      { id: 3, name: "Wellness Tea Collection", category: "Wellness", price: 24.99, image: "/product-3.jpg" },
      { id: 4, name: "Posture Support Cushion", category: "Accessories", price: 49.99, image: "/product-4.jpg" },
      { id: 5, name: "Premium Walking Shoes", category: "Footwear", price: 129.99, image: "/product-5.jpg" }
    ];
    
    // Create purchase history over the last month
    for (let i = 0; i < products.length; i++) {
      const purchaseDate = new Date();
      purchaseDate.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Within last month
      
      const product = products[i];
      await this.createPurchase({
        userId,
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        productImage: product.image,
        price: product.price.toString(),
        purchaseDate,
      });
    }

    this.hasSeededData = true;
    console.log("Seeded wellness data for dashboard demo");
  }
}

// Create and export a singleton instance of storage
const storageInstance = new MemStorage();
export const storage = storageInstance;