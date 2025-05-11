import { useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface NewsletterProps {
  forcedDisplay?: boolean;
}

const Newsletter = ({ forcedDisplay = false }: NewsletterProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Don't display for logged in users unless forcedDisplay is true
  if (user && !forcedDisplay) {
    return null;
  }
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
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

  return (
    <section className="py-16 bg-teal text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-montserrat font-bold mb-4">Join Our Community</h2>
          <p className="mb-8">Sign up to be the first to know about product launches, exclusive offers, and wellness tips.</p>
          
          <form 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full sm:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className={`w-full px-6 py-3 rounded-full focus:outline-none text-gray-800 ${errors.email ? "ring-2 ring-red-500" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-white text-sm text-left">{errors.email.message}</p>
              )}
            </div>
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-white text-teal hover:bg-beige hover:text-teal-dark font-montserrat font-medium px-8 py-3 rounded-full transition-all"
              disabled={newsletterMutation.isPending}
            >
              {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
