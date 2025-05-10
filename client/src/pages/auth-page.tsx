import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Check, User, Mail, Lock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect if logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  useEffect(() => {
    document.title = isLogin ? "Sign In | KavinoRa" : "Sign Up | KavinoRa";
  }, [isLogin]);

  const { 
    register: registerLogin, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { 
    register: registerSignup, 
    handleSubmit: handleSignupSubmit, 
    formState: { errors: signupErrors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <Layout>
      <div className="pt-16 pb-24 bg-[#f5f5f7]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
            {/* Form Section */}
            <div className="md:w-1/2 bg-white rounded-2xl shadow-md p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-[#6e6e73]">
                  {isLogin ? 'Sign in to your account to continue' : 'Join KavinoRa and discover premium wellness products'}
                </p>
              </div>
              
              <div className="mb-8 flex space-x-2">
                <button
                  className={`relative px-6 py-2 ${
                    isLogin 
                      ? "text-[#1d1d1f] font-medium" 
                      : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                  {isLogin && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                  className={`relative px-6 py-2 ${
                    !isLogin 
                      ? "text-[#1d1d1f] font-medium" 
                      : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                  {!isLogin && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              </div>

              {isLogin ? (
                <form
                  onSubmit={handleLoginSubmit(onLoginSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="login-username" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-[#86868b]" />
                      </div>
                      <input
                        id="login-username"
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          loginErrors.username ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="Enter your username"
                        {...registerLogin("username")}
                      />
                    </div>
                    {loginErrors.username && (
                      <p className="mt-1.5 text-red-600 text-xs">{loginErrors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label htmlFor="login-password" className="block text-sm font-medium text-[#1d1d1f]">
                        Password
                      </label>
                      <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#86868b]" />
                      </div>
                      <input
                        id="login-password"
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          loginErrors.password ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="Enter your password"
                        {...registerLogin("password")}
                      />
                    </div>
                    {loginErrors.password && (
                      <p className="mt-1.5 text-red-600 text-xs">{loginErrors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Sign In</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleSignupSubmit(onRegisterSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="w-full px-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your first name"
                        {...registerSignup("firstName")}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="w-full px-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your last name"
                        {...registerSignup("lastName")}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-[#86868b]" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          signupErrors.username ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="Choose a username"
                        {...registerSignup("username")}
                      />
                    </div>
                    {signupErrors.username && (
                      <p className="mt-1.5 text-red-600 text-xs">{signupErrors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#86868b]" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className={`w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          signupErrors.email ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="Your email address"
                        {...registerSignup("email")}
                      />
                    </div>
                    {signupErrors.email && (
                      <p className="mt-1.5 text-red-600 text-xs">{signupErrors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#86868b]" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          signupErrors.password ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="Create a password"
                        {...registerSignup("password")}
                      />
                    </div>
                    {signupErrors.password && (
                      <p className="mt-1.5 text-red-600 text-xs">{signupErrors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#86868b]" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          signupErrors.confirmPassword ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="Confirm your password"
                        {...registerSignup("confirmPassword")}
                      />
                    </div>
                    {signupErrors.confirmPassword && (
                      <p className="mt-1.5 text-red-600 text-xs">{signupErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Create Account</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Hero Section */}
            <div className="md:w-1/2 bg-white rounded-2xl shadow-md p-10 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4">
                Welcome to KavinoRa
              </h1>
              <p className="text-[#6e6e73] mb-8">
                Join our community and discover premium wellness products designed for your active lifestyle.
              </p>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-[#f5f5f7] rounded-full p-1 mr-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[#1d1d1f]">Access exclusive product launches and special offers</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#f5f5f7] rounded-full p-1 mr-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[#1d1d1f]">Track your orders and manage your shipping preferences</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#f5f5f7] rounded-full p-1 mr-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[#1d1d1f]">Save your favorite products for quick checkout</p>
                </div>
              </div>
              <div className="mt-10">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                  alt="KavinoRa Products"
                  className="rounded-xl shadow-sm w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;