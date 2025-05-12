import { useState } from "react";
import { 
  Calendar, 
  DownloadCloud, 
  BarChart as BarChartIcon, 
  LineChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Users,
  ShoppingBag,
  CreditCard,
  Package,
  Repeat,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

// Mock data for Revenue Chart
const revenueData = [
  { name: "Jan", revenue: 18000, orders: 120, target: 15000 },
  { name: "Feb", revenue: 16000, orders: 115, target: 15000 },
  { name: "Mar", revenue: 19000, orders: 130, target: 18000 },
  { name: "Apr", revenue: 22000, orders: 145, target: 20000 },
  { name: "May", revenue: 28000, orders: 180, target: 25000 },
  { name: "Jun", revenue: 32000, orders: 210, target: 30000 },
  { name: "Jul", revenue: 35000, orders: 230, target: 32000 },
  { name: "Aug", revenue: 38000, orders: 245, target: 36000 },
  { name: "Sep", revenue: 41000, orders: 260, target: 40000 },
  { name: "Oct", revenue: 44000, orders: 280, target: 42000 },
  { name: "Nov", revenue: 48000, orders: 290, target: 45000 },
  { name: "Dec", revenue: 52000, orders: 310, target: 50000 }
];

// Mock data for Product Categories Chart
const categoryData = [
  { name: "Wellness Shoes", value: 45 },
  { name: "Orthopedic Footwear", value: 20 },
  { name: "Ergonomic Insoles", value: 15 },
  { name: "Comfort Sandals", value: 12 },
  { name: "Accessories", value: 8 }
];

// Mock data for Traffic Sources
const trafficData = [
  { name: "Direct", value: 35 },
  { name: "Organic Search", value: 25 },
  { name: "Social Media", value: 20 },
  { name: "Email", value: 10 },
  { name: "Referral", value: 10 }
];

// Mock data for device usage
const deviceData = [
  { name: "Mobile", value: 55, icon: <Smartphone className="h-4 w-4" /> },
  { name: "Desktop", value: 35, icon: <Monitor className="h-4 w-4" /> },
  { name: "Tablet", value: 10, icon: <Tablet className="h-4 w-4" /> }
];

// Mock data for daily active users
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dailyUsersData = daysOfWeek.map(day => ({
  name: day,
  users: Math.floor(Math.random() * 300) + 700,
  newUsers: Math.floor(Math.random() * 80) + 120
}));

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<string>("year");
  
  // Calculate change percentages for overview cards
  const calculateChange = (value: number, type: string) => {
    // This would use real data in a production app
    if (type === "revenue") {
      return 18.2;
    } else if (type === "orders") {
      return 12.5;
    } else if (type === "customers") {
      return 24.3;
    } else if (type === "aov") {
      return -3.1;
    }
    return 0;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {pld.name}: {pld.name === "revenue" || pld.name === "target" ? formatCurrency(pld.value) : pld.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const RevenueMetric = ({ title, value, change }: { title: string, value: string, change: number }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={`text-xs font-medium flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Compared to previous period
        </p>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout 
      title="Analytics" 
      description="View detailed performance metrics and insights for your store"
    >
      <div className="flex flex-col gap-6">
        {/* Time Range Selector & Export Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Custom Range</span>
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <DownloadCloud className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
        
        {/* Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RevenueMetric 
            title="Total Revenue" 
            value={formatCurrency(421500)} 
            change={calculateChange(421500, "revenue")} 
          />
          <RevenueMetric 
            title="Orders" 
            value="2,583" 
            change={calculateChange(2583, "orders")} 
          />
          <RevenueMetric 
            title="Customers" 
            value="8,394" 
            change={calculateChange(8394, "customers")} 
          />
          <RevenueMetric 
            title="Average Order Value" 
            value={formatCurrency(163)} 
            change={calculateChange(163, "aov")} 
          />
        </div>
        
        {/* Revenue Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Revenue Performance</CardTitle>
            <CardDescription>
              View revenue trends, order volume, and targets over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <Tabs defaultValue="revenue">
                <div className="flex justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <TabsContent value="revenue" className="mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0088FE" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        name="Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#FF8042" 
                        strokeDasharray="5 5" 
                        name="Target"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#00C49F" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales Breakdown & Traffic Sources */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product Category</CardTitle>
              <CardDescription>
                Distribution of sales across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* User Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Daily active users and new user acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyUsersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" name="Active Users" fill="#0088FE" />
                  <Bar dataKey="newUsers" name="New Users" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Metrics Section */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base">Device Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-4 bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                      {device.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{device.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <div className="bg-muted w-16 h-2 rounded-full mr-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${device.value}%` }}
                          />
                        </div>
                        <span>{device.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">CloudWalk Pro 2000</p>
                    <p className="text-xs text-muted-foreground">358 units sold | $53,700</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">ErgoFlex Insole</p>
                    <p className="text-xs text-muted-foreground">245 units sold | $9,800</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">ComfortStride Sandals</p>
                    <p className="text-xs text-muted-foreground">189 units sold | $17,010</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base">Customer Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Customer Retention</p>
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground mr-2">68%</span>
                      <span className="text-green-500 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        5.2%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Repeat Purchase Rate</p>
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground mr-2">42%</span>
                      <span className="text-green-500 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        3.7%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Average Order Value</p>
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground mr-2">$163</span>
                      <span className="text-red-500 flex items-center">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        3.1%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}