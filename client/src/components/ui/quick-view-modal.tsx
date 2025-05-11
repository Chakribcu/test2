import React from 'react';
import { useLocation } from "wouter";
import { ShoppingCart, Star, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import OptimizedImage from './optimized-image';

export interface ProductQuickView {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
}

interface QuickViewModalProps {
  product: ProductQuickView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = React.useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Reset quantity when modal opens/closes or product changes
  React.useEffect(() => {
    setQuantity(1);
  }, [open, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} (Qty: ${quantity}) has been added to your cart`,
    });

    onOpenChange(false);
  };

  const handleGoToProduct = () => {
    onOpenChange(false);
    navigate(`/product/${product.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 z-10">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-[#f5f5f7] relative">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              objectFit="cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="gap-2 text-left">
              <div className="flex flex-wrap gap-2 mb-2">
                {product.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              
              <DialogTitle className="text-xl font-bold leading-tight">{product.name}</DialogTitle>
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{product.reviews} reviews</span>
              </div>
              
              <div className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              
              <DialogDescription className="text-sm text-muted-foreground line-clamp-3">
                {product.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 mb-6">
              <p className="font-medium mb-2 text-sm">Quantity</p>
              <div className="inline-flex items-center border rounded-lg">
                <button 
                  className="p-1.5 hover:bg-muted/50 rounded-l-lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1.5 border-l border-r min-w-[2.5rem] text-center text-sm">
                  {quantity}
                </span>
                <button 
                  className="p-1.5 hover:bg-muted/50 rounded-r-lg"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Button 
                onClick={handleAddToCart}
                className="w-full"
                size="sm"
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                size="sm"
                onClick={handleGoToProduct}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}