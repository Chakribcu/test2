import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2, Activity, History, TrendingUp, User, Bell, Settings, BarChart3, LineChart, Heart, ShoppingBag } from "lucide-react";

interface WellnessData {
  sleepHours: number[];
  waterIntake: number[];
  activityMinutes: number[];
  stepsCount: number[];
  moodScores: number[];
  weekLabels: string[];
}

interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  lastPurchased?: string;
}

interface InsightCard {
  title: string;
  description: string;
  type: "tip" | "recommendation" | "alert";
  icon: React.ReactNode;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  // Fetch wellness data
  const { data: wellnessData, isLoading: isLoadingWellness } = useQuery({
    queryKey: ["/api/user/wellness-data"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
    placeholderData: {
      sleepHours: [6.5, 7.2, 8.1, 7.8, 6.9, 7.5, 8.3],
      waterIntake: [1800, 2100, 2400, 2000, 2200, 2500, 2300],
      activityMinutes: [35, 42, 30, 45, 25, 38, 50],
      stepsCount: [5200, 6500, 4800, 7200, 5500, 6000, 7800],
      moodScores: [7, 8, 6, 7, 7, 8, 9],
      weekLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  });

  // Fetch recent purchases
  const { data: recentPurchases, isLoading: isLoadingPurchases } = useQuery({
    queryKey: ["/api/user/recent-purchases"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
    // Data structure transformation to match the component's expectations
    select: (data) => {
      if (!data || !data.data) return [];
      return data.data.map((purchase: any) => ({
        id: purchase.id,
        name: purchase.productName,
        category: purchase.productCategory,
        imageUrl: purchase.productImage || '/placeholder.jpg',
        price: Number(purchase.price),
        lastPurchased: new Date(purchase.purchaseDate).toISOString().split('T')[0]
      }));
    },
    placeholderData: {
      success: true,
      data: [
        { id: 1, productName: "Comfort Plus Insoles", productCategory: "Footwear", productImage: "/product-1.jpg", price: "39.99", purchaseDate: "2025-04-25" },
        { id: 2, productName: "Wellness Tea Collection", productCategory: "Wellness", productImage: "/product-2.jpg", price: "24.99", purchaseDate: "2025-05-02" },
        { id: 3, productName: "Bamboo Compression Socks", productCategory: "Footwear", productImage: "/product-3.jpg", price: "19.99", purchaseDate: "2025-05-08" }
      ]
    }
  });

  // Generate personalized insights based on wellness data
  const generateInsights = (data: WellnessData): InsightCard[] => {
    const insights: InsightCard[] = [];
    
    // Sleep insights
    const avgSleep = data.sleepHours.reduce((sum, h) => sum + h, 0) / data.sleepHours.length;
    if (avgSleep < 7) {
      insights.push({
        title: "Improve Your Sleep",
        description: "You're averaging less than 7 hours of sleep. Try our sleep-enhancing insoles for better rest.",
        type: "recommendation",
        icon: <Heart className="h-5 w-5 text-rose-500" />
      });
    }
    
    // Activity insights
    const avgActivity = data.activityMinutes.reduce((sum, m) => sum + m, 0) / data.activityMinutes.length;
    if (avgActivity < 40) {
      insights.push({
        title: "Boost Your Activity",
        description: "Increasing your daily activity can improve wellness. Our comfort shoes can help you stay active longer.",
        type: "tip",
        icon: <Activity className="h-5 w-5 text-emerald-500" />
      });
    }
    
    // Water intake insights
    const avgWater = data.waterIntake.reduce((sum, ml) => sum + ml, 0) / data.waterIntake.length;
    if (avgWater < 2000) {
      insights.push({
        title: "Hydration Alert",
        description: "You're not drinking enough water. Try setting reminders and consider our wellness supplements.",
        type: "alert",
        icon: <Bell className="h-5 w-5 text-amber-500" />
      });
    }

    // Add more product-related insights
    insights.push({
      title: "New Product Recommendation",
      description: "Based on your walking patterns, our new CloudStep insoles would be perfect for your lifestyle.",
      type: "recommendation",
      icon: <ShoppingBag className="h-5 w-5 text-blue-500" />
    });

    return insights;
  };

  const insights = wellnessData ? generateInsights(wellnessData) : [];

  // Prepare chart data
  const sleepData = wellnessData?.weekLabels.map((day, index) => ({
    name: day,
    hours: wellnessData.sleepHours[index]
  })) || [];

  const activityData = wellnessData?.weekLabels.map((day, index) => ({
    name: day,
    minutes: wellnessData.activityMinutes[index]
  })) || [];

  // Products by category for pie chart
  const categoryData = [
    { name: "Footwear", value: 65 },
    { name: "Wellness", value: 25 },
    { name: "Accessories", value: 10 }
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // Loading state
  if (isLoadingWellness || isLoadingPurchases) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your wellness dashboard...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-16 pb-24 bg-[#f5f5f7]">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f]">
              {user ? `Welcome, ${user.firstName || user.username}` : "Your Wellness Dashboard"}
            </h1>
            <p className="text-[#6e6e73] mt-2">
              Track your wellness journey and get personalized insights
            </p>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-white rounded-xl p-1 border">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
                <TrendingUp className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Wellness Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your activity over the last week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="minutes" fill="#3498db" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <LineChart className="h-5 w-5 mr-2 text-primary" />
                      Sleep Tracking
                    </CardTitle>
                    <CardDescription>Your sleep patterns this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sleepData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="hours" fill="#9b59b6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                      Purchase Distribution
                    </CardTitle>
                    <CardDescription>Product categories you've purchased</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Purchases Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                    Recent Purchases
                  </CardTitle>
                  <CardDescription>Your latest KavinoRa products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentPurchases?.map((product: Product) => (
                      <div key={product.id} className="flex bg-white p-4 rounded-lg shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                          {/* For demo purposes, using placeholder */}
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4 flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-[#1d1d1f]">{product.name}</h4>
                            <p className="text-sm text-[#6e6e73]">{product.category}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                            <span className="text-xs text-[#6e6e73]">
                              {new Date(product.lastPurchased || "").toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`
                      ${insight.type === 'tip' ? 'border-l-4 border-l-emerald-500' : ''}
                      ${insight.type === 'recommendation' ? 'border-l-4 border-l-blue-500' : ''}
                      ${insight.type === 'alert' ? 'border-l-4 border-l-amber-500' : ''}
                    `}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          {insight.icon}
                          <span className="ml-2">{insight.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#6e6e73]">{insight.description}</p>
                        
                        {insight.type === 'recommendation' && (
                          <Button variant="outline" className="mt-4 w-full">
                            View Products
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Personalize Your Insights</CardTitle>
                  <CardDescription>
                    Tell us more about your wellness goals to get better recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">Improve Sleep</Button>
                      <Button variant="outline">Reduce Foot Pain</Button>
                      <Button variant="outline">Increase Activity</Button>
                      <Button variant="outline">Improve Posture</Button>
                    </div>
                    <Button className="w-full">Update My Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2 text-primary" />
                    Wellness History
                  </CardTitle>
                  <CardDescription>Your wellness journey over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-[#1d1d1f] mb-2">Last 7 Days</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-[#6e6e73]">Avg. Sleep</p>
                          <p className="text-xl font-medium text-[#1d1d1f]">
                            {wellnessData ? (wellnessData.sleepHours.reduce((sum, h) => sum + h, 0) / wellnessData.sleepHours.length).toFixed(1) : "0"} hrs
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-[#6e6e73]">Avg. Activity</p>
                          <p className="text-xl font-medium text-[#1d1d1f]">
                            {wellnessData ? (wellnessData.activityMinutes.reduce((sum, m) => sum + m, 0) / wellnessData.activityMinutes.length).toFixed(0) : "0"} min
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-[#6e6e73]">Avg. Steps</p>
                          <p className="text-xl font-medium text-[#1d1d1f]">
                            {wellnessData ? (wellnessData.stepsCount.reduce((sum, s) => sum + s, 0) / wellnessData.stepsCount.length).toFixed(0) : "0"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-[#6e6e73]">Avg. Mood</p>
                          <p className="text-xl font-medium text-[#1d1d1f]">
                            {wellnessData ? (wellnessData.moodScores.reduce((sum, s) => sum + s, 0) / wellnessData.moodScores.length).toFixed(1) : "0"}/10
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-[#1d1d1f] mb-2">Activity Timeline</h3>
                      <div className="space-y-4">
                        {wellnessData?.weekLabels.map((day, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium text-[#1d1d1f]">{day}</p>
                                <p className="text-sm text-[#6e6e73]">May {10 + index}, 2025</p>
                              </div>
                              <p className="text-sm text-[#6e6e73]">
                                {wellnessData.activityMinutes[index]} minutes of activity, {wellnessData.stepsCount[index]} steps
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          defaultValue={user?.firstName || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          defaultValue={user?.lastName || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          defaultValue={user?.email || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          defaultValue={user?.username || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <Button className="w-full">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Wellness Tracking Preferences
                  </CardTitle>
                  <CardDescription>Customize what data you want to track</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1d1d1f]">Sleep Tracking</h4>
                        <p className="text-sm text-[#6e6e73]">Track your sleep duration and quality</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" className="sr-only" id="toggleSleep" defaultChecked />
                        <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1d1d1f]">Activity Tracking</h4>
                        <p className="text-sm text-[#6e6e73]">Monitor your daily activity and steps</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" className="sr-only" id="toggleActivity" defaultChecked />
                        <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1d1d1f]">Water Intake</h4>
                        <p className="text-sm text-[#6e6e73]">Track your daily hydration</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" className="sr-only" id="toggleWater" defaultChecked />
                        <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1d1d1f]">Mood Tracking</h4>
                        <p className="text-sm text-[#6e6e73]">Monitor your emotional wellbeing</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" className="sr-only" id="toggleMood" defaultChecked />
                        <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                      </div>
                    </div>
                    
                    <Button className="w-full">Update Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;