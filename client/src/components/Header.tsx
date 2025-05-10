import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
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
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-sm" : ""} transition-all`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-montserrat font-bold text-teal">KavinoRa</a>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <a className={`font-montserrat text-sm font-medium ${location === "/" ? "text-teal" : "text-gray-800"} hover:text-teal transition-all`}>Home</a>
          </Link>
          <Link href="/about">
            <a className={`font-montserrat text-sm font-medium ${location === "/about" ? "text-teal" : "text-gray-800"} hover:text-teal transition-all`}>About</a>
          </Link>
          <Link href="/product">
            <a className={`font-montserrat text-sm font-medium ${location === "/product" ? "text-teal" : "text-gray-800"} hover:text-teal transition-all`}>MotionMist™</a>
          </Link>
          <Link href="/blog">
            <a className={`font-montserrat text-sm font-medium ${location === "/blog" ? "text-teal" : "text-gray-800"} hover:text-teal transition-all`}>Journal</a>
          </Link>
          <Link href="/contact">
            <a className={`font-montserrat text-sm font-medium ${location === "/contact" ? "text-teal" : "text-gray-800"} hover:text-teal transition-all`}>Contact</a>
          </Link>
        </nav>
        
        {/* Header Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <a className="text-gray-800 hover:text-teal transition-all relative" aria-label="Shopping Cart">
              <i className="ri-shopping-cart-2-line text-xl"></i>
              {/* Cart Item Count Badge */}
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </a>
          </Link>

          <button 
            className="text-gray-800 hover:text-teal transition-all hidden md:block" 
            aria-label="Help"
          >
            <i className="ri-question-line text-xl"></i>
          </button>

          {/* User Menu */}
          <div className="relative hidden md:block" ref={userMenuRef}>
            <button
              className="text-gray-800 hover:text-teal transition-all"
              onClick={toggleUserMenu}
              aria-label="User Account"
            >
              {user ? (
                <div className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.firstName ? (
                    user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
              ) : (
                <i className="ri-user-line text-xl"></i>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Account
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Order History
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign In
                      </a>
                    </Link>
                    <Link href="/auth">
                      <a 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          localStorage.setItem('authTab', 'signup');
                        }}
                      >
                        Create Account
                      </a>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button with Combined Icons */}
          <div className="md:hidden flex items-center space-x-3">
            <Link href="/cart">
              <a className="text-gray-800 hover:text-teal transition-all relative" aria-label="Shopping Cart">
                <i className="ri-shopping-cart-2-line text-xl"></i>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </a>
            </Link>
            <button
              className="text-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <i className={`ri-${isMenuOpen ? "close" : "menu"}-line text-2xl`}></i>
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
