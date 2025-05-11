import { useEffect } from 'react';
import ProductRecommendations from '../components/ProductRecommendations';

/**
 * PopularProducts Component
 * 
 * A component that displays popular products from the recommendation engine.
 * This component is intended for use on the home page, category pages, etc.
 */
const PopularProducts = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Most Popular Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our best-selling products that have become customer favorites. 
            Each item is crafted with premium materials and designed for exceptional performance.
          </p>
        </div>
        
        <ProductRecommendations 
          strategy="popular"
          title=""
          limit={3}
        />
      </div>
    </section>
  );
};

export default PopularProducts;