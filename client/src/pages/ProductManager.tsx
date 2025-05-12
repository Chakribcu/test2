import { useState } from "react";
import { ArrowLeft, Plus, RotateCw, Save, Upload } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIProductDescriptionGenerator } from "@/components/AIProductDescriptionGenerator";

export default function ProductManager() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Product Manager</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RotateCw className="h-4 w-4 mr-2" />
            Discard Changes
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Product Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Fill in the details about your product.
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
              </div>
              
              <CardContent className="pt-6">
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productName" className="text-right">
                        Product Name
                      </Label>
                      <Input
                        id="productName"
                        placeholder="e.g. CloudWalk Pro 2000"
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sku" className="text-right">
                        SKU
                      </Label>
                      <Input
                        id="sku"
                        placeholder="e.g. CWP2000-BLK-42"
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price
                      </Label>
                      <div className="col-span-3 flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="price"
                          type="number"
                          placeholder="149.99"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="compareAtPrice" className="text-right">
                        Compare at price
                      </Label>
                      <div className="col-span-3 flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="compareAtPrice"
                          type="number"
                          placeholder="179.99"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wellness">Wellness Shoes</SelectItem>
                          <SelectItem value="orthopedic">Orthopedic Footwear</SelectItem>
                          <SelectItem value="insoles">Ergonomic Insoles</SelectItem>
                          <SelectItem value="sandals">Comfort Sandals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="taxable" className="text-right pt-2">
                        Taxable
                      </Label>
                      <div className="flex items-center space-x-2 col-span-3">
                        <Checkbox id="taxable" defaultChecked />
                        <label
                          htmlFor="taxable"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          This product is subject to tax
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="description" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-start gap-4">
                      <div className="col-span-4">
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="description" className="font-medium">
                            Full Description
                          </Label>
                          <AIProductDescriptionGenerator />
                        </div>
                        <Textarea
                          id="description"
                          placeholder="Describe your product in detail..."
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <div className="col-span-4">
                        <Label htmlFor="shortDescription" className="block mb-2 font-medium">
                          Short Description
                        </Label>
                        <Textarea
                          id="shortDescription"
                          placeholder="A brief summary of your product..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    
                    {/* Features/Benefits */}
                    <div className="col-span-4 border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Key Features & Benefits</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input placeholder="e.g. Advanced arch support" className="flex-1" />
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center">
                          <Input placeholder="e.g. Memory foam insole" className="flex-1" />
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center">
                          <Input placeholder="e.g. Breathable materials" className="flex-1" />
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="variants" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Product Variants</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                    
                    {/* Size option */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="sizeOption" className="font-medium">
                            Size
                          </Label>
                        </div>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="border rounded p-2 text-center">38</div>
                        <div className="border rounded p-2 text-center">39</div>
                        <div className="border rounded p-2 text-center">40</div>
                        <div className="border rounded p-2 text-center">41</div>
                        <div className="border rounded p-2 text-center">42</div>
                        <div className="border rounded p-2 text-center">43</div>
                        <div className="border rounded p-2 text-center">44</div>
                        <div className="border rounded p-2 text-center">45</div>
                        <div className="border rounded p-2 flex items-center justify-center text-muted-foreground">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </div>
                      </div>
                    </div>
                    
                    {/* Color option */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="colorOption" className="font-medium">
                            Color
                          </Label>
                        </div>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="border rounded p-2 flex items-center">
                          <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                          Black
                        </div>
                        <div className="border rounded p-2 flex items-center">
                          <div className="w-4 h-4 rounded-full bg-white border mr-2"></div>
                          White
                        </div>
                        <div className="border rounded p-2 flex items-center">
                          <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                          Gray
                        </div>
                        <div className="border rounded p-2 flex items-center">
                          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                          Blue
                        </div>
                        <div className="border rounded p-2 flex items-center justify-center text-muted-foreground">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="media" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="col-span-4">
                      <Label className="block mb-2 font-medium">Product Images</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border-2 border-dashed rounded-lg p-4 aspect-square flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 mb-2" />
                          <p className="text-xs text-center">Drag & drop or click to upload</p>
                        </div>
                        <div className="border rounded-lg p-1 relative">
                          <img 
                            src="https://via.placeholder.com/300x300?text=Product+Image" 
                            alt="Product thumbnail" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 w-7 p-0">×</Button>
                        </div>
                        <div className="border rounded-lg p-1 relative">
                          <img 
                            src="https://via.placeholder.com/300x300?text=Product+Image" 
                            alt="Product thumbnail" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 w-7 p-0">×</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
            
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column - Product Preview/Meta */}
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select defaultValue="draft">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="visibility" className="text-right pt-2">
                      Visibility
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Checkbox id="visibility" />
                      <label
                        htmlFor="visibility"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Visible on website
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                  Optimize for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle" className="block mb-2">
                    Meta Title
                  </Label>
                  <Input id="metaTitle" placeholder="SEO optimized title" />
                </div>
                <div>
                  <Label htmlFor="metaDescription" className="block mb-2">
                    Meta Description
                  </Label>
                  <Textarea id="metaDescription" placeholder="Brief description for search results" />
                </div>
                <div>
                  <Label htmlFor="tags" className="block mb-2">
                    Tags
                  </Label>
                  <Input id="tags" placeholder="comfort, wellness, shoes" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="trackInventory" className="text-right pt-2">
                    Tracking
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Checkbox id="trackInventory" defaultChecked />
                    <label
                      htmlFor="trackInventory"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Track inventory
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}