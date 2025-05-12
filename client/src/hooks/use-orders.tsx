import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Order customer type
interface OrderCustomer {
  id: number;
  name: string;
  email: string;
}

// Order type
interface Order {
  id: number;
  orderNumber: string;
  date: string;
  customer: OrderCustomer;
  total: number;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  items: number;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  updatePaymentStatus: (id: number, status: string) => Promise<void>;
  updateShippingStatus: (id: number, status: string) => Promise<void>;
  cancelOrder: (id: number) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
}

// Create the initial context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Sample initial data - this would come from your API in a real app
const initialOrders = [
  {
    id: 1,
    orderNumber: "KR-3721",
    date: "2025-05-01",
    customer: {
      id: 1,
      name: "Michael Johnson",
      email: "michael.johnson@example.com"
    },
    total: 289.97,
    status: "Processing",
    paymentStatus: "Paid",
    shippingStatus: "Preparing",
    items: 3
  },
  {
    id: 2,
    orderNumber: "KR-3722",
    date: "2025-05-02",
    customer: {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.williams@example.com"
    },
    total: 129.99,
    status: "Shipped",
    paymentStatus: "Paid",
    shippingStatus: "In Transit",
    items: 1
  },
  {
    id: 3,
    orderNumber: "KR-3723",
    date: "2025-05-02",
    customer: {
      id: 3,
      name: "David Brown",
      email: "david.brown@example.com"
    },
    total: 349.95,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingStatus: "Delivered",
    items: 2
  },
  {
    id: 4,
    orderNumber: "KR-3724",
    date: "2025-05-03",
    customer: {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com"
    },
    total: 79.99,
    status: "Cancelled",
    paymentStatus: "Refunded",
    shippingStatus: "Cancelled",
    items: 1
  },
  {
    id: 5,
    orderNumber: "KR-3725",
    date: "2025-05-05",
    customer: {
      id: 5,
      name: "James Wilson",
      email: "james.wilson@example.com"
    },
    total: 199.98,
    status: "Processing",
    paymentStatus: "Paid",
    shippingStatus: "Preparing",
    items: 3
  }
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [localOrders, setLocalOrders] = useState<Order[]>(initialOrders);
  
  // In a real application, you would fetch orders from your API
  const { data: fetchedOrders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
    // Using a placeholder queryFn since we don't have a real API yet
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, we'll just return our local initial data
      return initialOrders;
    },
    // Disable for now since we don't have a real API
    enabled: false
  });
  
  // Effect to update local orders when fetched data changes
  useEffect(() => {
    if (fetchedOrders) {
      setLocalOrders(fetchedOrders);
    }
  }, [fetchedOrders]);

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      // In a real app, this would be an API call
      const updatedOrders = localOrders.map(order => 
        order.id === id ? { ...order, status } : order
      );
      setLocalOrders(updatedOrders);
      return updatedOrders.find(o => o.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order status updated",
        description: "The order status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update order status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update payment status mutation
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      // In a real app, this would be an API call
      const updatedOrders = localOrders.map(order => 
        order.id === id ? { ...order, paymentStatus: status } : order
      );
      setLocalOrders(updatedOrders);
      return updatedOrders.find(o => o.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Payment status updated",
        description: "The payment status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update payment status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update shipping status mutation
  const updateShippingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      // In a real app, this would be an API call
      const updatedOrders = localOrders.map(order => 
        order.id === id ? { ...order, shippingStatus: status } : order
      );
      setLocalOrders(updatedOrders);
      return updatedOrders.find(o => o.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Shipping status updated",
        description: "The shipping status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update shipping status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, this would be an API call
      const updatedOrders = localOrders.map(order => 
        order.id === id 
          ? { 
              ...order, 
              status: "Cancelled", 
              paymentStatus: "Refunded", 
              shippingStatus: "Cancelled" 
            } 
          : order
      );
      setLocalOrders(updatedOrders);
      return updatedOrders.find(o => o.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order cancelled",
        description: "The order has been cancelled successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel order",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, this would be an API call
      const filteredOrders = localOrders.filter(order => order.id !== id);
      setLocalOrders(filteredOrders);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order deleted",
        description: "The order has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete order",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Helper functions that use the mutations
  const updateOrderStatus = async (id: number, status: string) => {
    await updateOrderStatusMutation.mutateAsync({ id, status });
  };

  const updatePaymentStatus = async (id: number, status: string) => {
    await updatePaymentStatusMutation.mutateAsync({ id, status });
  };

  const updateShippingStatus = async (id: number, status: string) => {
    await updateShippingStatusMutation.mutateAsync({ id, status });
  };

  const cancelOrder = async (id: number) => {
    await cancelOrderMutation.mutateAsync(id);
  };

  const deleteOrder = async (id: number) => {
    await deleteOrderMutation.mutateAsync(id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders: localOrders,
        loading: isLoading,
        updateOrderStatus,
        updatePaymentStatus,
        updateShippingStatus,
        cancelOrder,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}