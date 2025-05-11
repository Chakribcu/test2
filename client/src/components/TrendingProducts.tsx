import ProductRecommendations from './ProductRecommendations';

/**
 * TrendingProducts Component
 * 
 * A component that displays trending products from the recommendation engine.
 * Shows products that are currently popular or gaining popularity.
 */
const TrendingProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay ahead of the curve with our trending products. These are the items 
            our customers are currently loving and talking about.
          </p>
        </div>
        
        <ProductRecommendations 
          strategy="trending"
          title=""
          limit={3}
        />
      </div>
    </section>
  );
};

export default TrendingProducts;