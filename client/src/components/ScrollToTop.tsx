import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { scrollToTopInstant } from '@/lib/scroll-restoration';

/**
 * Component that automatically scrolls to the top when the route changes
 */
const ScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Automatically scroll to top whenever location changes
    scrollToTopInstant();
  }, [location]);
  
  return null; // This component doesn't render anything
};

export default ScrollToTop;