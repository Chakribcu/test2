import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const ProductFeature = () => {
  const { toast } = useToast();
  
  const handleAddToCart = useCallback(() => {
    toast({
      title: "Added to cart!",
      description: "KavinoRa MotionMist™ has been added to your cart.",
    });
  }, [toast]);

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
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">MotionMist™</h2>
            <div className="flex items-center mb-6">
              <div className="text-teal mr-2">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-half-fill"></i>
              </div>
              <span className="text-gray-500 text-sm">(42 reviews)</span>
            </div>
            <p className="text-2xl font-montserrat font-bold text-teal mb-4">$24.99</p>
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
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 px-8 rounded-full transition-all flex items-center justify-center"
              >
                <i className="ri-shopping-cart-2-line mr-2"></i>
                Add to Cart
              </button>
              <Link href="/product" className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-montserrat font-medium py-3 px-8 rounded-full transition-all flex items-center justify-center">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeature;
