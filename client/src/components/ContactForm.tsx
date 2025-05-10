import { useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });
  
  const contactMutation = useMutation({
    mutationFn: (data: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = useCallback((data: ContactFormValues) => {
    contactMutation.mutate(data);
  }, [contactMutation]);

  return (
    <section id="contact" className="py-16 bg-beige-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">We'd Love to Hear From You</h2>
            <p className="text-gray-600">Questions, comments, or just want to say hello? Drop us a message.</p>
          </div>
          
          <form 
            className="bg-white p-8 rounded-xl shadow-md"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block font-montserrat font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Your name" 
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block font-montserrat font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="your@email.com" 
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block font-montserrat font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all ${errors.message ? "border-red-500" : "border-gray-300"}`}
                placeholder="Your message" 
                {...register("message")}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-red-600 text-sm">{errors.message.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 px-8 rounded-full transition-all w-full md:w-auto"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
          
          <div className="mt-12 text-center">
            <p className="font-montserrat font-medium mb-4">Or reach us directly at:</p>
            <a href="mailto:hello@kavinora.com" className="text-teal hover:text-teal-dark transition-all">hello@kavinora.com</a>
            
            <div className="mt-6 flex justify-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-teal transition-all" aria-label="Instagram">
                <i className="ri-instagram-line text-2xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-teal transition-all" aria-label="TikTok">
                <i className="ri-tiktok-line text-2xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-teal transition-all" aria-label="Facebook">
                <i className="ri-facebook-circle-line text-2xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-teal transition-all" aria-label="Twitter">
                <i className="ri-twitter-line text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
