import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

// NProgress-like component for page transitions
export default function NavigationProgress() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Start animation
    setVisible(true);
    setWidth(0);
    
    // Animate to 30% quickly
    const timer1 = setTimeout(() => {
      setWidth(30);
    }, 50);
    
    // Animate to 60% with a delay
    const timer2 = setTimeout(() => {
      setWidth(60);
    }, 100);
    
    // Animate to 80% with a longer delay
    const timer3 = setTimeout(() => {
      setWidth(80);
    }, 200);
    
    // Animate to 98% but never 100% until navigation completes
    const timer4 = setTimeout(() => {
      setWidth(98);
    }, 400);
    
    // Complete the animation
    const timer5 = setTimeout(() => {
      setWidth(100);
      
      // Hide after completion
      const timer6 = setTimeout(() => {
        setVisible(false);
      }, 200);
      
      return () => clearTimeout(timer6);
    }, 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [location]);
  
  if (!visible && width === 0) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-50">
      <div 
        className="h-full bg-primary shadow-sm"
        style={{
          width: `${width}%`,
          opacity: visible ? 1 : 0,
          transition: width === 100 
            ? 'width 200ms ease-out, opacity 200ms ease-in' 
            : 'width 200ms ease-out'
        }}
      />
    </div>
  );
}