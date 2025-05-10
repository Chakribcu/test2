import { useCallback } from "react";
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

const ProductFeature = () => {
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

  const benefits = [
    "Prevents friction and irritation",
    "Water-resistant formula",
    "Dermatologist tested and approved",
    "100% plant-based ingredients"
  ];

  const tags = ["Plant-Based", "Dermatologist-Tested", "Cruelty-Free"];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <img 
              src="https://pixabay.com/get/gcaad987746b5d5001966afbcd8f0ecf2b1b7d8205f291b5057e558a4d15d927a53a27226db219d14aa471f174e57c2b0ae1394ebc936a4f90ab9b3b839eb8d4d_1280.jpg" 
              alt="KavinoRa MotionMist Product Detail" 
              className="rounded-xl shadow-lg w-full h-auto" 
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">MotionMist™</h2>
            <p className="text-lg text-gray-600 mb-6">
              Our breakthrough anti-chafing spray that provides long-lasting comfort during any activity. The lightweight formula applies easily and dries instantly.
            </p>
            
            <div className="mb-8">
              <h3 className="font-montserrat font-semibold text-xl mb-4">Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <i className="ri-check-line text-teal text-xl mr-2 mt-0.5"></i>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-wrap mb-8">
              {tags.map((tag, index) => (
                <span key={index} className="bg-beige rounded-full px-4 py-2 text-sm font-montserrat mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
            
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
                disabled={notifyMutation.isPending}
              >
                {notifyMutation.isPending ? "Submitting..." : "Notify Me When Available"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeature;
