import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ThumbsUp, ThumbsDown, Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface PersonalizationProps {
  userId?: number;
  limit?: number;
}

export function Personalization({ userId, limit = 4 }: PersonalizationProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'recommended' | 'trending' | 'favorites'>('recommended');
  
  // Mock query for personalization data
  const { data: personalizedProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/personalization', activeTab, userId || user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/personalization?type=${activeTab}&userId=${userId || user?.id}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch personalized products');
      return res.json();
    },
    enabled: !!userId || !!user?.id,
  });

  // Use sample data if API call fails or while loading
  const fallbackProducts: Product[] = [
    {
      id: "prod-1",
      name: "Ergonomic Walking Shoes",
      price: 129.99,
      image: "https://placehold.co/300x300/e4e4e7/71717a?text=Ergonomic+Shoes",
      description: "Advanced comfort technology for all-day support",
      category: "footwear"
    },
    {
      id: "prod-2",
      name: "Wellness Insoles",
      price: 49.99,
      image: "https://placehold.co/300x300/e4e4e7/71717a?text=Wellness+Insoles",
      description: "Pressure-point relief with memory foam technology",
      category: "accessories"
    },
    {
      id: "prod-3",
      name: "Recovery Slip-ons",
      price: 89.99,
      image: "https://placehold.co/300x300/e4e4e7/71717a?text=Recovery+Shoes",
      description: "Post-workout recovery shoes for tired feet",
      category: "footwear"
    },
    {
      id: "prod-4",
      name: "Arch Support Sandals",
      price: 79.99,
      image: "https://placehold.co/300x300/e4e4e7/71717a?text=Arch+Support+Sandals",
      description: "Summer comfort without sacrificing support",
      category: "footwear"
    }
  ];

  const products = personalizedProducts || fallbackProducts;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Personalized For You</h2>
          <p className="text-muted-foreground">Discover products tailored to your preferences and wellness needs</p>
          
          <div className="flex space-x-4 mt-6 border-b border-border">
            <button 
              onClick={() => setActiveTab('recommended')}
              className={`pb-2 px-1 font-medium text-sm relative ${activeTab === 'recommended' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70'}`}
            >
              Recommended For You
            </button>
            <button 
              onClick={() => setActiveTab('trending')}
              className={`pb-2 px-1 font-medium text-sm relative ${activeTab === 'trending' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70'}`}
            >
              Trending Now
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`pb-2 px-1 font-medium text-sm relative ${activeTab === 'favorites' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70'}`}
            >
              Your Favorites
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="relative group">
                <div className="overflow-hidden rounded-xl bg-secondary/50 aspect-square mb-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-foreground rounded-full p-2 shadow-sm transition-all">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-foreground mb-1">{product.name}</h3>
                <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
                
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:text-primary transition-colors" aria-label="Like">
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:text-primary transition-colors" aria-label="Dislike">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">AI-recommended</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {user && (
          <div className="mt-8 bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">How are these recommendations created?</h3>
            <p className="text-xs text-muted-foreground">
              We use AI to analyze your browsing history, previous purchases, and wellness data to recommend products 
              that may benefit your specific needs. You can improve your recommendations by providing feedback on products.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}