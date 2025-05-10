import { useCallback, useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ChevronRight, ShoppingCart } from "lucide-react";

// Sample products data - in a real app, this would come from an API
const products = [
  {
    id: "1",
    name: "MotionMist™ Anti-Chafing Spray",
    slug: "motionmist-anti-chafing-spray",
    price: 29.99,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://i.imgur.com/vAr3b3G.jpeg"
    ],
    description: "Our breakthrough anti-chafing spray provides long-lasting comfort during any activity. The lightweight formula applies easily, dries instantly, and creates an invisible protective barrier between your skin and clothing.",
    features: [
      "Prevents friction and irritation in high-friction areas",
      "Water-resistant formula that lasts through intense workouts",
      "Dermatologist tested and approved for sensitive skin",
      "100% plant-based ingredients for natural protection",
      "Quick-drying and non-greasy application",
      "Free from parabens, sulfates, and synthetic fragrances",
      "Suitable for all skin types",
      "Eco-friendly packaging"
    ],
    tags: ["Plant-Based", "Dermatologist-Tested", "Cruelty-Free", "Vegan", "Eco-Friendly"],
    inStock: true
  },
  {
    id: "2",
    name: "KavinoRa Wellness Tea",
    slug: "wellness-tea",
    price: 24.99,
    rating: 4.9,
    reviews: 89,
    images: [
      "https://i.imgur.com/kSDJFN7.jpeg"
    ],
    description: "Our signature herbal tea blend crafted to promote relaxation, reduce stress, and enhance overall wellness. Each cup delivers a soothing experience with carefully selected organic ingredients.",
    features: [
      "Organic blend of chamomile, lavender, and lemon balm",
      "Promotes relaxation and reduces stress",
      "Supports digestive health",
      "Caffeine-free for any time of day",
      "Hand-blended in small batches",
      "Biodegradable tea bags",
      "30 servings per package",
      "Sustainable packaging"
    ],
    tags: ["Organic", "Caffeine-Free", "Non-GMO", "Fair Trade", "Sustainable"],
    inStock: true
  },
  {
    id: "3",
    name: "Mindfulness Journal",
    slug: "mindfulness-journal",
    price: 39.95,
    rating: 4.7,
    reviews: 56,
    images: [
      "https://i.imgur.com/vbRMEpZ.jpeg"
    ],
    description: "Our beautiful, eco-friendly journal designed specifically to guide your mindfulness practice. With structured prompts, reflection pages, and mood tracking, it's the perfect companion for your wellness journey.",
    features: [
      "200 pages of premium recycled paper",
      "Structured daily prompts and reflection exercises",
      "Monthly mood and habit trackers",
      "Guided meditation scripts",
      "Inspirational quotes throughout",
      "Lies flat when open for easy writing",
      "Elastic closure band and bookmark ribbon",
      "Made with sustainable materials"
    ],
    tags: ["Eco-Friendly", "Mindfulness", "Self-Care", "Sustainable", "Recycled"],
    inStock: true
  }
];

const Product = () => {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // If we're on the main product listing page
  if (!id) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Products</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-64 bg-muted relative overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <Badge variant="outline" className="text-primary">${product.price.toFixed(2)}</Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{product.tags.length - 3} more</Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/product/${product.id}`)}>
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (user) {
                          toast({
                            title: "Added to Cart",
                            description: `${product.name} has been added to your cart`,
                          });
                        } else {
                          navigate("/auth");
                        }
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  // Product detail page
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => navigate("/product")}>
            View All Products
          </Button>
        </div>
      </Layout>
    );
  }
  
  useEffect(() => {
    document.title = `${product.name} | KavinoRa`;
  }, [product.name]);
  
  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsAddingToCart(false);
      
      toast({
        title: "Added to Cart",
        description: `${product.name} (Qty: ${quantity}) has been added to your cart`,
      });
      
      // Reset quantity after adding to cart
      setQuantity(1);
    }, 600);
  }, [product.name, quantity, toast]);
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="md:w-1/2">
            <div className="relative bg-muted rounded-lg overflow-hidden mb-4 h-96">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="md:w-1/2">
            <div className="flex items-center mb-2 text-sm">
              <Button 
                variant="link" 
                className="text-muted-foreground p-0 h-auto" 
                onClick={() => navigate("/product")}
              >
                Products
              </Button>
              <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
              <span className="text-muted-foreground">{product.name}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            
            <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <p className="mb-4">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="flex items-center text-sm mb-4">
                <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <label htmlFor="quantity" className="w-24">Quantity:</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <div className="h-8 px-4 flex items-center justify-center border-y">
                    {quantity}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate("/cart"), 600);
                }}
                disabled={isAddingToCart || !product.inStock}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, i) => (
              <div key={i} className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.filter(p => p.id !== product.id).map((relatedProduct) => (
              <div key={relatedProduct.id} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted">
                  <img 
                    src={relatedProduct.images[0]} 
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <p className="text-primary font-bold mb-3">${relatedProduct.price.toFixed(2)}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
