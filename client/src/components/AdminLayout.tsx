import { ReactNode } from "react";
import { Link } from "wouter";
import { Settings, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "./AdminSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="container max-w-6xl px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Welcome,</span>
            <span className="font-medium">{user?.firstName || 'Admin'}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <div className="flex items-center cursor-pointer w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
        {/* Sidebar - only visible on desktop by default */}
        <div className="hidden md:block md:col-span-2 lg:col-span-1">
          <Card>
            <AdminSidebar />
          </Card>
        </div>
        
        {/* Mobile Sidebar - Collapsible */}
        <div className="md:hidden mb-4">
          <details className="group">
            <summary className="list-none cursor-pointer p-3 bg-card rounded-lg flex items-center justify-between">
              <div className="font-medium">Menu</div>
              <div className="transition-transform group-open:rotate-180">▼</div>
            </summary>
            <Card className="mt-2">
              <AdminSidebar />
            </Card>
          </details>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-4 lg:col-span-5 space-y-6">
          {description && (
            <p className="text-muted-foreground mb-4">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}