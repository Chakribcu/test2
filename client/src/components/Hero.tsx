import { useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

const Hero = () => {
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
  });
  
  const waitlistMutation = useMutation({
    mutationFn: (data: WaitlistFormValues) => {
      return apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you when our product launches.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = useCallback((data: WaitlistFormValues) => {
    waitlistMutation.mutate(data);
  }, [waitlistMutation]);

  return (
    <section className="pt-16 pb-20 md:pt-20 md:pb-24 bg-beige-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-800 mb-4">
              Effortless Comfort for Every Step
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Introducing MotionMist™, the plant-based anti-chafing spray designed for runners, athletes, and active individuals.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
              <button 
                type="submit" 
                className="bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 px-8 rounded-full transition-all whitespace-nowrap"
                disabled={waitlistMutation.isPending}
              >
                {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img 
              src="https://pixabay.com/get/gbd20e1f06248868b2321297688b4c6d759a99b67d53173f852fb2cd83347348017d39e1f97d3a9c0a72d23e2a146826858308734326d6e60642e3760b60e2a8c_1280.jpg" 
              alt="KavinoRa MotionMist Anti-Chafing Spray" 
              className="rounded-xl shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
