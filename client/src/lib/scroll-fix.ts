/**
 * Optimized scrolling functions to improve performance and responsiveness
 */

/**
 * Apply scroll optimizations to the document
 * - Improves scrolling performance by using passive listeners
 * - Prevents overscroll behavior issues on iOS Safari
 * - Disables momentum scrolling for smoother experience
 */
export function applyScrollOptimizations() {
  // Fix for iOS Safari overscroll issues
  document.body.style.overscrollBehavior = 'none';
  
  // Use a self-calling function to safely modify the body style
  (function() {
    // Get the current body style
    const currentStyle = document.body.style.cssText || '';

    // Add scroll optimizations
    const optimizations = 
      'scroll-behavior: auto !important; ' +
      '-webkit-overflow-scrolling: auto !important;';
    
    // Apply optimizations if they aren't already present
    if (!currentStyle.includes(optimizations)) {
      document.body.style.cssText = currentStyle + optimizations;
    }
  })();
  
  // Add passive event listeners to improve scroll performance
  window.addEventListener('touchstart', function() {}, { passive: true });
  window.addEventListener('touchmove', function() {}, { passive: true });
  window.addEventListener('wheel', function() {}, { passive: true });
  window.addEventListener('scroll', function() {}, { passive: true });
}

/**
 * Smoothly scroll to an element with improved performance
 */
export function scrollToElement(element: HTMLElement, offset = 0) {
  try {
    // Use modern API for better performance
    const y = element.getBoundingClientRect().top + window.scrollY + offset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  } catch (error) {
    // Fallback for older browsers
    window.scrollTo(0, element.offsetTop + offset);
  }
}

/**
 * Scroll to top with improved performance
 */
export function improvedScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'auto'  // Using 'auto' for better performance vs 'smooth'
  });
}