import { useState, useEffect } from 'react';
import { 
  recommendationEngine, 
  RecommendationType, 
  Product 
} from '@/services/recommendationEngine';

/**
 * Hook for easily accessing product recommendations
 * 
 * This custom hook provides an easy way to access product recommendations
 * from any component in the application.
 * 
 * @param strategy - The recommendation strategy to use
 * @param productId - The current product ID (for similar products)
 * @param userId - The current user ID (for personalized recommendations)
 * @param limit - Maximum number of recommendations to return
 * @returns Object containing recommendations and loading state
 */
export function useRecommendations(
  strategy: RecommendationType = 'popular',
  productId?: string,
  userId?: number,
  limit: number = 3
) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const products = await recommendationEngine.getRecommendations(
          strategy,
          productId,
          userId,
          limit
        );
        
        if (isMounted) {
          setRecommendations(products);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();
    
    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, [strategy, productId, userId, limit]);

  // Function to track product view
  const trackProductView = (productId: string) => {
    recommendationEngine.trackProductView(productId);
  };

  return {
    recommendations,
    loading,
    error,
    trackProductView
  };
}

export default useRecommendations;