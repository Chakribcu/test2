import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  itemCount: number;
}

export const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [items]);

  const addItem = (item: WishlistItem) => {
    // Check if item is already in wishlist
    if (!items.some((i) => i.id === item.id)) {
      setItems([...items, item]);
      toast({
        title: "Added to Wishlist",
        description: `${item.name} has been added to your wishlist.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Already in Wishlist",
        description: "This item is already in your wishlist.",
        variant: "default",
      });
    }
  };

  const removeItem = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      setItems(items.filter((item) => item.id !== id));
      toast({
        title: "Removed from Wishlist",
        description: `${itemToRemove.name} has been removed from your wishlist.`,
        variant: "default",
      });
    }
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
      variant: "default",
    });
  };

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};