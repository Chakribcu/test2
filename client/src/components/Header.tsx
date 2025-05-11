import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import AuthModal from "./AuthModal";
import { AnimatePresence, motion } from "framer-motion";
import OptimizedImage from "./ui/optimized-image";

// Apple-inspired Header component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { itemCount } = useCart();
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

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-border/30 shadow-sm" 
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo - Apple Style */}
          <Link href="/" className="flex items-center relative z-10">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none"
              className="text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" 
                fill="currentColor"
              />
            </svg>
            <span className="ml-2 text-xl font-semibold tracking-tight">KavinoRa</span>
          </Link>
          
          {/* Desktop Navigation - Apple Style */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="bg-[#f5f5f7]/80 backdrop-blur-sm rounded-full px-2 py-1 flex space-x-1">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/product", label: "Shop" },
                { href: "/blog", label: "Journal" },
                { href: "/contact", label: "Contact" }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    location === item.href 
                      ? "bg-white text-[#1d1d1f] shadow-sm font-medium" 
                      : "text-[#1d1d1f]/80 hover:text-[#1d1d1f]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Header Actions - Apple Style */}
          <div className="flex items-center space-x-5 relative z-10">
            {/* Search button */}
            <button className="text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors hidden md:flex items-center text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden lg:inline">Search</span>
            </button>
            
            {/* Cart button */}
            <Link 
              href="/cart" 
              className="text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors flex items-center text-sm relative"
              aria-label="Shopping Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden lg:inline">Bag</span>
              {/* Cart count badge - only show when there are items */}
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 lg:-top-1.5 lg:right-8 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* User account button */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors flex items-center text-sm"
                onClick={user ? toggleUserMenu : openAuthModal}
                aria-label="Account"
              >
                {user ? (
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user.firstName ? (
                      user.firstName.charAt(0)
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="hidden lg:inline">Account</span>
                  </>
                )}
              </button>

              {/* User dropdown menu - Apple Style */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl overflow-hidden bg-white/95 backdrop-blur-md shadow-lg border border-border/40 py-1 z-10">
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-sm font-medium">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/account" className="flex items-center px-4 py-2 text-sm hover:bg-[#f5f5f7]">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      My Account
                    </Link>
                    <Link href="/order-history" className="flex items-center px-4 py-2 text-sm hover:bg-[#f5f5f7]">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      Order History
                    </Link>
                  </div>
                  <div className="border-t border-border/30 py-1">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm hover:bg-[#f5f5f7] text-left"
                    >
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile menu button - Apple Style */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 text-[#1d1d1f]"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Slide Down Animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-b border-border/20"
            >
              <nav className="container mx-auto py-6 px-6 space-y-6">
                <div className="space-y-3">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about", label: "About" },
                    { href: "/product", label: "Shop" },
                    { href: "/blog", label: "Journal" },
                    { href: "/contact", label: "Contact" }
                  ].map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`block py-2 text-base ${
                        location === item.href 
                          ? "text-primary font-medium" 
                          : "text-[#1d1d1f]"
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                {user ? (
                  <div className="border-t border-border/20 pt-4 space-y-3">
                    <Link 
                      href="/account" 
                      className="block py-2 text-base text-[#1d1d1f]"
                      onClick={closeMenu}
                    >
                      My Account
                    </Link>
                    <Link 
                      href="/order-history" 
                      className="block py-2 text-base text-[#1d1d1f]"
                      onClick={closeMenu}
                    >
                      Order History
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="block py-2 text-base text-[#1d1d1f] w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-border/20 pt-4 space-y-4">
                    <button 
                      className="block w-full py-2.5 text-center rounded-full bg-primary text-white font-medium"
                      onClick={() => {
                        closeMenu();
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Sign In
                    </button>
                    <button 
                      className="block w-full py-2.5 text-center rounded-full border border-[#1d1d1f]/10 text-[#1d1d1f] font-medium"
                      onClick={() => {
                        localStorage.setItem('authTab', 'signup');
                        closeMenu();
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to compensate for fixed header */}
      <div className="h-16 md:h-20"></div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={localStorage.getItem('authTab') === 'signup' ? 'register' : 'login'}
      />
    </>
  );
};

export default Header;
