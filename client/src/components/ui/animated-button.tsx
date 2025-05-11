import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedButtonType = "bounce" | "shine" | "expand" | "pulse" | "ripple" | "circle" | "arrow";

interface AnimatedButtonProps {
  children: ReactNode;
  animationType?: AnimatedButtonType;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
  children,
  animationType = "bounce",
  className = "",
  isLoading = false,
  loadingText = "Loading...",
  iconLeft,
  iconRight,
  ...props
}: AnimatedButtonProps) {
  const getAnimationProps = () => {
    switch (animationType) {
      case "bounce":
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: { type: "spring", stiffness: 500, damping: 15 }
        };
      case "shine":
        return {
          whileHover: { 
            boxShadow: "0 0 8px rgba(255, 255, 255, 0.5), 0 0 16px rgba(255, 255, 255, 0.3)" 
          },
          transition: { duration: 0.3 }
        };
      case "expand":
        return {
          whileHover: { scale: 1.1, transition: { duration: 0.2 } },
          whileTap: { scale: 0.9 }
        };
      case "pulse":
        return {
          animate: { 
            scale: [1, 1.05, 1],
            transition: { 
              duration: 2, 
              repeat: Infinity,
              repeatType: "loop" as const
            }
          }
        };
      case "ripple":
        // The ripple effect is handled via CSS
        return {};
      case "circle":
        return {
          whileHover: { 
            borderRadius: "24px", 
            transition: { duration: 0.3 } 
          }
        };
      case "arrow":
        // Arrow animation uses children positioning
        return {};
      default:
        return {};
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{loadingText}</span>
        </div>
      );
    }

    if (animationType === "arrow") {
      return (
        <div className="group flex items-center justify-center">
          {iconLeft && <span className="mr-2">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight ? (
            <motion.span 
              className="ml-2"
              animate={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {iconRight}
            </motion.span>
          ) : (
            <motion.span 
              className="ml-2"
              animate={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </div>
    );
  };

  const getRippleClass = animationType === "ripple" 
    ? "relative overflow-hidden ripple-button" 
    : "";

  return (
    <motion.button
      className={cn(
        "btn-primary py-2 px-4 rounded-md", 
        getRippleClass,
        className
      )}
      disabled={isLoading || props.disabled}
      {...getAnimationProps()}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
}