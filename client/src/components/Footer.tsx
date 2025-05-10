import { Link } from "wouter";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <>
      <Newsletter />
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl mb-4">KavinoRa</h3>
              <p className="text-gray-400 mb-4">Plant-based wellness products designed for comfort, confidence, and simplicity.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all" aria-label="Instagram">
                  <i className="ri-instagram-line text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all" aria-label="TikTok">
                  <i className="ri-tiktok-line text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all" aria-label="Facebook">
                  <i className="ri-facebook-circle-line text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all" aria-label="Twitter">
                  <i className="ri-twitter-line text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-all">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-all">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/product" className="text-gray-400 hover:text-white transition-all">
                    MotionMist™
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-all">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-all">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-all">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-all">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all">Shipping Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all">Returns & Refunds</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">hello@kavinora.com</p>
              <p className="text-gray-400">Customer service: Mon-Fri 9am-5pm ET</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} KavinoRa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
