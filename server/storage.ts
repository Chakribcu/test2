import { 
  User, InsertUser, users,
  Contact, InsertContact, contacts,
  Subscription, InsertSubscription, subscriptions
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
  
  // Session store
  sessionStore: session.Store;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private subscriptions: Map<number, Subscription>;
  private userIdCounter: number;
  private contactIdCounter: number;
  private subscriptionIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.subscriptions = new Map();
    this.userIdCounter = 1;
    this.contactIdCounter = 1;
    this.subscriptionIdCounter = 1;
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
}

// Create and export a singleton instance of storage
export const storage = new MemStorage();
