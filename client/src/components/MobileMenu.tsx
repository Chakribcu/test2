import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Info, 
  ShoppingBag, 
  BookOpen, 
  MessageSquare,
  User,
  History,
  LogOut,
  LogIn,
  UserPlus,
  HelpCircle,
  ShoppingCart
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  openAuthModal?: () => void;
}

const MobileMenu = ({ isOpen, onClose, currentPath }: MobileMenuProps) => {
  const { user, logoutMutation } = useAuth();
  
  if (!isOpen) return null;
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black bg-opacity-50" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-background shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <nav className="flex flex-col space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-x">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="space-y-1 py-2">
            <Link 
              href="/" 
              className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${currentPath === "/" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={onClose}
            >
              <Home className="h-4 w-4 mr-3" />
              Home
            </Link>
            
            <Link 
              href="/about" 
              className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${currentPath === "/about" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={onClose}
            >
              <Info className="h-4 w-4 mr-3" />
              About
            </Link>
            
            <Link 
              href="/product" 
              className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${currentPath === "/product" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={onClose}
            >
              <ShoppingBag className="h-4 w-4 mr-3" />
              Shop
            </Link>
            
            <Link 
              href="/blog" 
              className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${currentPath === "/blog" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={onClose}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Journal
            </Link>
            
            <Link 
              href="/contact" 
              className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${currentPath === "/contact" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={onClose}
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              Contact
            </Link>
            
            <Link 
              href="/cart" 
              className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${currentPath === "/cart" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={onClose}
            >
              <ShoppingCart className="h-4 w-4 mr-3" />
              Shopping Cart
            </Link>
          </div>

          <div className="border-t pt-4 my-2">
            <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">Account</h3>
          </div>
          
          {/* User Account Section */}
          {user ? (
            <div className="space-y-1">
              <div className="flex items-center py-2 px-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center overflow-hidden mr-3">
                  {user.firstName ? (
                    user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <Link
                href="/account"
                className="flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-muted"
                onClick={onClose}
              >
                <User className="h-4 w-4 mr-3" />
                My Account
              </Link>
              
              <Link
                href="/order-history"
                className="flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-muted"
                onClick={onClose}
              >
                <History className="h-4 w-4 mr-3" />
                Order History
              </Link>
              
              <button
                className="flex items-center w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-muted"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link 
                href="/auth" 
                className="flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-muted"
                onClick={onClose}
              >
                <LogIn className="h-4 w-4 mr-3" />
                Sign In
              </Link>
              
              <Link 
                href="/auth" 
                className="flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-muted"
                onClick={() => {
                  localStorage.setItem('authTab', 'signup');
                  onClose();
                }}
              >
                <UserPlus className="h-4 w-4 mr-3" />
                Create Account
              </Link>
            </div>
          )}
          
          <div className="border-t pt-4 mt-2">
            <Link
              href="/contact"
              className="flex items-center py-2 px-3 rounded-md text-sm font-medium hover:bg-muted"
              onClick={onClose}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
