import { useCallback, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

const notifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NotifyFormValues = z.infer<typeof notifySchema>;

const Product = () => {
  useEffect(() => {
    document.title = "MotionMist™ Anti-Chafing Spray | KavinoRa";
  }, []);

  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NotifyFormValues>({
    resolver: zodResolver(notifySchema),
  });
  
  const notifyMutation = useMutation({
    mutationFn: (data: NotifyFormValues) => {
      return apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You'll be notified when MotionMist™ becomes available.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = useCallback((data: NotifyFormValues) => {
    notifyMutation.mutate(data);
  }, [notifyMutation]);

  const features = [
    "Prevents friction and irritation in high-friction areas",
    "Water-resistant formula that lasts through intense workouts",
    "Dermatologist tested and approved for sensitive skin",
    "100% plant-based ingredients for natural protection",
    "Quick-drying and non-greasy application",
    "Free from parabens, sulfates, and synthetic fragrances",
    "Suitable for all skin types",
    "Eco-friendly packaging"
  ];

  const howToUse = [
    "Shake well before use",
    "Hold can 3-4 inches from skin",
    "Spray a light layer on areas prone to chafing",
    "Allow to dry for 60 seconds before activity",
    "Reapply as needed for extended activity"
  ];

  const tags = ["Plant-Based", "Dermatologist-Tested", "Cruelty-Free", "Vegan", "Eco-Friendly"];

  return (
    <div className="pt-12 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-800 mb-4 text-center">MotionMist™</h1>
          <p className="text-xl text-center text-gray-600 mb-12">Anti-Chafing Spray for Active Lifestyles</p>
          
          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            <div className="lg:w-1/2">
              <div className="bg-beige-light p-6 rounded-xl mb-8">
                <img 
                  src="https://pixabay.com/get/gbd20e1f06248868b2321297688b4c6d759a99b67d53173f852fb2cd83347348017d39e1f97d3a9c0a72d23e2a146826858308734326d6e60642e3760b60e2a8c_1280.jpg" 
                  alt="KavinoRa MotionMist Anti-Chafing Spray" 
                  className="w-full h-auto rounded-lg shadow-sm" 
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-beige rounded-full px-4 py-2 text-sm font-montserrat">
                    {tag}
                  </span>
                ))}
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="bg-beige-light p-6 rounded-xl">
                <h3 className="font-montserrat font-semibold text-lg mb-4">Get Notified When Available</h3>
                <div className="flex flex-col sm:flex-row gap-4">
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
                    disabled={notifyMutation.isPending}
                  >
                    {notifyMutation.isPending ? "Submitting..." : "Notify Me"}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="font-montserrat font-bold text-2xl mb-4">About MotionMist™</h2>
              <p className="text-gray-700 mb-6">
                MotionMist™ is our breakthrough anti-chafing spray that provides long-lasting comfort during any activity. The lightweight formula applies easily, dries instantly, and creates an invisible protective barrier between your skin and clothing.
              </p>
              
              <h3 className="font-montserrat font-semibold text-xl mb-3">Key Features</h3>
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <i className="ri-check-line text-teal text-xl mr-2 mt-0.5"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="font-montserrat font-semibold text-xl mb-3">How to Use</h3>
              <ol className="list-decimal pl-5 space-y-2 mb-8">
                {howToUse.map((step, index) => (
                  <li key={index} className="pl-2">{step}</li>
                ))}
              </ol>
              
              <h3 className="font-montserrat font-semibold text-xl mb-3">Perfect For</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-beige p-4 rounded-lg text-center">
                  <i className="ri-run-line text-teal text-2xl mb-2"></i>
                  <p>Runners</p>
                </div>
                <div className="bg-beige p-4 rounded-lg text-center">
                  <i className="ri-bike-line text-teal text-2xl mb-2"></i>
                  <p>Cyclists</p>
                </div>
                <div className="bg-beige p-4 rounded-lg text-center">
                  <i className="ri-fitness-line text-teal text-2xl mb-2"></i>
                  <p>Gym Enthusiasts</p>
                </div>
                <div className="bg-beige p-4 rounded-lg text-center">
                  <i className="ri-basketball-line text-teal text-2xl mb-2"></i>
                  <p>Athletes</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-beige-light p-8 rounded-xl">
            <h2 className="font-montserrat font-bold text-2xl mb-6 text-center">Coming Soon: User Testimonials</h2>
            <p className="text-center text-gray-700">
              We're currently in the final testing phase with our community of athletes and active individuals. Check back soon to see what they're saying about MotionMist™!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
