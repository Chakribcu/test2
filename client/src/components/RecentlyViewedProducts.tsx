import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import ProductRecommendations from '../components/ProductRecommendations';

/**
 * RecentlyViewedProducts Component
 * 
 * A component that displays products that the user has recently viewed.
 * This component is intended for use on the cart page, checkout page, etc.
 */
const RecentlyViewedProducts = () => {
  const { user } = useAuth();
  const [hasViewedProducts, setHasViewedProducts] = useState(false);
  
  // Check if there are any recently viewed products in localStorage
  useEffect(() => {
    try {
      const recentlyViewed = localStorage.getItem('recentlyViewedProducts');
      if (recentlyViewed) {
        const products = JSON.parse(recentlyViewed);
        setHasViewedProducts(products.length > 0);
      }
    } catch (error) {
      console.error('Error checking recently viewed products:', error);
    }
  }, []);
  
  // Don't render anything if there are no recently viewed products
  if (!hasViewedProducts) {
    return null;
  }
  
  return (
    <section className="py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recently Viewed</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continue browsing products you've shown interest in.
          </p>
        </div>
        
        <ProductRecommendations 
          strategy="recently-viewed"
          userId={user?.id}
          title=""
          limit={4}
        />
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;