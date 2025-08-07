import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Building, GraduationCap, ArrowRight, CheckCircle } from "lucide-react";

const JoinUs = () => {
  const userTypes = [
    {
      icon: User,
      title: "Individual",
      subtitle: "For Personal E-Waste Recycling",
      description: "Perfect for households and individuals looking to responsibly dispose of their electronic devices.",
      features: [
        "Free doorstep pickup",
        "Personal impact dashboard",
        "Data security guarantee",
        "Digital certificates",
        "Eco-impact tracking"
      ],
      benefits: "Join 10,000+ individuals making a difference",
      cta: "Register as Individual",
      link: "/register/individual",
      popular: false
    },
    {
      icon: Building,
      title: "Business",
      subtitle: "For Corporate E-Waste Management",
      description: "Comprehensive e-waste solutions for businesses of all sizes with CSR compliance and reporting.",
      features: [
        "Bulk pickup services",
        "CSR compliance reports",
        "Employee engagement programs",
        "Quarterly impact analytics",
        "Corporate certificates"
      ],
      benefits: "Trusted by 500+ businesses across India",
      cta: "Get Business Solution",
      link: "/register/business",
      popular: true
    },
    {
      icon: GraduationCap,
      title: "Institution",
      subtitle: "For Educational & Government Bodies",
      description: "Specialized programs for schools, colleges, universities, and government institutions.",
      features: [
        "Campus-wide collection drives",
        "Educational workshops",
        "Student engagement programs",
        "Compliance documentation",
        "Community impact reports"
      ],
      benefits: "Supporting 200+ institutions nationwide",
      cta: "Partner With Us",
      link: "/register/institution",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the <span className="gradient-text">Movement</span>
            </h1>
            <p className="text-xl text-foreground-subtle mb-8">
              Choose the path that fits your needs and start making a positive environmental impact today. 
              Every device recycled contributes to India's sustainable future.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-foreground-muted">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Government Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Free Pickup</span>
              </div>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card 
                key={type.title}
                className={`relative p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-surface-elevated ${
                  type.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {/* Popular Badge */}
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-eco-green to-trust-blue text-white px-4 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon & Title */}
                  <div className="text-center">
                    <div className={`inline-flex p-4 bg-gradient-to-r ${
                      type.popular ? 'from-eco-green to-trust-blue' : 'from-primary to-secondary'
                    } rounded-xl mb-4`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                    <p className="text-sm text-primary font-medium">{type.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-foreground-subtle text-center">{type.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm text-foreground-subtle">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-foreground-subtle font-medium">{type.benefits}</p>
                  </div>

                  {/* CTA */}
                  <Link to={type.link}>
                    <Button 
                      variant={type.popular ? "hero" : "outline"} 
                      size="lg"
                      className="w-full group"
                    >
                      {type.cta}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-20 text-center">
            <Card className="p-8 bg-gradient-to-r from-background-subtle to-accent border-0 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Need Help Choosing?</h3>
              <p className="text-foreground-subtle mb-6">
                Our team is here to help you find the perfect solution for your e-waste recycling needs. 
                Get personalized recommendations based on your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Our Team
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="secondary" size="lg">
                    Learn More About Our Process
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinUs;