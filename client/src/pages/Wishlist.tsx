import { useState } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/optimized-image";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isGrid, setIsGrid] = useState(true);

  const handleAddToCart = (item: any) => {
    // Convert wishlist item to cart item format
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    };
    
    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
      variant: "default",
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          
          <Alert className="mb-6">
            <div className="flex flex-col items-center py-8 text-center">
              <Heart className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <AlertTitle className="text-xl mb-2">Your wishlist is empty</AlertTitle>
              <AlertDescription className="text-muted-foreground mb-6">
                Add items to your wishlist to save them for later.
              </AlertDescription>
              <Link href="/product">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Wishlist ({items.length} items)</h1>
          
          <div className="flex gap-4">
            {/* View toggle */}
            <div className="hidden md:flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setIsGrid(true)}
                className={`px-3 py-1.5 text-sm flex items-center ${isGrid ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                Grid
              </button>
              <button 
                onClick={() => setIsGrid(false)}
                className={`px-3 py-1.5 text-sm flex items-center ${!isGrid ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
                aria-label="List view"
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                List
              </button>
            </div>
            
            {/* Clear button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearWishlist}
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Wishlist
            </Button>
          </div>
        </div>
        
        {isGrid ? (
          // Grid view
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Link href={`/product/${item.id}`}>
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      className="w-full h-full transition-transform group-hover:scale-105"
                    />
                  </Link>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                  {item.category && (
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1.5" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                  <Link href={`/product/${item.id}`}>
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  </Link>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.category && (
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      )}
                    </div>
                    <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1.5" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}