import { Link } from "wouter";
import { 
  Plus,
  Search,
  ShoppingCart,
  BarChart,
  Package,
  Users
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="Overview of your store's performance and recent activity"
    >
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +12.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +4 added this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="Search products..." />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <Link href="/admin/product-manager">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="recent">Recent Orders</TabsTrigger>
            <TabsTrigger value="support">Support Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your product inventory and catalog.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 py-3 px-4 text-sm font-medium text-muted-foreground border-b">
                    <div>Product</div>
                    <div>SKU</div>
                    <div>Price</div>
                    <div>Inventory</div>
                    <div>Status</div>
                  </div>
                  
                  {/* Product rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 py-3 px-4 text-sm border-b last:border-b-0 hover:bg-muted/50 rounded-md">
                      <div className="font-medium flex items-center">
                        <span className="w-8 h-8 rounded bg-muted mr-2 flex-shrink-0"></span>
                        CloudWalk Pro {2000 + i}
                      </div>
                      <div className="text-muted-foreground">CWP{2000 + i}</div>
                      <div>${Math.floor(120 + i * 10)}.99</div>
                      <div>{20 + i * 3}</div>
                      <div>
                        <Badge variant={i % 3 === 0 ? "outline" : "default"}>
                          {i % 3 === 0 ? "Draft" : "Active"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Showing 5 of 28 products
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Tools</CardTitle>
                <CardDescription>
                  Special tools for your product management
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">AI Description Generator</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Generate compelling product descriptions with our AI-powered tool.
                  </CardContent>
                  <CardFooter>
                    <Link href="/admin/product-manager">
                      <Button size="sm">
                        Try it now
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Bulk Image Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Optimize multiple product images at once for better performance.
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline">
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Most recent customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 py-3 px-4 text-sm font-medium text-muted-foreground border-b">
                    <div>Order #</div>
                    <div>Customer</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  
                  {/* Order rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 py-3 px-4 text-sm border-b last:border-b-0 hover:bg-muted/50 rounded-md">
                      <div className="font-medium">#KR-{10234 + i}</div>
                      <div>John Doe</div>
                      <div className="text-muted-foreground">May {10 + i}, 2025</div>
                      <div>${Math.floor(120 + i * 50)}.99</div>
                      <div>
                        <Badge variant={i % 4 === 0 ? "destructive" : i % 3 === 0 ? "outline" : "default"}>
                          {i % 4 === 0 ? "Canceled" : i % 3 === 0 ? "Processing" : "Completed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Requests</CardTitle>
                <CardDescription>
                  Customer support tickets and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 py-3 px-4 text-sm font-medium text-muted-foreground border-b">
                    <div>ID</div>
                    <div>Subject</div>
                    <div>Customer</div>
                    <div>Date</div>
                    <div>Status</div>
                  </div>
                  
                  {/* Support request rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 py-3 px-4 text-sm border-b last:border-b-0 hover:bg-muted/50 rounded-md">
                      <div className="font-medium">TK-{1000 + i}</div>
                      <div>{i % 2 === 0 ? "Order Issue" : i % 3 === 0 ? "Return Request" : "Product Question"}</div>
                      <div className="text-muted-foreground">Jane Smith</div>
                      <div>May {10 + i}, 2025</div>
                      <div>
                        <Badge variant={i % 3 === 0 ? "destructive" : i % 2 === 0 ? "outline" : "default"}>
                          {i % 3 === 0 ? "Urgent" : i % 2 === 0 ? "Open" : "Resolved"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}