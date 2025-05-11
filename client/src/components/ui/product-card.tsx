import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import OptimizedImage from "./optimized-image";
import QuickViewModal, { ProductQuickView } from "./quick-view-modal";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
}

export const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  category,
  description = "Experience the difference with our premium quality products, designed with your lifestyle in mind.",
  rating = 4.5,
  reviews = 28,
  tags = [category, "KavinoRa"]
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Create product data for quick view
  const quickViewProduct: ProductQuickView = {
    id: id.toString(),
    name,
    price,
    image,
    description,
    rating,
    reviews,
    tags
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image
    });
    
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart`,
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${id}`}>
          <div className="h-full flex flex-col">
            {/* Product image container with animations */}
            <div className="relative overflow-hidden rounded-2xl bg-[#f5f5f7] mb-5 aspect-square">
              {/* Main product image */}
              <motion.div
                animate={{
                  y: isHovered ? -10 : 0,
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full"
              >
                <OptimizedImage
                  src={image}
                  alt={name}
                  className="w-full h-full"
                  objectFit="cover"
                />
              </motion.div>
              
              {/* Floating category tag */}
              <div className="absolute top-3 left-3 text-xs font-medium bg-black/10 backdrop-blur-md rounded-full px-3 py-1 text-white">
                {category}
              </div>
              
              {/* Quick action buttons that appear on hover */}
              <motion.div 
                className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quick view button */}
                <button 
                  className="bg-white/90 backdrop-blur-md text-[#1d1d1f] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white transition-colors"
                  onClick={handleQuickView}
                >
                  Quick View
                </button>
                
                {/* Add to cart button - reduced size */}
                <button 
                  className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/90 transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </div>
            
            {/* Product info with subtle animations */}
            <div className="flex-grow flex flex-col">
              {/* Product name with hover animation */}
              <motion.h3 
                className="font-medium text-[#1d1d1f] mb-1 group-hover:text-primary transition-colors"
                animate={{
                  y: isHovered ? -2 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {name}
              </motion.h3>
              
              {/* Price with hover animation */}
              <motion.p 
                className="text-[#6e6e73] text-sm mb-3"
                animate={{
                  y: isHovered ? -2 : 0
                }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                From ${price}
              </motion.p>
              
              {/* Buy now button that appears on hover */}
              <motion.div 
                className="mt-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0, 
                  height: isHovered ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <button 
                  className="w-full bg-[#f5f5f7] hover:bg-[#e5e5e7] py-2 rounded-full text-sm font-medium text-[#1d1d1f] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(e);
                    window.location.href = "/checkout";
                  }}
                >
                  Buy Now
                </button>
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.div>
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
};

export default ProductCard;