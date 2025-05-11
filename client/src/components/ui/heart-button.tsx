import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { motion } from 'framer-motion';

interface HeartButtonProps {
  productId: number;
  productDetails: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * HeartButton Component
 * 
 * Renders a heart button that toggles wishlist status for a product
 * - Animates when clicked
 * - Shows filled/outlined based on wishlist status
 * - Displays a pulse animation when added to wishlist
 */
export default function HeartButton({ 
  productId, 
  productDetails, 
  size = 'md',
  className = '' 
}: HeartButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // When component mounts, check if product is in wishlist
  useEffect(() => {
    setIsWishlisted(isInWishlist(productId));
  }, [productId, isInWishlist]);
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeItem(productId);
      setIsWishlisted(false);
    } else {
      addItem(productDetails);
      setIsWishlisted(true);
      setHasAnimated(true);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setHasAnimated(false);
      }, 1000);
    }
  };
  
  // Size variants
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      className={`${sizeClasses[size]} rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors relative ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {/* Pulse animation when added to wishlist */}
      {hasAnimated && (
        <motion.span
          initial={{ opacity: 0.8, scale: 0.2 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
      )}
      
      {/* Heart icon */}
      <Heart 
        className={`${iconSizes[size]} ${
          isWishlisted 
            ? "text-red-500 fill-red-500" 
            : "text-gray-600"
        }`} 
      />
      
      {/* Pop animation when clicked */}
      {hasAnimated && (
        <motion.span
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-full flex items-center justify-center"
        >
          <Heart className={`${iconSizes[size]} text-red-500 fill-red-500`} />
        </motion.span>
      )}
    </button>
  );
}