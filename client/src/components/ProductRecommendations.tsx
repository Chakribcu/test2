import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  recommendationEngine, 
  RecommendationType, 
  Product 
} from '@/services/recommendationEngine';
import OptimizedImage from '@/components/ui/optimized-image';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

interface ProductRecommendationsProps {
  productId?: string;
  userId?: number;
  strategy?: RecommendationType;
  title?: string;
  limit?: number;
}

/**
 * ProductRecommendations Component
 * 
 * Displays a grid of recommended products based on the specified strategy.
 * Can be used on product pages, cart pages, home page, etc.
 */
const ProductRecommendations = ({
  productId,
  userId,
  strategy = 'popular',
  title = 'You Might Also Like',
  limit = 3
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addItem } = useCart();

  // Get recommendations when component mounts or inputs change
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const products = await recommendationEngine.getRecommendations(
          strategy,
          productId,
          userId,
          limit
        );
        setRecommendations(products);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [strategy, productId, userId, limit]);

  // Show skeleton loaders while fetching
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden border bg-card animate-pulse">
              <div className="h-72 bg-slate-200" />
              <div className="p-5 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-9 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No recommendations to show
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        {!productId && (
          <Button variant="outline" onClick={() => navigate("/product")}>
            View All Products
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((product) => (
          <div 
            key={product.id} 
            className="group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border bg-card"
            onClick={() => {
              // Track the view when a user clicks on a recommendation
              recommendationEngine.trackProductView(product.id);
              // Navigate to the product page
              navigate(`/product/${product.id}`);
            }}
          >
            <div className="h-72 bg-muted relative overflow-hidden cursor-pointer">
              <OptimizedImage 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                objectFit="cover"
                loadingStrategy="lazy"
              />
              
              {/* Price badge */}
              <div className="absolute top-4 right-4 bg-primary text-white rounded-full px-3 py-1 text-sm font-bold">
                ${product.price.toFixed(2)}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
              
              <Button 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  
                  // Add item to cart
                  addItem({
                    id: parseInt(product.id),
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.images[0]
                  });
                  
                  toast({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart`,
                  });
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;