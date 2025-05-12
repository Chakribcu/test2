import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define product type to match what we're using in AdminProducts.tsx
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: string;
  category: string;
  image: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteManyProducts: (ids: number[]) => Promise<void>;
  updateProductStatus: (id: number, status: string) => Promise<void>;
}

// Create the initial context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Sample initial data - this should come from your actual product data
const initialProducts = [
  {
    id: 1,
    name: "KavinoRa Wellness Sandal",
    sku: "KWS-001-M",
    price: 89.99,
    inventory: 35,
    status: "Published",
    category: "Wellness Sandals",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 2,
    name: "StrideRight Active Shoe",
    sku: "SRAS-002-L",
    price: 129.99,
    inventory: 27,
    status: "Published",
    category: "Active Footwear",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 3,
    name: "AirStep Cushion Slide",
    sku: "ACS-003-S",
    price: 49.99,
    inventory: 52,
    status: "Published",
    category: "Slides",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 4,
    name: "HealFlex Orthopedic Slipper",
    sku: "HFOS-004-XL",
    price: 74.99,
    inventory: 18,
    status: "Out of Stock",
    category: "Orthopedic Footwear",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 5,
    name: "WalkWell Therapeutic Shoe",
    sku: "WWTS-005-M",
    price: 159.99,
    inventory: 0,
    status: "Out of Stock",
    category: "Therapeutic Footwear",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 6,
    name: "ComfortStep Daily Wear",
    sku: "CSDW-006-L",
    price: 99.99,
    inventory: 41,
    status: "Published",
    category: "Wellness Shoes",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 7,
    name: "PoseTech Orthopedic Shoe",
    sku: "PTOS-B-44",
    price: 179.99,
    inventory: 12,
    status: "Draft",
    category: "Orthopedic Footwear",
    image: "https://via.placeholder.com/40x40"
  }
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [localProducts, setLocalProducts] = useState<Product[]>(initialProducts);
  
  // In a real application, you would fetch products from your API
  const { data: fetchedProducts, isLoading } = useQuery({
    queryKey: ['/api/products'],
    // Using a placeholder queryFn since we don't have a real API yet
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, we'll just return our local initial data
      return initialProducts;
    },
    // Disable for now since we don't have a real API
    enabled: false
  });
  
  // Effect to update local products when fetched data changes
  useEffect(() => {
    if (fetchedProducts) {
      setLocalProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      // In a real app, this would be an API call
      // Return a mocked response with an ID for now
      const newId = Math.max(...localProducts.map(p => p.id), 0) + 1;
      const newProduct = { ...product, id: newId };
      
      // Update local state
      setLocalProducts(prev => [...prev, newProduct]);
      return newProduct;
    },
    onSuccess: () => {
      // Invalidate the products query to refetch products
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product added",
        description: "The product has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: Partial<Product> }) => {
      // In a real app, this would be an API call
      // For now, update locally
      const updatedProducts = localProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      );
      setLocalProducts(updatedProducts);
      return updatedProducts.find(p => p.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, this would be an API call
      const filteredProducts = localProducts.filter(product => product.id !== id);
      setLocalProducts(filteredProducts);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete many products mutation
  const deleteManyProductsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      // In a real app, this would be an API call
      const filteredProducts = localProducts.filter(product => !ids.includes(product.id));
      setLocalProducts(filteredProducts);
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Products deleted",
        description: "The selected products have been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete products",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update product status mutation
  const updateProductStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      // In a real app, this would be an API call
      const updatedProducts = localProducts.map(product => 
        product.id === id ? { ...product, status } : product
      );
      setLocalProducts(updatedProducts);
      return updatedProducts.find(p => p.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Status updated",
        description: "The product status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Helper functions that use the mutations
  const addProduct = async (product: Omit<Product, "id">) => {
    await addProductMutation.mutateAsync(product);
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    await updateProductMutation.mutateAsync({ id, updates });
  };

  const deleteProduct = async (id: number) => {
    await deleteProductMutation.mutateAsync(id);
  };

  const deleteManyProducts = async (ids: number[]) => {
    await deleteManyProductsMutation.mutateAsync(ids);
  };

  const updateProductStatus = async (id: number, status: string) => {
    await updateProductStatusMutation.mutateAsync({ id, status });
  };

  return (
    <ProductContext.Provider
      value={{
        products: localProducts,
        loading: isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteManyProducts,
        updateProductStatus
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}