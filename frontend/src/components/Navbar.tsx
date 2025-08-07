import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, User, Building } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            <Link to="/admin/manage-clients" className="text-foreground hover:text-primary transition-colors font-semibold">
              Manage Clients
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/join">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
                Join Us
              </Button>
            </Link>
            <Link to="/schedule">
              <Button variant="cta" size="sm">
                Schedule Pickup
              </Button>
            </Link>
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
              <Link 
                to="/admin/manage-clients" 
                className="text-foreground hover:text-primary transition-colors py-2 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Clients
              </Link>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <Link to="/join" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4" />
                    Join Us
                  </Button>
                </Link>
                <Link to="/schedule" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="cta" className="w-full">
                    Schedule Pickup
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;