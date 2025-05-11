import { useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import Layout from "@/components/Layout";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us | KavinoRa";
  }, []);

  return (
    <Layout>
      <div className="pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-800 mb-4 text-center">Contact Us</h1>
            <p className="text-xl text-center text-gray-600 mb-12">We'd love to hear from you! Reach out with questions, feedback, or partnership inquiries.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-beige-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-mail-line text-teal text-xl"></i>
                </div>
                <h3 className="font-montserrat font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">For general inquiries:</p>
                <a href="mailto:hello@kavinora.com" className="text-teal hover:text-teal-dark transition-all">hello@kavinora.com</a>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-beige-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-2-line text-teal text-xl"></i>
                </div>
                <h3 className="font-montserrat font-semibold text-lg mb-2">Customer Support</h3>
                <p className="text-gray-600 mb-2">We're here to help!</p>
                <a href="mailto:support@kavinora.com" className="text-teal hover:text-teal-dark transition-all">support@kavinora.com</a>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-beige-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-building-line text-teal text-xl"></i>
                </div>
                <h3 className="font-montserrat font-semibold text-lg mb-2">Business Inquiries</h3>
                <p className="text-gray-600 mb-2">For partnerships and wholesale:</p>
                <a href="mailto:business@kavinora.com" className="text-teal hover:text-teal-dark transition-all">business@kavinora.com</a>
              </div>
            </div>
            
            <ContactForm />
            
            <div className="mt-16 text-center">
              <h2 className="font-montserrat font-bold text-2xl mb-6">Follow Us on Social Media</h2>
              <div className="flex justify-center space-x-6">
                <a href="#" className="w-12 h-12 bg-beige hover:bg-beige-dark rounded-full flex items-center justify-center transition-all" aria-label="Instagram">
                  <i className="ri-instagram-line text-2xl text-gray-700"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-beige hover:bg-beige-dark rounded-full flex items-center justify-center transition-all" aria-label="TikTok">
                  <i className="ri-tiktok-line text-2xl text-gray-700"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-beige hover:bg-beige-dark rounded-full flex items-center justify-center transition-all" aria-label="Facebook">
                  <i className="ri-facebook-circle-line text-2xl text-gray-700"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-beige hover:bg-beige-dark rounded-full flex items-center justify-center transition-all" aria-label="Twitter">
                  <i className="ri-twitter-line text-2xl text-gray-700"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;