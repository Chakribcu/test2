import { useEffect, useState, useRef, MutableRefObject } from "react";

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * A hook to detect when an element is visible in the viewport
 * Used for triggering scroll-based animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
): [MutableRefObject<T | null>, boolean] {
  const { 
    threshold = 0.1, 
    rootMargin = "0px", 
    triggerOnce = true 
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);
  const prevValueRef = useRef<boolean>(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isCurrentlyVisible = entry.isIntersecting;

        // Only update state if value has changed, or if we want to trigger more than once
        if (isCurrentlyVisible !== prevValueRef.current || !triggerOnce) {
          setIsVisible(isCurrentlyVisible);
          prevValueRef.current = isCurrentlyVisible;
        }

        // If visible and only want to trigger once, unobserve
        if (isCurrentlyVisible && triggerOnce) {
          observer.unobserve(currentElement);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
}