import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, User, Building, LogOut, LogIn } from "lucide-react";
import { getCurrentUser, logout, isAuthenticated } from "@/auth/services/authService";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      const authenticated = isAuthenticated();
      setUser(currentUser);
      setIsLoggedIn(authenticated);
    };

    checkAuth();
    // Listen for storage changes (when user logs in/out)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('storage', checkAuth); // Listen for custom storage event
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getWelcomeMessage = () => {
    if (!user) return null;
    
    const role = user.role;
    const firstName = user.firstName || 'User';
    
    if (role === 'partner') {
      return `Welcome, ${firstName} (Partner)`;
    } else if (role === 'admin' || role === 'super_admin') {
      return `Welcome, ${firstName} (Admin)`;
    }
    
    return `Welcome, ${firstName}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-eco-green to-trust-blue rounded-lg group-hover:shadow-glow transition-all duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">RYGNeco</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link to="/education" className="text-foreground hover:text-primary transition-colors">
              Education
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            {isLoggedIn && user?.role === 'partner' && (
              <Link to="/partner/dashboard" className="text-foreground hover:text-primary transition-colors font-semibold flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>Partner Dashboard</span>
              </Link>
            )}
            {isLoggedIn && (user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-colors font-semibold">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-muted-foreground font-medium">
                  {getWelcomeMessage()}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/join">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Join Us</span>
                  </Button>
                </Link>
                <Link to="/schedule">
                  <Button variant="cta" size="sm">
                    Schedule Pickup
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/education" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Education
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {isLoggedIn && user?.role === 'partner' && (
                <Link 
                  to="/partner/dashboard" 
                  className="text-foreground hover:text-primary transition-colors py-2 font-semibold flex items-center space-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building className="h-4 w-4" />
                  <span>Partner Dashboard</span>
                </Link>
              )}
              
              {isLoggedIn && (user?.role === 'admin' || user?.role === 'super_admin') && (
                <Link 
                  to="/admin/dashboard" 
                  className="text-foreground hover:text-primary transition-colors py-2 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                {isLoggedIn ? (
                  <>
                    <div className="text-sm text-muted-foreground font-medium py-2">
                      {getWelcomeMessage()}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </Button>
                    </Link>
                    <Link to="/join" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Join Us</span>
                      </Button>
                    </Link>
                    <Link to="/schedule" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="cta" className="w-full">
                        Schedule Pickup
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;