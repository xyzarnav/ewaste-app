import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface-elevated border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-eco-green to-trust-blue rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">RYGNeco</span>
            </div>
            <p className="text-foreground-subtle text-sm">
              Empowering India to recycle responsibly. Together, we're building a circular economy for a sustainable future.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/how-it-works" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                How It Works
              </Link>
              <Link to="/education" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                Education
              </Link>
              <Link to="/about" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                About Us
              </Link>
              <Link to="/join" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                Join Us
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <div className="space-y-2">
              <Link to="/schedule" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                Schedule Pickup
              </Link>
              <Link to="/business" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                Business Solutions
              </Link>
              <Link to="/certificates" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                Certificates
              </Link>
              <Link to="/impact" className="block text-foreground-subtle hover:text-primary text-sm transition-colors">
                Impact Tracking
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-foreground-subtle text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@rygneco.in</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground-subtle text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground-subtle text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-foreground-muted text-sm">
            © 2024 RYGNeco. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-foreground-muted hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-foreground-muted hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;