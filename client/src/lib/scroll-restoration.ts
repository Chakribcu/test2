/**
 * Utility functions for scroll management and restoration
 */

/**
 * Scrolls to the top of the page with a smooth animation
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Scrolls to the top of the page instantly without animation
 */
export function scrollToTopInstant() {
  window.scrollTo(0, 0);
}

/**
 * Use this hook in page components to ensure they start at the top
 * when navigated to
 */
export function useScrollToTop() {
  // This should be called from useEffect in components
  scrollToTopInstant();
}

/**
 * Handles scroll restoration for navigation in the application
 * @param nextPath The path being navigated to
 */
export function handleNavigationScroll(nextPath: string) {
  // Reset scroll position when navigating to a new page
  scrollToTopInstant();
}