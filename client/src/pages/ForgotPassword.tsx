import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";

// Schema for the forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Mutation for password reset request
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const res = await apiRequest("POST", "/api/forgot-password", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for instructions to reset your password.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Unable to process your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ForgotPasswordFormValues) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <Layout>
      <SEOHead
        title="Forgot Password | KavinoRa"
        description="Reset your password for your KavinoRa account"
      />
      <div className="container max-w-md mx-auto py-12 px-4">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/auth")} 
          className="mb-6 pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-3">Email Sent</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to your email address. Please check your inbox.
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </Button>
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => setLocation("/auth")}
              >
                Return to login
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="input-apple w-full pl-10"
                    placeholder="Enter your email address"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}