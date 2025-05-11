import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  message?: string;
}

/**
 * Loading spinner component with customizable size and optional message
 * Can be used inline or fullscreen
 */
export function Loading({
  size = "md",
  fullScreen = false,
  message
}: LoadingProps) {
  // Determine spinner size based on prop
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const spinnerClass = sizeMap[size];
  
  // If fullscreen, center in viewport
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <Loader2 className={`${spinnerClass} animate-spin text-primary`} />
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }
  
  // Regular inline loading spinner
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Loader2 className={`${spinnerClass} animate-spin text-primary`} />
      {message && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

/**
 * Full page loading spinner that takes up the entire viewport
 */
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/**
 * Loading spinner for buttons
 */
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return <Loader2 className={`${sizeClass} animate-spin`} />;
}

export default Loading;