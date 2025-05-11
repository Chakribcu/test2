import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, initialTab = "login" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const { loginMutation, registerMutation } = useAuth();

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      // Reset forms when modal closes
      loginForm.reset();
      registerForm.reset();
    }
  }, [isOpen]);

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    }
  });

  // Form submissions
  const [, setLocation] = useLocation();

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        // Also redirect to home page
        setLocation("/");
      }
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        onClose();
        // Also redirect to home page
        setLocation("/");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="auth-modal">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black/30 fixed inset-0"
            onClick={onClose}
          ></motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="auth-modal-content"
          >
            <button 
              className="absolute top-5 right-5 text-foreground/70 hover:text-foreground w-8 h-8 rounded-full flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} />
            </button>
            
            <div className="mb-6">
              <div className="flex justify-center space-x-4 border-b border-border/30">
                <button
                  className={`py-3 px-5 font-medium text-sm relative ${
                    activeTab === "login" ? "text-primary" : "text-foreground/60 hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Sign In
                  {activeTab === "login" && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
                <button
                  className={`py-3 px-5 font-medium text-sm relative ${
                    activeTab === "register" ? "text-primary" : "text-foreground/60 hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Create Account
                  {activeTab === "register" && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>
            </div>
            
            {activeTab === "login" ? (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="login-username" className="block text-sm font-medium mb-1.5">
                    Username
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    className="input-apple w-full"
                    placeholder="Enter your username"
                    {...loginForm.register("username")}
                  />
                  {loginForm.formState.errors.username && (
                    <p className="mt-1 text-red-500 text-xs">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium mb-1.5">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className="input-apple w-full"
                    placeholder="Enter your password"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-red-500 text-xs">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  <a href="#" className="text-primary hover:underline">
                    Forgot your password?
                  </a>
                </p>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1.5">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="input-apple w-full"
                      placeholder="First name"
                      {...registerForm.register("firstName")}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1.5">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="input-apple w-full"
                      placeholder="Last name"
                      {...registerForm.register("lastName")}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1.5">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="input-apple w-full"
                    placeholder="Choose a username"
                    {...registerForm.register("username")}
                  />
                  {registerForm.formState.errors.username && (
                    <p className="mt-1 text-red-500 text-xs">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-apple w-full"
                    placeholder="Your email address"
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="mt-1 text-red-500 text-xs">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="input-apple w-full"
                    placeholder="Create a password"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="mt-1 text-red-500 text-xs">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="input-apple w-full"
                    placeholder="Confirm your password"
                    {...registerForm.register("confirmPassword")}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-red-500 text-xs">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
                
                <p className="text-center text-xs text-muted-foreground mt-3">
                  By creating an account, you agree to our{" "}
                  <a href="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;