import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import OptimizedImage from "./optimized-image";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
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
                lazyLoad={true}
                blurEffect={true}
                quality={85}
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
                onClick={(e) => {
                  e.preventDefault();
                  // Add quick view functionality here
                }}
              >
                Quick View
              </button>
              
              {/* Add to cart button - reduced size */}
              <button 
                className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/90 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart functionality here
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                  <path d="M20 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
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
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                height: isHovered ? 'auto' : 0,
                marginTop: isHovered ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <button className="w-full bg-[#f5f5f7] hover:bg-[#e5e5e7] py-2 rounded-full text-sm font-medium text-[#1d1d1f] transition-colors">
                Buy Now
              </button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;