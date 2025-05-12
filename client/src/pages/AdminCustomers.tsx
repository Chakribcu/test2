import { useState } from "react";
import { Link } from "wouter";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Mail,
  Download,
  MoreVertical,
  Edit,
  User,
  ShoppingBag,
  Trash2,
  CheckCircle,
  XCircle,
  Mail as MailIcon
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

// Mock customer data
const customers = [
  {
    id: 1001,
    name: "Emily Johnson",
    email: "emily@example.com",
    status: "Active",
    totalSpent: 849.97,
    totalOrders: 6,
    lastOrderDate: new Date(2025, 4, 11),
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: new Date(2024, 9, 15),
    avatar: null
  },
  {
    id: 1002,
    name: "Michael Smith",
    email: "michael@example.com",
    status: "Active",
    totalSpent: 319.96,
    totalOrders: 3,
    lastOrderDate: new Date(2025, 4, 10),
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, USA",
    joinDate: new Date(2024, 8, 22),
    avatar: null
  },
  {
    id: 1003,
    name: "Sophia Williams",
    email: "sophia@example.com",
    status: "Active",
    totalSpent: 1129.95,
    totalOrders: 8,
    lastOrderDate: new Date(2025, 4, 9),
    phone: "+1 (555) 345-6789",
    location: "Chicago, USA",
    joinDate: new Date(2024, 6, 10),
    avatar: null
  },
  {
    id: 1004,
    name: "James Brown",
    email: "james@example.com",
    status: "Inactive",
    totalSpent: 149.99,
    totalOrders: 1,
    lastOrderDate: new Date(2025, 3, 15),
    phone: "+1 (555) 456-7890",
    location: "Houston, USA",
    joinDate: new Date(2025, 2, 5),
    avatar: null
  },
  {
    id: 1005,
    name: "Olivia Jones",
    email: "olivia@example.com",
    status: "Active",
    totalSpent: 789.95,
    totalOrders: 5,
    lastOrderDate: new Date(2025, 4, 8),
    phone: "+1 (555) 567-8901",
    location: "London, UK",
    joinDate: new Date(2024, 11, 12),
    avatar: null
  },
  {
    id: 1006,
    name: "William Davis",
    email: "william@example.com",
    status: "Active",
    totalSpent: 439.97,
    totalOrders: 3,
    lastOrderDate: new Date(2025, 4, 7),
    phone: "+1 (555) 678-9012",
    location: "Sydney, AUS",
    joinDate: new Date(2025, 1, 20),
    avatar: null
  },
  {
    id: 1007,
    name: "Emma Miller",
    email: "emma@example.com",
    status: "Active",
    totalSpent: 1249.94,
    totalOrders: 9,
    lastOrderDate: new Date(2025, 4, 6),
    phone: "+1 (555) 789-0123",
    location: "Toronto, CAN",
    joinDate: new Date(2024, 7, 30),
    avatar: null
  }
];

export default function AdminCustomers() {
  const [customersData, setCustomersData] = useState<typeof customers>(customers);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Delete a single customer
  const deleteCustomer = (customerId: number) => {
    setCustomersData(customersData.filter(customer => customer.id !== customerId));
    // Remove from selected if it was selected
    setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
  };
  
  // Delete multiple customers
  const deleteSelectedCustomers = () => {
    if (selectedCustomers.length === 0) return;
    
    // Filter out selected customers
    setCustomersData(customersData.filter(customer => !selectedCustomers.includes(customer.id)));
    // Clear selection
    setSelectedCustomers([]);
  };

  // Filter customers based on search query and status
  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = 
      searchQuery.trim() === "" || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesStatus = 
      selectedStatus === "all" || 
      customer.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Sort customers based on selected sorting option
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "recent") {
      return b.joinDate.getTime() - a.joinDate.getTime();
    } else if (sortBy === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "orders") {
      return b.totalOrders - a.totalOrders;
    } else if (sortBy === "spent") {
      return b.totalSpent - a.totalSpent;
    }
    return 0;
  });

  // Handle checkbox selection
  const handleSelectCustomer = (customerId: number) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === sortedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(sortedCustomers.map(customer => customer.id));
    }
  };

  // Get initials from customer name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <AdminLayout 
      title="Customers" 
      description="View and manage your customer accounts"
    >
      <div className="flex flex-col gap-6">
        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-grow max-w-md gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </Button>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Customer</span>
            </Button>
          </div>
        </div>
        
        {/* Status & Sort Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-40">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Joined</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="orders">Most Orders</SelectItem>
                <SelectItem value="spent">Highest Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Customers Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCustomers.length === sortedCustomers.length && sortedCustomers.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-checked={selectedCustomers.length > 0 && selectedCustomers.length < sortedCustomers.length ? "mixed" : undefined}
                        />
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Total Spent</TableHead>
                      <TableHead className="hidden md:table-cell text-center">Orders</TableHead>
                      <TableHead className="hidden sm:table-cell">Last Order</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {sortedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                        No customers found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCustomers.includes(customer.id)} 
                            onCheckedChange={() => handleSelectCustomer(customer.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              {customer.avatar ? (
                                <AvatarImage src={customer.avatar} alt={customer.name} />
                              ) : null}
                              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-xs text-muted-foreground">{customer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                            {customer.status === "Active" ? (
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                            )}
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell text-center">{customer.totalOrders}</TableCell>
                        <TableCell className="hidden sm:table-cell">{format(customer.lastOrderDate, "MMM d, yyyy")}</TableCell>
                        <TableCell className="hidden lg:table-cell">{format(customer.joinDate, "MMM d, yyyy")}</TableCell>
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
                                <Link href={`/admin/customers/${customer.id}`}>
                                  <User className="mr-2 h-4 w-4" /> View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShoppingBag className="mr-2 h-4 w-4" /> View Orders
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MailIcon className="mr-2 h-4 w-4" /> Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => deleteCustomer(customer.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing {sortedCustomers.length} of {customers.length} customers
            </div>
            <div className="flex items-center gap-2">
              {selectedCustomers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{selectedCustomers.length} selected</span>
                  <Button variant="outline" size="sm">
                    <MailIcon className="h-3.5 w-3.5 mr-1" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={deleteSelectedCustomers}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
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