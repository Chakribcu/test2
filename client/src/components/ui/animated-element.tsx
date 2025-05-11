import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationType = 
  | "fadeIn" 
  | "slideUp" 
  | "slideDown" 
  | "slideLeft" 
  | "slideRight" 
  | "scale" 
  | "pulse" 
  | "bounce" 
  | "rotate" 
  | "staggered";

interface AnimatedElementProps {
  children: ReactNode;
  type: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
  onClick?: () => void;
  isVisible?: boolean;
  custom?: any;
  id?: string;
  once?: boolean;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: "some" | "all" | number;
  }
}

export function AnimatedElement({
  children,
  type,
  duration = 0.5,
  delay = 0,
  className,
  onClick,
  isVisible = true,
  custom,
  id,
  once = false,
  viewport
}: AnimatedElementProps) {
  const animations: Record<AnimationType, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, transition: { duration: duration * 0.75 } }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, y: -20, transition: { duration: duration * 0.75 } }
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, y: 20, transition: { duration: duration * 0.75 } }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, x: -20, transition: { duration: duration * 0.75 } }
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, x: 20, transition: { duration: duration * 0.75 } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, scale: 0.95, transition: { duration: duration * 0.75 } }
    },
    pulse: {
      hidden: { opacity: 1, scale: 1 },
      visible: { 
        opacity: 1, 
        scale: [1, 1.03, 1],
        transition: { 
          duration: duration * 1.5, 
          delay, 
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          ease: "easeInOut"
        }
      }
    },
    bounce: {
      hidden: { opacity: 1, y: 0 },
      visible: { 
        opacity: 1, 
        y: [0, -10, 0],
        transition: { 
          duration: duration * 1.5, 
          delay, 
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
          ease: "easeInOut"
        }
      }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -5 },
      visible: { 
        opacity: 1, 
        rotate: 0,
        transition: { duration, delay, ease: "easeOut" }
      },
      exit: { opacity: 0, rotate: 5, transition: { duration: duration * 0.75 } }
    },
    staggered: {
      hidden: { opacity: 0, y: 20 },
      visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: delay + i * 0.1,
          duration,
          ease: "easeOut"
        }
      }),
      exit: { opacity: 0, transition: { duration: duration * 0.75 } }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          id={id}
          className={className}
          onClick={onClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animations[type]}
          custom={custom}
          whileHover={onClick ? { scale: 1.02 } : undefined}
          whileTap={onClick ? { scale: 0.98 } : undefined}
          {...(viewport && { viewport })}
          {...(once && { animate: "visible", whileInView: "visible" })}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}