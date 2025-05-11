import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search as SearchIcon, X } from 'lucide-react';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from './optimized-image';

// Mock product data - in a real app, this would come from the API
const sampleProducts = [
  {
    id: "1",
    name: "MotionMist™ Anti-Chafing Spray",
    price: 29.99,
    category: "Body Care",
    image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?q=80&w=1887&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "KavinoRa Wellness Tea",
    price: 24.99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1887&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Mindfulness Journal",
    price: 39.95,
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?q=80&w=1887&auto=format&fit=crop",
  },
];

// Category suggestions for search
const categories = [
  { id: "1", name: "Body Care", count: 8 },
  { id: "2", name: "Wellness", count: 12 },
  { id: "3", name: "Lifestyle", count: 6 },
  { id: "4", name: "Beverages", count: 4 },
];

// Top searches for suggestions
const topSearches = ["Anti-chafing", "Wellness", "Tea", "Journal", "Organic"];

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter products based on search query
  const filteredProducts = query 
    ? sampleProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  
  useEffect(() => {
    // Add keyboard shortcut (⌘+K or Ctrl+K) to open search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleProductSelect = (productId: string) => {
    navigate(`/product/${productId}`);
    setOpen(false);
  };
  
  const handleCategorySelect = (category: string) => {
    // In a real app, navigate to filtered product listing
    navigate(`/product?category=${encodeURIComponent(category)}`);
    setOpen(false);
  };
  
  const handleSearchSubmit = () => {
    if (query.trim()) {
      navigate(`/product?search=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 sm:h-9 sm:w-auto sm:pr-12 md:w-40 lg:w-64 rounded-full"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline-flex">Search...</span>
        <kbd className="hidden sm:inline-flex absolute right-3 top-2.5 pointer-events-none h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <SearchIcon className="h-4 w-4 mr-2 shrink-0 opacity-50" />
          <CommandInput
            ref={inputRef}
            placeholder="Search for products, categories..."
            value={query}
            onValueChange={setQuery}
            className="border-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground/70 py-3"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setQuery("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <CommandList>
          {!query && (
            <>
              <CommandGroup heading="Top Categories">
                <div className="flex flex-wrap gap-2 p-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="px-3 py-1 cursor-pointer hover:bg-accent/50"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name} ({category.count})
                    </Badge>
                  ))}
                </div>
              </CommandGroup>
              
              <CommandGroup heading="Popular Searches">
                <div className="flex flex-wrap gap-2 p-2">
                  {topSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="px-3 py-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </CommandGroup>
            </>
          )}
          
          {query && filteredProducts.length === 0 && (
            <CommandEmpty className="py-6 text-center text-muted-foreground">
              <div className="mb-2">No products found for "{query}"</div>
              <Button onClick={handleSearchSubmit}>
                Search for "{query}" in all products
              </Button>
            </CommandEmpty>
          )}
          
          {filteredProducts.length > 0 && (
            <CommandGroup heading="Products">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleProductSelect(product.id)}
                  className="py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                      <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">{product.category}</span>
                        <span className="text-sm font-medium">${product.price}</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}