import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, Building, Users, ArrowRight } from "lucide-react";

const WhoWeServeSection = () => {
  const userTypes = [
    {
      icon: User,
      title: "Individuals",
      description: "Personal e-waste recycling with pickup from your doorstep",
      features: [
        "Free home pickup",
        "Data security guarantee",
        "Impact tracking",
        "Recycling certificates"
      ],
      cta: "Join as Individual",
      link: "/join/individual"
    },
    {
      icon: Building,
      title: "Businesses",
      description: "Corporate e-waste management with CSR compliance",
      features: [
        "Bulk pickup services",
        "CSR documentation",
        "Employee programs",
        "Quarterly reports"
      ],
      cta: "Get Business Solution",
      link: "/join/business"
    },
    {
      icon: Users,
      title: "Institutions",
      description: "Educational and government institution partnerships",
      features: [
        "Campus-wide programs",
        "Educational workshops",
        "Compliance support",
        "Community impact"
      ],
      cta: "Partner With Us",
      link: "/join/institution"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Who We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-lg text-foreground-subtle">
            From individual households to large corporations, we provide tailored e-waste 
            recycling solutions that meet your specific needs and sustainability goals.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <Card 
              key={type.title} 
              className="p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-0 bg-surface-elevated"
            >
              <div className="space-y-6">
                {/* Icon */}
                <div className="inline-flex p-3 bg-gradient-to-r from-primary to-secondary rounded-lg">
                  <type.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{type.title}</h3>
                  <p className="text-foreground-subtle">{type.description}</p>
                  
                  {/* Features */}
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-foreground-subtle">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link to={type.link}>
                  <Button 
                    variant={index === 1 ? "secondary" : "outline"} 
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-foreground-subtle mb-6">
            Not sure which option is right for you?
          </p>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Get Personalized Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;