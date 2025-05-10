import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const MobileMenu = ({ isOpen, onClose, currentPath }: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white p-4 shadow-md">
      <nav className="flex flex-col space-y-4">
        <Link href="/">
          <a 
            className={`font-montserrat text-sm font-medium ${currentPath === "/" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
            onClick={onClose}
          >
            Home
          </a>
        </Link>
        <Link href="/about">
          <a 
            className={`font-montserrat text-sm font-medium ${currentPath === "/about" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
            onClick={onClose}
          >
            About
          </a>
        </Link>
        <Link href="/product">
          <a 
            className={`font-montserrat text-sm font-medium ${currentPath === "/product" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
            onClick={onClose}
          >
            MotionMist™
          </a>
        </Link>
        <Link href="/blog">
          <a 
            className={`font-montserrat text-sm font-medium ${currentPath === "/blog" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
            onClick={onClose}
          >
            Journal
          </a>
        </Link>
        <Link href="/contact">
          <a 
            className={`font-montserrat text-sm font-medium ${currentPath === "/contact" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
            onClick={onClose}
          >
            Contact
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
