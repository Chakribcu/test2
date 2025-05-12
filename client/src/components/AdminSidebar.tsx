import { Link, useLocation } from "wouter";
import { 
  BarChart, 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function AdminSidebar() {
  const [location] = useLocation();
  
  const links: SidebarLink[] = [
    { 
      href: "/admin", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/products", 
      label: "Products", 
      icon: <Package className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/categories", 
      label: "Categories", 
      icon: <Tag className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/orders", 
      label: "Orders", 
      icon: <ShoppingCart className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/customers", 
      label: "Customers", 
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/support", 
      label: "Support", 
      icon: <MessageSquare className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/analytics", 
      label: "Analytics", 
      icon: <BarChart className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/content", 
      label: "Content", 
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    { 
      href: "/admin/settings", 
      label: "Settings", 
      icon: <Settings className="h-4 w-4 mr-2" />
    },
  ];
  
  return (
    <nav className="grid gap-1 p-2">
      {links.map((link) => {
        const isActive = location === link.href;
        
        return (
          <Link key={link.href} href={link.href}>
            <Button 
              variant={isActive ? "default" : "ghost"} 
              className={cn(
                "justify-start w-full",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              {link.icon}
              {link.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}