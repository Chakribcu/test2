import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '@/lib/scroll-restoration';

interface BackToTopProps {
  showAfterScrollY?: number; // Pixel amount to scroll before showing
  bottom?: number; // Pixel distance from bottom
  right?: number; // Pixel distance from right
}

/**
 * A button that appears after scrolling down and allows users to scroll back to top
 */
const BackToTop = ({
  showAfterScrollY = 200,
  bottom = 30,
  right = 30,
}: BackToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event to show/hide the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfterScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfterScrollY]);

  // Handle click to scroll to top
  const handleClick = () => {
    scrollToTop();
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={handleClick}
          aria-label="Back to top"
          className="fixed z-50 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          style={{ bottom: `${bottom}px`, right: `${right}px` }}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default BackToTop;