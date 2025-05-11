import { useRef, ReactNode, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  overflow?: "hidden" | "visible";
  zIndex?: number;
  backgroundImage?: string;
  height?: string;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export function ParallaxSection({ 
  children, 
  className = "", 
  speed = 0.2,
  direction = "up",
  overflow = "hidden",
  zIndex = 0,
  backgroundImage,
  height = "auto",
  springConfig = { stiffness: 50, damping: 30, mass: 1 }
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(0);

  // Update window height on mount
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate parallax transformation
  const getTransform = () => {
    if (direction === "up" || direction === "down") {
      const y = useTransform(
        scrollYProgress, 
        [0, 1], 
        direction === "up" ? [0, -windowHeight * speed] : [0, windowHeight * speed]
      );
      return { y: useSpring(y, springConfig) };
    } else {
      const x = useTransform(
        scrollYProgress, 
        [0, 1], 
        direction === "left" ? [0, -windowHeight * speed] : [0, windowHeight * speed]
      );
      return { x: useSpring(x, springConfig) };
    }
  };

  const transformProps = getTransform();

  return (
    <div 
      ref={ref}
      className={`relative ${overflow === "hidden" ? "overflow-hidden" : "overflow-visible"} ${className}`}
      style={{ 
        zIndex,
        height,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? "cover" : undefined,
        backgroundPosition: backgroundImage ? "center" : undefined
      }}
    >
      <motion.div
        style={{
          ...transformProps,
          width: "100%",
          height: "100%"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}