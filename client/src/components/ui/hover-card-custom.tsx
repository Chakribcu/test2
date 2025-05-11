import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HoverCardCustomProps {
  children: ReactNode;
  content: ReactNode;
  direction?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  contentClassName?: string;
  showArrow?: boolean;
}

export function HoverCardCustom({
  children,
  content,
  direction = "top",
  delay = 0.2,
  className = "",
  contentClassName = "",
  showArrow = true
}: HoverCardCustomProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isVisible = isHovered || isFocused;
  
  // Animation variants based on direction
  const getVariants = () => {
    switch(direction) {
      case "top":
        return {
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 }
        };
      case "bottom":
        return {
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0 }
        };
      case "left":
        return {
          hidden: { opacity: 0, x: 10 },
          visible: { opacity: 1, x: 0 }
        };
      case "right":
        return {
          hidden: { opacity: 0, x: -10 },
          visible: { opacity: 1, x: 0 }
        };
    }
  };
  
  // Position styles for the content and arrow based on direction
  const getPositionStyles = () => {
    switch(direction) {
      case "top":
        return {
          content: "bottom-full mb-2",
          arrow: "top-full left-1/2 -translate-x-1/2 border-t-foreground border-x-transparent border-b-transparent border-x-[6px] border-t-[6px] border-b-0"
        };
      case "bottom":
        return {
          content: "top-full mt-2",
          arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-foreground border-x-transparent border-t-transparent border-x-[6px] border-b-[6px] border-t-0"
        };
      case "left":
        return {
          content: "right-full mr-2",
          arrow: "left-full top-1/2 -translate-y-1/2 border-l-foreground border-y-transparent border-r-transparent border-y-[6px] border-l-[6px] border-r-0"
        };
      case "right":
        return {
          content: "left-full ml-2",
          arrow: "right-full top-1/2 -translate-y-1/2 border-r-foreground border-y-transparent border-l-transparent border-y-[6px] border-r-[6px] border-l-0"
        };
    }
  };
  
  const positions = getPositionStyles();
  const variants = getVariants();
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 min-w-max max-w-xs bg-background text-foreground text-sm p-2 rounded-md shadow-md border border-border ${positions.content} ${contentClassName}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeOut", delay: isHovered ? delay : 0 }}
          >
            {content}
            
            {showArrow && (
              <div className={`absolute h-0 w-0 border-solid ${positions.arrow}`} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}