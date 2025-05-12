import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  RefreshCw,
  MoreVertical,
  Printer,
  Eye,
  Truck,
  XCircle,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

// Mock order data
const orders = [
  {
    id: 10245,
    customer: {
      name: "Emily Johnson",
      email: "emily@example.com",
      id: 1001
    },
    date: new Date(2025, 4, 11),
    total: 149.99,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingMethod: "Standard",
    items: 2
  },
  {
    id: 10246,
    customer: {
      name: "Michael Smith",
      email: "michael@example.com",
      id: 1002
    },
    date: new Date(2025, 4, 11),
    total: 89.97,
    status: "Processing",
    paymentStatus: "Paid",
    shippingMethod: "Express",
    items: 1
  },
  {
    id: 10247,
    customer: {
      name: "Sophia Williams",
      email: "sophia@example.com",
      id: 1003
    },
    date: new Date(2025, 4, 10),
    total: 219.98,
    status: "Shipped",
    paymentStatus: "Paid",
    shippingMethod: "Standard",
    items: 3
  },
  {
    id: 10248,
    customer: {
      name: "James Brown",
      email: "james@example.com",
      id: 1004
    },
    date: new Date(2025, 4, 10),
    total: 74.99,
    status: "Cancelled",
    paymentStatus: "Refunded",
    shippingMethod: "Standard",
    items: 1
  },
  {
    id: 10249,
    customer: {
      name: "Olivia Jones",
      email: "olivia@example.com",
      id: 1005
    },
    date: new Date(2025, 4, 9),
    total: 249.97,
    status: "Delivered",
    paymentStatus: "Paid",
    shippingMethod: "Express",
    items: 2
  },
  {
    id: 10250,
    customer: {
      name: "William Davis",
      email: "william@example.com",
      id: 1006
    },
    date: new Date(2025, 4, 9),
    total: 139.99,
    status: "Processing",
    paymentStatus: "Pending",
    shippingMethod: "Standard",
    items: 1
  },
  {
    id: 10251,
    customer: {
      name: "Emma Miller",
      email: "emma@example.com",
      id: 1007
    },
    date: new Date(2025, 4, 8),
    total: 299.98,
    status: "Shipped",
    paymentStatus: "Paid",
    shippingMethod: "Express",
    items: 3
  }
];

export default function AdminOrders() {
  const [ordersData, setOrdersData] = useState<typeof orders>(orders);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Cancel an order
  const cancelOrder = (orderId: number) => {
    setOrdersData(ordersData.map(order => 
      order.id === orderId 
        ? { ...order, status: "Cancelled", paymentStatus: "Refunded" } 
        : order
    ));
  };
  
  // Delete an order from the admin view (in a real app this would be archived, not deleted)
  const deleteOrder = (orderId: number) => {
    setOrdersData(ordersData.filter(order => order.id !== orderId));
    // Remove from selected if it was selected
    setSelectedOrders(selectedOrders.filter(id => id !== orderId));
  };
  
  // Update order status
  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrdersData(ordersData.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));
  };

  // Filter orders based on search query and status
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      searchQuery.trim() === "" || 
      order.id.toString().includes(searchQuery) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || 
      order.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Handle checkbox selection
  const handleSelectOrder = (orderId: number) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { variant: "default", icon: <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> };
      case 'shipped':
        return { variant: "secondary", icon: <Truck className="h-3.5 w-3.5 mr-1.5" /> };
      case 'processing':
        return { variant: "outline", icon: <Clock className="h-3.5 w-3.5 mr-1.5" /> };
      case 'cancelled':
        return { variant: "destructive", icon: <XCircle className="h-3.5 w-3.5 mr-1.5" /> };
      default:
        return { variant: "outline", icon: null };
    }
  };

  // Get badge variant based on payment status
  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { variant: "default", color: "bg-green-100 text-green-800" };
      case 'pending':
        return { variant: "outline", color: "bg-yellow-100 text-yellow-800" };
      case 'refunded':
        return { variant: "outline", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline", color: "" };
    }
  };

  return (
    <AdminLayout 
      title="Orders" 
      description="View and manage customer orders"
    >
      <div className="flex flex-col gap-6">
        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-grow max-w-md gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order #, customer..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Date Range</span>
            </Button>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button className="gap-1">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-40">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Orders Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-checked={selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length ? "mixed" : undefined}
                      />
                    </TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                        No orders found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedOrders.includes(order.id)} 
                              onCheckedChange={() => handleSelectOrder(order.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{format(order.date, "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <div>
                              <div>{order.customer.name}</div>
                              <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadge.variant as any} className="gap-0.5 font-normal">
                              {statusBadge.icon}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`font-normal ${paymentBadge.color}`}>
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/orders/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" /> Print Invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  disabled={order.status === "Cancelled"}
                                  onClick={() => updateOrderStatus(order.id, "Shipped")}
                                >
                                  <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className={order.status === "Cancelled" ? "text-destructive focus:text-destructive line-through opacity-50" : ""}
                                  disabled={order.status === "Cancelled"}
                                  onClick={() => cancelOrder(order.id)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => deleteOrder(order.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex items-center gap-2">
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{selectedOrders.length} selected</span>
                  <Button variant="outline" size="sm">
                    <Printer className="h-3.5 w-3.5 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}