import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Order {
  id: number;
  date: string;
  total: number;
  status: "processing" | "shipped" | "delivered";
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

// Sample order data - in a real app, this would come from an API
const demoOrders: Order[] = [
  {
    id: 1001,
    date: "2023-05-01",
    total: 129.95,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "KavinoRa Wellness Tea",
        quantity: 2,
        price: 24.99,
        image: "/products/tea.jpg"
      },
      {
        id: 2,
        name: "Mindfulness Journal",
        quantity: 1,
        price: 79.97,
        image: "/products/journal.jpg"
      }
    ]
  },
  {
    id: 1002,
    date: "2023-04-15",
    total: 89.99,
    status: "shipped",
    items: [
      {
        id: 3,
        name: "Aromatherapy Diffuser",
        quantity: 1,
        price: 89.99,
        image: "/products/diffuser.jpg"
      }
    ]
  },
  {
    id: 1003,
    date: "2023-03-22",
    total: 149.97,
    status: "delivered",
    items: [
      {
        id: 4,
        name: "Yoga Mat Premium",
        quantity: 1,
        price: 99.99,
        image: "/products/yoga-mat.jpg"
      },
      {
        id: 5,
        name: "Meditation Cushion",
        quantity: 1,
        price: 49.98,
        image: "/products/cushion.jpg"
      }
    ]
  }
];

export default function OrderHistory() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setOrders(demoOrders);
        setLoading(false);
      }, 500);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Order History</h1>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">You haven't placed any orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping and your orders will appear here</p>
            <Button onClick={() => window.location.href='/'} className="mt-4">Browse Products</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-muted px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center space-x-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs">[Image]</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted px-4 py-3 flex justify-end">
                  <Button variant="outline" size="sm">View Order Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}