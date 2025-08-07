import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Laptop, Recycle, Globe } from "lucide-react";
import heroImage from "@/assets/hero-recycling.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background to-background-subtle overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-eco-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-trust-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent rounded-full text-sm font-medium">
                <Recycle className="h-4 w-4 text-primary" />
                <span>Empowering India's Circular Economy</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transform Your
                <span className="block gradient-text">E-Waste into Impact</span>
              </h1>
              
              <p className="text-lg text-foreground-subtle max-w-lg">
                Join India's largest e-waste recycling movement. Safe, traceable, and responsible disposal 
                of your electronic devices with complete data security and environmental impact tracking.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/schedule">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Schedule Free Pickup
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn How It Works
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary counter-glow">50K+</div>
                <div className="text-sm text-foreground-muted">Devices Recycled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary counter-glow">1000+</div>
                <div className="text-sm text-foreground-muted">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary counter-glow">25</div>
                <div className="text-sm text-foreground-muted">Cities Covered</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="E-waste recycling transformation" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-xl shadow-lg float-animation">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg float-animation delay-500">
                <Laptop className="h-6 w-6 text-secondary" />
              </div>
              <div className="absolute top-1/2 -right-6 bg-white p-3 rounded-xl shadow-lg float-animation delay-1000">
                <Globe className="h-6 w-6 text-success" />
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-eco-green/20 to-trust-blue/20 rounded-2xl blur-xl transform scale-110"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-foreground-muted rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground-muted rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;