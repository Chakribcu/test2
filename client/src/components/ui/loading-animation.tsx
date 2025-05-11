import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LoadingType = 
  | "spinner" 
  | "dots" 
  | "pulse" 
  | "bounce" 
  | "bar" 
  | "skeleton" 
  | "progress";

interface LoadingAnimationProps {
  type?: LoadingType;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "foreground" | "background";
  className?: string;
  text?: string;
  progress?: number; // 0-100 for progress bar
}

export function LoadingAnimation({
  type = "spinner",
  size = "md",
  color = "primary",
  className = "",
  text,
  progress = 0
}: LoadingAnimationProps) {
  const getSizeClass = () => {
    switch (size) {
      case "xs": return "h-3 w-3";
      case "sm": return "h-4 w-4";
      case "md": return "h-8 w-8";
      case "lg": return "h-12 w-12";
      case "xl": return "h-16 w-16";
      default: return "h-8 w-8";
    }
  };

  const getColorClass = () => {
    switch (color) {
      case "primary": return "text-primary";
      case "secondary": return "text-secondary";
      case "accent": return "text-accent";
      case "foreground": return "text-foreground";
      case "background": return "text-background";
      default: return "text-primary";
    }
  };

  const renderLoading = () => {
    switch (type) {
      case "spinner":
        return (
          <div className={cn("relative", getSizeClass(), className)}>
            <svg
              className={cn("animate-spin", getColorClass())}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );

      case "dots":
        return (
          <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "rounded-full",
                  getSizeClass().replace("w-", "w-[").replace("h-", "h-[") + "]",
                  getColorClass()
                )}
                animate={{
                  y: ["0%", "-50%", "0%"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <motion.div
            className={cn(
              "rounded-full",
              getSizeClass(),
              getColorClass(),
              "bg-current opacity-75",
              className
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );

      case "bounce":
        return (
          <div className={cn("flex space-x-1", className)}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "rounded-full",
                  getSizeClass().replace("w-", "w-[").replace("h-", "h-[") + "]",
                  getColorClass(),
                  "bg-current"
                )}
                animate={{
                  y: ["0%", "-100%", "0%"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );

      case "bar":
        return (
          <div 
            className={cn(
              "relative h-1 w-full bg-muted overflow-hidden rounded-full",
              className
            )}
          >
            <motion.div
              className={cn("h-full", getColorClass(), "bg-current")}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: "50%" }}
            />
          </div>
        );

      case "skeleton":
        return (
          <div 
            className={cn(
              "w-full h-full rounded animate-pulse bg-muted/50",
              className
            )}
          />
        );

      case "progress":
        return (
          <div 
            className={cn(
              "relative h-2 w-full bg-muted overflow-hidden rounded-full",
              className
            )}
          >
            <motion.div
              className={cn("h-full", getColorClass(), "bg-current")}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        );

      default:
        return (
          <div className={cn("animate-spin", getSizeClass(), getColorClass(), className)}>
            ◌
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoading()}
      {text && <p className={cn("mt-2 text-sm", getColorClass())}>{text}</p>}
    </div>
  );
}