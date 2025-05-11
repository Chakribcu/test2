import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";

interface OrderDetail {
  id: number;
  orderNumber: string;
  userId: number;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isLoading: isLoadingUser } = useAuth();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!isLoadingUser && !user) {
      setLocation("/auth");
    }
  }, [user, isLoadingUser, setLocation]);

  // Fetch order details
  const { data: order, isLoading, error } = useQuery<OrderDetail>({
    queryKey: [`/api/orders/${id}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && !!id,
  });

  // Status badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (isLoading || isLoadingUser) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Card>
            <CardHeader>
              <CardTitle>Order Not Found</CardTitle>
              <CardDescription>
                We couldn't find the order you're looking for.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setLocation("/order-history")}>
                Back to Order History
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`Order #${order.orderNumber} | KavinoRa`}
        description="View your order details and track your shipment."
      />
      <div className="container mx-auto py-8 px-4 lg:px-0">
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-montserrat mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Badge
              className={
                order.paymentStatus === "Paid"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }
            >
              Payment: {order.paymentStatus}
            </Badge>
            <Badge
              className={
                order.shippingStatus === "Delivered"
                  ? "bg-green-500"
                  : order.shippingStatus === "Shipped"
                  ? "bg-blue-500"
                  : "bg-yellow-500"
              }
            >
              Shipping: {order.shippingStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden">
                              <img
                                src={item.image || "/placeholder-product.jpg"}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                {item.productName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="text-xl font-montserrat">
                  Total: {formatCurrency(order.total)}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Order Information */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Method:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {order.paymentStatus}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/contact")}
                >
                  Contact Support
                </Button>
                {order.status !== "Cancelled" && (
                  <Button variant="destructive" className="w-full">
                    Request Return
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={() => setLocation("/order-history")}>
            Back to Order History
          </Button>
        </div>
      </div>
    </Layout>
  );
}