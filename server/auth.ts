import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  try {
    console.log("Comparing passwords:", { supplied, storedLength: stored.length });
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.log("Invalid stored password format - missing hash or salt");
      return false;
    }
    console.log("Extracted hash and salt:", { hashedLength: hashed.length, saltLength: salt.length });
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const result = timingSafeEqual(hashedBuf, suppliedBuf);
    console.log("Password comparison result:", result);
    return result;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "kavinora-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Try to find user by email
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Check if phone number already exists (if provided)
      if (req.body.phone) {
        const existingPhone = await storage.getUserByPhone(req.body.phone);
        if (existingPhone) {
          return res.status(400).json({ message: "Phone number already exists" });
        }
      }

      // Create the user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Auto-login the user after registration
      req.login(user, async (err) => {
        if (err) return next(err);
        
        // Seed wellness data for the dashboard demo
        try {
          await storage.seedWellnessDataIfNeeded();
        } catch (seedErr) {
          console.error("Error seeding wellness data:", seedErr);
          // Continue anyway, this is just for demo purposes
        }
        
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt:", { email: req.body.email });
    
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      console.log("Passport authenticate result:", { 
        hasError: !!err, 
        authenticated: !!user, 
        info 
      });
      
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("Authentication failed: Invalid email or password");
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.login(user, async (err) => {
        if (err) {
          console.error("Session login error:", err);
          return next(err);
        }
        
        // Seed wellness data for the dashboard demo
        try {
          await storage.seedWellnessDataIfNeeded();
        } catch (seedErr) {
          console.error("Error seeding wellness data:", seedErr);
          // Continue anyway, this is just for demo purposes
        }
        
        console.log("Login successful for user:", user.email);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}