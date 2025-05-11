import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, CheckCircle } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface NewsletterProps {
  forcedDisplay?: boolean;
  variant?: "default" | "inline";
}

const Newsletter = ({ forcedDisplay = false, variant = "default" }: NewsletterProps) => {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: ""
    }
  });
  
  const newsletterMutation = useMutation({
    mutationFn: (data: NewsletterFormValues) => {
      return apiRequest("POST", "/api/newsletter", data);
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setIsSubscribed(true);
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = useCallback((data: NewsletterFormValues) => {
    newsletterMutation.mutate(data);
  }, [newsletterMutation]);

  if (variant === "inline") {
    return (
      <div className="w-full py-6">
        {isSubscribed ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
            <CheckCircleIcon className="h-10 w-10 text-primary" />
            <p className="text-lg font-medium">Thanks for subscribing!</p>
            <p className="text-sm text-muted-foreground">We'll keep you updated with the latest news and offers.</p>
          </div>
        ) : (
          <form 
            className="flex flex-col space-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className="text-sm font-medium">Get the latest updates</p>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                disabled={newsletterMutation.isPending}
              >
                {newsletterMutation.isPending ? "..." : "Subscribe"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="py-16 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {isSubscribed ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircleIcon className="h-16 w-16 text-primary" />
              <h2 className="text-3xl font-bold">Thanks for subscribing!</h2>
              <p className="text-muted-foreground">We'll keep you updated with the latest product launches, exclusive offers, and wellness tips.</p>
            </div>
          ) : (
            <>
              <EnvelopeOpenIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Connected</h2>
              <p className="mb-8 text-muted-foreground">Sign up to be the first to know about new products, exclusive offers, and wellness tips.</p>
              
              <form 
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="w-full sm:w-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className={`w-full px-6 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.email ? "border-red-500 ring-red-500" : "border-gray-300"}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-600 text-xs text-left">{errors.email.message}</p>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full transition-colors"
                  disabled={newsletterMutation.isPending}
                >
                  {newsletterMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : "Subscribe"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
