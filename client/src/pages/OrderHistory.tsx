import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { formatDate, formatCurrency } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";

interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  total: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderHistory() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch orders from API
  const { data, isLoading } = useQuery<{ success: boolean; data: Order[] }>({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  // Redirect to login if not authenticated
  if (!isLoadingUser && !user) {
    setLocation("/auth");
    return null;
  }

  // Loading state
  if (isLoadingUser || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const orders = data?.data || [];

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <SEOHead 
        title="Order History | KavinoRa"
        description="View your order history and track your shipments with KavinoRa."
      />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Order History</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">You haven't placed any orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping and your orders will appear here</p>
            <Button onClick={() => setLocation("/")} className="mt-4">Browse Products</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-muted px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center space-x-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-medium">{formatCurrency(Number(order.total))}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Payment Status:</p>
                      <span className={`text-sm px-2 py-0 rounded-full ${
                        order.paymentStatus.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Shipping Status:</p>
                      <span className={`text-sm px-2 py-0 rounded-full ${getStatusBadgeClass(order.shippingStatus)}`}>
                        {order.shippingStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Payment Method:</p>
                      <span className="text-sm">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted px-4 py-3 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/order/${order.id}`)}
                  >
                    View Order Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}