import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Package, Truck, CreditCard, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { formatDate, formatPrice } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";

// Interfaces for the order data
interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: string;
  image: string;
  createdAt: string;
}

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

interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}

export default function OrderDetail({ params }: { params: { id: string } }) {
  const orderId = parseInt(params.id);
  const { user, isLoading: isLoadingUser } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch order details from API
  const { data, isLoading, error } = useQuery<{ success: boolean; data: OrderWithItems }>({
    queryKey: ["/api/orders", orderId],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && !isNaN(orderId),
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

  // Error state
  if (error || !data?.data) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">We couldn't find the order you're looking for.</p>
          <Button onClick={() => setLocation("/order-history")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </Layout>
    );
  }

  const { order, items } = data.data;

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

  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => {
    return acc + (parseFloat(item.price) * item.quantity);
  }, 0);

  // Calculate shipping (simplified for demo)
  const shipping = 5.99;
  
  // Calculate tax (simplified for demo)
  const tax = subtotal * 0.08;

  return (
    <Layout>
      <SEOHead 
        title={`Order #${order.orderNumber} | KavinoRa`}
        description="View the details of your KavinoRa order, including status, items, and shipping information."
      />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/order-history")} className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Order Status */}
          <div className="bg-card p-5 rounded-lg shadow-sm border">
            <h2 className="text-base lg:text-lg font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Order Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Order Status:</p>
                <p className="font-medium text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Payment Status:</p>
                <p className="font-medium text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    order.paymentStatus.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Shipping Status:</p>
                <p className="font-medium text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.shippingStatus)}`}>
                    {order.shippingStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-card p-5 rounded-lg shadow-sm border">
            <h2 className="text-base lg:text-lg font-semibold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Shipping Information
            </h2>
            <div className="space-y-2">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm">{order.shippingAddress.address}</p>
              <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p className="text-sm">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-card p-5 rounded-lg shadow-sm border md:col-span-2 lg:col-span-1">
            <h2 className="text-base lg:text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Payment Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">{formatPrice(parseFloat(order.total))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          
          {/* Desktop Table View (hidden on small screens) */}
          <div className="border rounded-lg overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-muted rounded overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{item.productName}</div>
                            <div className="text-xs text-muted-foreground">ID: {item.productId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatPrice(parseFloat(item.price))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Mobile Card View (shown only on small screens) */}
          <div className="md:hidden space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden p-4 bg-card">
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base">{item.productName}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price:</p>
                        <p>{formatPrice(parseFloat(item.price))}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity:</p>
                        <p>{item.quantity}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Total:</p>
                        <p className="font-medium">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card p-6 rounded-lg shadow-sm border max-w-md md:ml-auto">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="border-t pt-3 mt-1">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-lg">Total</span>
                <span className="text-lg">{formatPrice(parseFloat(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setLocation("/order-history")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <Button variant="default" onClick={() => window.print()}>
            Print Receipt
          </Button>
        </div>
      </div>
    </Layout>
  );
}