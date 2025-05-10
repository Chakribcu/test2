import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";

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
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
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

  const { loginMutation } = useAuth();
  const { registerMutation } = useAuth();

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="pt-12 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="md:w-1/2 bg-white rounded-xl shadow-md p-8">
            <div className="mb-6 flex justify-center space-x-4">
              <button
                className={`font-montserrat font-medium text-lg pb-2 px-4 ${
                  isLogin 
                    ? "text-teal border-b-2 border-teal" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                className={`font-montserrat font-medium text-lg pb-2 px-4 ${
                  !isLogin 
                    ? "text-teal border-b-2 border-teal" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
                <div className="mb-4">
                  <label htmlFor="login-username" className="block font-montserrat font-medium mb-2">
                    Username
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal ${
                      loginErrors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your username"
                    {...registerLogin("username")}
                  />
                  {loginErrors.username && (
                    <p className="mt-1 text-red-600 text-sm">{loginErrors.username.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="login-password" className="block font-montserrat font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal ${
                      loginErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    {...registerLogin("password")}
                  />
                  {loginErrors.password && (
                    <p className="mt-1 text-red-600 text-sm">{loginErrors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 rounded-full transition-all"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </button>

                <div className="mt-4 text-center">
                  <a href="#" className="text-teal hover:text-teal-dark text-sm">
                    Forgot your password?
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit(onRegisterSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block font-montserrat font-medium mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      placeholder="Your first name"
                      {...registerSignup("firstName")}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block font-montserrat font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      placeholder="Your last name"
                      {...registerSignup("lastName")}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="username" className="block font-montserrat font-medium mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal ${
                      signupErrors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Choose a username"
                    {...registerSignup("username")}
                  />
                  {signupErrors.username && (
                    <p className="mt-1 text-red-600 text-sm">{signupErrors.username.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block font-montserrat font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal ${
                      signupErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your email address"
                    {...registerSignup("email")}
                  />
                  {signupErrors.email && (
                    <p className="mt-1 text-red-600 text-sm">{signupErrors.email.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block font-montserrat font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal ${
                      signupErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Create a password"
                    {...registerSignup("password")}
                  />
                  {signupErrors.password && (
                    <p className="mt-1 text-red-600 text-sm">{signupErrors.password.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block font-montserrat font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal ${
                      signupErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    {...registerSignup("confirmPassword")}
                  />
                  {signupErrors.confirmPassword && (
                    <p className="mt-1 text-red-600 text-sm">{signupErrors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 rounded-full transition-all"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>

          {/* Hero Section */}
          <div className="md:w-1/2 bg-beige-light rounded-xl p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-800 mb-6">
              Welcome to KavinoRa
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join our community of wellness enthusiasts and discover the comfort and confidence that KavinoRa products bring to your active lifestyle.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <i className="ri-check-line text-teal text-xl mr-3 mt-1"></i>
                <p>Access exclusive product launches and special offers</p>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-teal text-xl mr-3 mt-1"></i>
                <p>Track your orders and manage your shipping preferences</p>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-teal text-xl mr-3 mt-1"></i>
                <p>Save your favorite products for quick checkout</p>
              </div>
            </div>
            <div className="mt-8">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                alt="KavinoRa Products" 
                className="rounded-lg shadow-md w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;