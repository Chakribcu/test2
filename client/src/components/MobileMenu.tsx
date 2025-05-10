import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const MobileMenu = ({ isOpen, onClose, currentPath }: MobileMenuProps) => {
  const { user, logoutMutation } = useAuth();
  
  if (!isOpen) return null;
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  return (
    <div className="md:hidden bg-white p-4 shadow-md">
      <nav className="flex flex-col space-y-4">
        <Link 
          href="/" 
          className={`font-montserrat text-sm font-medium ${currentPath === "/" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
          onClick={onClose}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`font-montserrat text-sm font-medium ${currentPath === "/about" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
          onClick={onClose}
        >
          About
        </Link>
        <Link 
          href="/product" 
          className={`font-montserrat text-sm font-medium ${currentPath === "/product" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
          onClick={onClose}
        >
          MotionMist™
        </Link>
        <Link 
          href="/blog" 
          className={`font-montserrat text-sm font-medium ${currentPath === "/blog" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
          onClick={onClose}
        >
          Journal
        </Link>
        <Link 
          href="/contact" 
          className={`font-montserrat text-sm font-medium ${currentPath === "/contact" ? "text-teal" : "text-gray-800"} hover:text-teal py-2`}
          onClick={onClose}
        >
          Contact
        </Link>

        <hr className="border-gray-200 my-2" />
        
        {/* User Account Section */}
        {user ? (
          <>
            <div className="flex items-center py-2">
              <div className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center overflow-hidden mr-3">
                {user.firstName ? (
                  user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-montserrat font-medium text-sm">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <a
              href="#"
              className="flex items-center font-montserrat text-sm font-medium text-gray-800 hover:text-teal py-2"
              onClick={onClose}
            >
              <i className="ri-user-settings-line mr-3"></i>
              My Account
            </a>
            <a
              href="#"
              className="flex items-center font-montserrat text-sm font-medium text-gray-800 hover:text-teal py-2"
              onClick={onClose}
            >
              <i className="ri-history-line mr-3"></i>
              Order History
            </a>
            <button
              className="flex items-center w-full text-left font-montserrat text-sm font-medium text-gray-800 hover:text-teal py-2"
              onClick={handleLogout}
            >
              <i className="ri-logout-box-line mr-3"></i>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link 
              href="/auth" 
              className="flex items-center font-montserrat text-sm font-medium text-gray-800 hover:text-teal py-2"
              onClick={onClose}
            >
              <i className="ri-login-circle-line mr-3"></i>
              Sign In
            </Link>
            <Link 
              href="/auth" 
              className="flex items-center font-montserrat text-sm font-medium text-gray-800 hover:text-teal py-2"
              onClick={() => {
                localStorage.setItem('authTab', 'signup');
                onClose();
              }}
            >
              <i className="ri-user-add-line mr-3"></i>
              Create Account
            </Link>
          </>
        )}
        
        <hr className="border-gray-200 my-2" />
        
        {/* Help Button */}
        <button
          className="flex items-center w-full text-left font-montserrat text-sm font-medium text-gray-800 hover:text-teal py-2"
          onClick={onClose}
        >
          <i className="ri-question-line mr-3"></i>
          Help & Support
        </button>
      </nav>
    </div>
  );
};

export default MobileMenu;
