import { useState } from "react";
import { 
  Save, 
  User, 
  Store, 
  CreditCard, 
  Bell, 
  Mail, 
  Shield, 
  Smartphone,
  UploadCloud
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Mock profile data
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    bio: "E-commerce manager with 5 years of experience in retail and digital marketing."
  });
  
  // Mock store settings
  const [storeSettings, setStoreSettings] = useState({
    name: "KavinoRa",
    email: "support@kavinora.com",
    phone: "+1 (800) 123-4567",
    address: "123 Wellness Street, New York, NY 10001",
    currency: "USD",
    timezone: "America/New_York",
    logo: "",
    favicon: "",
    socialLinks: {
      facebook: "https://facebook.com/kavinora",
      instagram: "https://instagram.com/kavinora",
      twitter: "https://twitter.com/kavinora"
    }
  });
  
  // Mock notification settings
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderStatusChanges: true,
    newCustomers: true,
    productReviews: true,
    lowStock: true,
    securityAlerts: true,
    marketingUpdates: false,
    newsletterSignups: false
  });
  
  // Mock payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripeMode: "live",
    paypalEnabled: true,
    paypalMode: "sandbox",
    applePayEnabled: false,
    googlePayEnabled: false
  });
  
  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, this would send the updated profile to the server
    console.log("Profile updated:", profile);
  };
  
  // Handle store settings form submission
  const handleStoreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, this would send the updated store settings to the server
    console.log("Store settings updated:", storeSettings);
  };
  
  // Handle notification toggle
  const handleNotificationChange = (setting: keyof typeof notifications, value: boolean) => {
    setNotifications({
      ...notifications,
      [setting]: value
    });
  };

  return (
    <AdminLayout 
      title="Settings" 
      description="Manage your account and store settings"
    >
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Card className="md:w-64 flex-none">
            <div className="p-4">
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="profile" className="justify-start mb-1 py-2">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </TabsTrigger>
                <TabsTrigger value="store" className="justify-start mb-1 py-2">
                  <Store className="h-4 w-4 mr-2" />
                  Store Settings
                </TabsTrigger>
                <TabsTrigger value="payments" className="justify-start mb-1 py-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Settings
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start mb-1 py-2">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start mb-1 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Security & Privacy
                </TabsTrigger>
              </TabsList>
            </div>
          </Card>
          
          {/* Content */}
          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <Card>
                <form onSubmit={handleProfileSubmit}>
                  <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="mb-2 md:mb-0">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="" alt="Profile" />
                          <AvatarFallback>{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Profile Photo</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          JPG, GIF or PNG. Max size of 800K
                        </p>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm">
                            <UploadCloud className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                          <Button type="button" variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profile.firstName} 
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profile.lastName} 
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={profile.phone} 
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={profile.role} 
                        disabled 
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Contact the system administrator to change your role.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profile.bio} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button className="ml-auto" type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="store" className="mt-0">
              <Card>
                <form onSubmit={handleStoreSubmit}>
                  <CardHeader>
                    <CardTitle>Store Settings</CardTitle>
                    <CardDescription>
                      Configure your store details and branding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="mb-2 md:mb-0">
                        <div className="border border-border rounded-md h-16 w-16 flex items-center justify-center">
                          {storeSettings.logo ? (
                            <img src={storeSettings.logo} alt="Logo" className="h-full w-full object-contain" />
                          ) : (
                            <Store className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Store Logo</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload your store logo to display on your website and emails
                        </p>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm">
                            <UploadCloud className="h-4 w-4 mr-1" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input 
                        id="storeName" 
                        value={storeSettings.name} 
                        onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeEmail">Email Address</Label>
                        <Input 
                          id="storeEmail" 
                          type="email" 
                          value={storeSettings.email} 
                          onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="storePhone">Phone Number</Label>
                        <Input 
                          id="storePhone" 
                          value={storeSettings.phone} 
                          onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeAddress">Store Address</Label>
                      <Textarea 
                        id="storeAddress" 
                        value={storeSettings.address} 
                        onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select 
                          value={storeSettings.currency} 
                          onValueChange={(value) => setStoreSettings({...storeSettings, currency: value})}
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">United States Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                            <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                            <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                          value={storeSettings.timezone} 
                          onValueChange={(value) => setStoreSettings({...storeSettings, timezone: value})}
                        >
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <h3 className="font-medium">Social Media</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                          id="facebook" 
                          value={storeSettings.socialLinks.facebook} 
                          onChange={(e) => setStoreSettings({
                            ...storeSettings, 
                            socialLinks: { ...storeSettings.socialLinks, facebook: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input 
                          id="instagram" 
                          value={storeSettings.socialLinks.instagram} 
                          onChange={(e) => setStoreSettings({
                            ...storeSettings, 
                            socialLinks: { ...storeSettings.socialLinks, instagram: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          value={storeSettings.socialLinks.twitter} 
                          onChange={(e) => setStoreSettings({
                            ...storeSettings, 
                            socialLinks: { ...storeSettings.socialLinks, twitter: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button className="ml-auto" type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure payment providers and options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Stripe</h3>
                        <p className="text-sm text-muted-foreground">Credit card payments via Stripe</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.stripeEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, stripeEnabled: checked})}
                      />
                    </div>
                    {paymentSettings.stripeEnabled && (
                      <div className="pl-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="stripeMode">Stripe Mode</Label>
                          <Select 
                            value={paymentSettings.stripeMode} 
                            onValueChange={(value) => setPaymentSettings({...paymentSettings, stripeMode: value})}
                            disabled={!paymentSettings.stripeEnabled}
                          >
                            <SelectTrigger id="stripeMode">
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="test">Test Mode</SelectItem>
                              <SelectItem value="live">Live Mode</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                          <Input id="stripePublicKey" type="password" disabled placeholder="•••• •••• •••• ••••" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                          <Input id="stripeSecretKey" type="password" disabled placeholder="•••• •••• •••• ••••" />
                        </div>
                        <Button variant="outline" size="sm">
                          Update API Keys
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pb-3 pt-3 border-b">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">PayPal</h3>
                        <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.paypalEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paypalEnabled: checked})}
                      />
                    </div>
                    
                    {paymentSettings.paypalEnabled && (
                      <div className="pl-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="paypalMode">PayPal Mode</Label>
                          <Select 
                            value={paymentSettings.paypalMode} 
                            onValueChange={(value) => setPaymentSettings({...paymentSettings, paypalMode: value})}
                            disabled={!paymentSettings.paypalEnabled}
                          >
                            <SelectTrigger id="paypalMode">
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sandbox">Sandbox Mode</SelectItem>
                              <SelectItem value="live">Live Mode</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                          <Input id="paypalClientId" type="password" disabled placeholder="•••• •••• •••• ••••" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paypalSecret">PayPal Client Secret</Label>
                          <Input id="paypalSecret" type="password" disabled placeholder="•••• •••• •••• ••••" />
                        </div>
                        <Button variant="outline" size="sm">
                          Update API Keys
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pb-3 pt-3 border-b">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Apple Pay</h3>
                        <p className="text-sm text-muted-foreground">Accept Apple Pay on compatible devices</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.applePayEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, applePayEnabled: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-3 pt-3 border-b">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Google Pay</h3>
                        <p className="text-sm text-muted-foreground">Accept Google Pay on compatible devices</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.googlePayEnabled}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, googlePayEnabled: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button className="ml-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium border-b pb-2">Order Notifications</h3>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Orders</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications when new orders are placed</p>
                      </div>
                      <Switch 
                        checked={notifications.newOrders}
                        onCheckedChange={(checked) => handleNotificationChange('newOrders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Order Status Changes</Label>
                        <p className="text-sm text-muted-foreground">Get notified when orders are updated, shipped, or delivered</p>
                      </div>
                      <Switch 
                        checked={notifications.orderStatusChanges}
                        onCheckedChange={(checked) => handleNotificationChange('orderStatusChanges', checked)}
                      />
                    </div>
                    
                    <h3 className="font-medium border-b pb-2 pt-4">Customer Notifications</h3>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Customers</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts when new customers register</p>
                      </div>
                      <Switch 
                        checked={notifications.newCustomers}
                        onCheckedChange={(checked) => handleNotificationChange('newCustomers', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Product Reviews</Label>
                        <p className="text-sm text-muted-foreground">Get notified when customers leave reviews</p>
                      </div>
                      <Switch 
                        checked={notifications.productReviews}
                        onCheckedChange={(checked) => handleNotificationChange('productReviews', checked)}
                      />
                    </div>
                    
                    <h3 className="font-medium border-b pb-2 pt-4">System Notifications</h3>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Low Stock Alerts</Label>
                        <p className="text-sm text-muted-foreground">Be notified when product inventory is low</p>
                      </div>
                      <Switch 
                        checked={notifications.lowStock}
                        onCheckedChange={(checked) => handleNotificationChange('lowStock', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about important security events</p>
                      </div>
                      <Switch 
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                      />
                    </div>
                    
                    <h3 className="font-medium border-b pb-2 pt-4">Marketing Notifications</h3>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive marketing tips and best practices</p>
                      </div>
                      <Switch 
                        checked={notifications.marketingUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('marketingUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Newsletter Signups</Label>
                        <p className="text-sm text-muted-foreground">Be notified when customers subscribe to your newsletter</p>
                      </div>
                      <Switch 
                        checked={notifications.newsletterSignups}
                        onCheckedChange={(checked) => handleNotificationChange('newsletterSignups', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 ml-auto">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Test Email
                    </Button>
                    <Button variant="outline">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Test SMS
                    </Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium border-b pb-2">Account Security</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button>
                        Update Password
                      </Button>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-medium border-b pb-2 pt-2">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">Protect your account with two-factor authentication</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-medium border-b pb-2 pt-2">Privacy Settings</h3>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">Allow anonymous usage data collection to improve our services</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Cookies</Label>
                        <p className="text-sm text-muted-foreground">Allow cookies for marketing and advertising purposes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button className="ml-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </AdminLayout>
  );
}