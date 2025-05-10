import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <i className={`ri-${isMenuOpen ? "close" : "menu"}-line text-2xl`}></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} currentPath={location} />
    </header>
  );
};

export default Header;
