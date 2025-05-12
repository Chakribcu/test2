import { useState } from "react";
import { Link } from "wouter";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Copy,
  Tag,
  Eye
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
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AIProductDescriptionGenerator } from "@/components/AIProductDescriptionGenerator";

// Mock product data
const products = [
  {
    id: 1,
    name: "CloudWalk Pro 2000",
    sku: "CWP2000-B-42",
    price: 149.99,
    inventory: 24,
    status: "Active",
    category: "Wellness Shoes",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 2,
    name: "ErgoFlex Insole",
    sku: "EFI-001",
    price: 39.99,
    inventory: 105,
    status: "Active",
    category: "Ergonomic Insoles",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 3,
    name: "CloudWalk Air",
    sku: "CWA-W-39",
    price: 129.99,
    inventory: 0,
    status: "Out of Stock",
    category: "Wellness Shoes",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 4,
    name: "ComfortStride Sandals",
    sku: "CSS-001",
    price: 89.99,
    inventory: 32,
    status: "Active",
    category: "Comfort Sandals",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 5,
    name: "Wellness Support Socks",
    sku: "WSS-M-B",
    price: 24.99,
    inventory: 78,
    status: "Active",
    category: "Accessories",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 6,
    name: "CloudWalk Limited Edition",
    sku: "CWLE-2025",
    price: 199.99,
    inventory: 5,
    status: "Limited",
    category: "Wellness Shoes",
    image: "https://via.placeholder.com/40x40"
  },
  {
    id: 7,
    name: "PoseTech Orthopedic Shoe",
    sku: "PTOS-B-44",
    price: 179.99,
    inventory: 12,
    status: "Draft",
    category: "Orthopedic Footwear",
    image: "https://via.placeholder.com/40x40"
  }
];

export default function AdminProducts() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter products based on search query, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchQuery.trim() === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesStatus = 
      selectedStatus === "all" || 
      product.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle checkbox selection
  const handleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  return (
    <AdminLayout 
      title="Products" 
      description="Manage your product inventory and information"
    >
      <div className="flex flex-col gap-6">
        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-grow max-w-md gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
            <AIProductDescriptionGenerator />
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Link href="/admin/product-manager">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Category & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="wellness shoes">Wellness Shoes</SelectItem>
                <SelectItem value="ergonomic insoles">Ergonomic Insoles</SelectItem>
                <SelectItem value="comfort sandals">Comfort Sandals</SelectItem>
                <SelectItem value="orthopedic footwear">Orthopedic Footwear</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-40">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out of stock">Out of Stock</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Products Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-12">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-6">
                        No products found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)} 
                            onCheckedChange={() => handleSelectProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <span className={product.inventory === 0 ? "text-destructive" : ""}>
                            {product.inventory}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              product.status === "Active" ? "default" :
                              product.status === "Draft" ? "secondary" :
                              product.status === "Out of Stock" ? "destructive" :
                              "outline"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
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
                                <Link href={`/admin/product-manager?id=${product.id}`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
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
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="flex items-center gap-2">
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{selectedProducts.length} selected</span>
                  <Button variant="outline" size="sm">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    Categorize
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
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