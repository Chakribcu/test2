import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "./optimized-image";

export interface ImageSliderProps {
  images: string[];
  aspectRatio?: "square" | "video" | "wide" | "auto";
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export const ImageSlider = ({
  images,
  aspectRatio = "square",
  autoplay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = "",
}: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  
  // Determine aspect ratio class
  const aspectRatioClass = 
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "video" ? "aspect-video" :
    aspectRatio === "wide" ? "aspect-[16/9]" : "";
  
  // Handle auto-rotation
  useEffect(() => {
    if (autoplay && !isHovered && images.length > 1) {
      timer.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }
    
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoplay, images.length, interval, isHovered]);
  
  // Navigate to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // Navigate to prev slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Swipe handlers for touch devices
  const handleTouchStart = useRef<number>(0);
  const handleTouchMove = useRef<number>(0);
  
  const handleTouchStartEvent = (e: React.TouchEvent) => {
    handleTouchStart.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchMoveEvent = (e: React.TouchEvent) => {
    handleTouchMove.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchEndEvent = () => {
    if (handleTouchStart.current - handleTouchMove.current > 50) {
      // Swipe left
      nextSlide();
    } else if (handleTouchStart.current - handleTouchMove.current < -50) {
      // Swipe right
      prevSlide();
    }
  };
  
  // Calculate next slide index for preloading
  const nextIndex = (currentIndex + 1) % images.length;
  
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${aspectRatioClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStartEvent}
      onTouchMove={handleTouchMoveEvent}
      onTouchEnd={handleTouchEndEvent}
    >
      {/* Preload next image */}
      {images.length > 1 && (
        <div className="hidden">
          <OptimizedImage 
            src={images[nextIndex]}
            alt={`Preload ${nextIndex + 1}`}
            width={1}
            height={1}
            lazyLoad={false}
            blurEffect={false}
          />
        </div>
      )}
      
      {/* Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <OptimizedImage 
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full"
            objectFit="cover"
            lazyLoad={false}
            blurEffect={true}
            quality={90}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.9 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1d1d1f] z-10 hover:bg-white transition-all duration-300"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.9 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1d1d1f] z-10 hover:bg-white transition-all duration-300"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </>
      )}
      
      {/* Dots Navigation */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "w-6 bg-white" 
                  : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Gradient overlay at bottom - Apple style */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default ImageSlider;