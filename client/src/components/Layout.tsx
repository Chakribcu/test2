import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Ensure proper scroll restoration and behavior
  useEffect(() => {
    // Fix for iOS Safari overscroll issues
    document.body.style.overscrollBehavior = "none";
    
    // Fix for iOS header visibility issues with momentum scrolling
    window.addEventListener('scroll', () => {}, { passive: true });
    
    return () => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
