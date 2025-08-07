import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Truck, Shield, Award, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: Calendar,
      title: "Schedule Pickup",
      description: "Book a convenient time slot for our team to collect your e-waste from your location.",
      color: "from-eco-green to-eco-green-light"
    },
    {
      step: "02", 
      icon: Truck,
      title: "Safe Collection",
      description: "Our certified team arrives with proper equipment to safely collect and transport your devices.",
      color: "from-trust-blue to-trust-blue-light"
    },
    {
      step: "03",
      icon: Shield,
      title: "Data Security",
      description: "We ensure complete data destruction with certified processes and provide you with a security certificate.",
      color: "from-success to-eco-green-light"
    },
    {
      step: "04",
      icon: Award,
      title: "Impact Certificate",
      description: "Receive detailed reports on your environmental impact and recycling certificate for compliance.",
      color: "from-warning to-eco-green"
    }
  ];

  return (
    <section className="py-20 bg-background-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-foreground-subtle">
            Our simple 4-step process ensures your e-waste is handled responsibly 
            with complete transparency and maximum environmental impact.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connection Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/30 z-10"></div>
              )}
              
              <Card className="p-6 h-full bg-surface border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="space-y-4">
                  {/* Step Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-foreground-muted">{step.step}</span>
                    <div className={`p-3 bg-gradient-to-r ${step.color} rounded-lg`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-foreground-subtle text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* What We Collect */}
        <div className="bg-surface rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">What We Collect</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Smartphones & Tablets",
              "Laptops & Computers", 
              "Printers & Scanners",
              "Gaming Consoles",
              "Smart TVs & Monitors",
              "Home Appliances",
              "Cables & Accessories",
              "And Much More..."
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-foreground-subtle">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Ready to Make an Impact?</h3>
            <p className="text-foreground-subtle max-w-2xl mx-auto">
              Join thousands of Indians who are already contributing to a cleaner, 
              more sustainable future through responsible e-waste recycling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/schedule">
                <Button variant="cta" size="lg">
                  Schedule Your First Pickup
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">
                  Learn More Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;