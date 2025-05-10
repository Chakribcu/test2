import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 bg-background ${isScrolled ? "shadow-md border-b" : ""} transition-all`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19.5 19.5 15 14l-1 4-3-4-2.5 3L5 9l3 4 3.5-3.5L15 15l2-5 2.5 6.5Z"/>
          </svg>
          KavinoRa
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`text-sm font-medium ${location === "/" ? "text-primary" : "text-foreground"} hover:text-primary transition-all`}>
            Home
          </Link>
          <Link href="/about" className={`text-sm font-medium ${location === "/about" ? "text-primary" : "text-foreground"} hover:text-primary transition-all`}>
            About
          </Link>
          <Link href="/product" className={`text-sm font-medium ${location === "/product" ? "text-primary" : "text-foreground"} hover:text-primary transition-all`}>
            Shop
          </Link>
          <Link href="/blog" className={`text-sm font-medium ${location === "/blog" ? "text-primary" : "text-foreground"} hover:text-primary transition-all`}>
            Journal
          </Link>
          <Link href="/contact" className={`text-sm font-medium ${location === "/contact" ? "text-primary" : "text-foreground"} hover:text-primary transition-all`}>
            Contact
          </Link>
        </nav>
        
        {/* Header Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="text-foreground hover:text-primary transition-all relative" aria-label="Shopping Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-shopping-bag">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {/* Cart Item Count Badge */}
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Link>

          <button 
            className="text-foreground hover:text-primary transition-all hidden md:block" 
            aria-label="Help"
            onClick={() => window.location.href = '/contact'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-help-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>

          {/* User Menu */}
          <div className="relative hidden md:block" ref={userMenuRef}>
            <button
              className="text-foreground hover:text-primary transition-all"
              onClick={toggleUserMenu}
              aria-label="User Account"
            >
              {user ? (
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.firstName ? (
                    user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-user">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-10 border">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-muted">
                      My Account
                    </Link>
                    <Link href="/order-history" className="block px-4 py-2 text-sm hover:bg-muted">
                      Order History
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth" className="block px-4 py-2 text-sm hover:bg-muted">
                      Sign In
                    </Link>
                    <Link 
                      href="/auth" 
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => {
                        localStorage.setItem('authTab', 'signup');
                      }}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button Combined Icons */}
          <div className="md:hidden flex items-center space-x-3">
            {user ? (
              <div 
                className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center overflow-hidden"
                onClick={toggleMenu}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <Link href="/auth" className="text-foreground hover:text-primary transition-all" aria-label="Sign In">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-user">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            )}
            <button
              className="text-foreground hover:text-primary focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-x">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} currentPath={location} />
    </header>
  );
};

export default Header;
