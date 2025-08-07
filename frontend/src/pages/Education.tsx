import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recycle, Globe, BookOpen, Users, Lightbulb, TrendingUp } from "lucide-react";

const Education = () => {
  const funFacts = [
    "E-waste is the fastest-growing waste stream in the world",
    "One smartphone contains over 60 elements from the periodic table",
    "95% of e-waste materials can be recovered and reused",
    "E-waste contains valuable materials worth over $62.5 billion annually",
    "Recycling 1 million laptops saves energy equivalent to electricity used by 3,500 homes for a year"
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Education & <span className="gradient-text">Awareness</span>
              </h1>
              <p className="text-xl text-foreground-subtle mb-8">
                Understanding e-waste is the first step toward creating a sustainable future. 
                Learn why responsible electronic waste management matters for our planet.
              </p>
              <Link to="/join">
                <Button variant="cta" size="lg">
                  Join Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What is E-Waste */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">What Is E-Waste?</h2>
                <div className="space-y-4 text-foreground-subtle">
                  <p>
                    Electronic waste (e-waste) refers to discarded electrical or electronic devices, 
                    including everything from outdated smartphones and laptops to broken household 
                    appliances and industrial equipment.
                  </p>
                  <p>
                    E-waste often contains valuable materials like gold, copper, and rare earth elements, 
                    alongside hazardous substances such as lead, mercury, and cadmium.
                  </p>
                  <p>
                    When improperly disposed of, these toxic materials can leak into soil and water, 
                    endangering human health and ecosystems.
                  </p>
                </div>
              </div>
              <Card className="p-8 bg-surface-elevated">
                <div className="flex items-center mb-4">
                  <Recycle className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Did You Know?</h3>
                </div>
                <p className="text-foreground-subtle">
                  The average smartphone contains more computing power than the computers 
                  that guided Apollo 11 to the moon, yet most are discarded after just 2-3 years.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Why E-Waste Matters */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Why Does E-Waste Matter?</h2>
              <p className="text-lg text-foreground-subtle">
                E-waste is the fastest-growing waste stream in the world, driven by rapid 
                technological advancement and short product life cycles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Growing Crisis",
                  description: "E-waste generation is increasing 3x faster than population growth globally."
                },
                {
                  icon: Globe,
                  title: "Environmental Impact", 
                  description: "Toxic substances from e-waste contaminate soil, water, and air when improperly disposed."
                },
                {
                  icon: Lightbulb,
                  title: "Economic Opportunity",
                  description: "E-waste contains valuable materials worth billions that can be recovered and reused."
                },
                {
                  icon: Users,
                  title: "Health Effects",
                  description: "Improper e-waste disposal endangers human health, especially in developing communities."
                }
              ].map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex p-3 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-foreground-subtle text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Circular Economy */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Card className="p-8 bg-surface-elevated">
                <div className="flex items-center mb-4">
                  <Globe className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Circular Economy Benefits</h3>
                </div>
                <ul className="space-y-3 text-foreground-subtle">
                  <li>• Reduces pollution and environmental damage</li>
                  <li>• Conserves natural resources and raw materials</li>
                  <li>• Creates jobs in recycling and refurbishment</li>
                  <li>• Reduces manufacturing costs through material recovery</li>
                  <li>• Extends product lifecycles through repair and reuse</li>
                </ul>
              </Card>
              <div>
                <h2 className="text-3xl font-bold mb-6">What Is A Circular Economy?</h2>
                <div className="space-y-4 text-foreground-subtle">
                  <p>
                    A circular economy keeps resources in use longer—repairing, reusing, and recycling 
                    instead of throwing away. This model reduces pollution, conserves raw materials, 
                    and gives new life to old tech.
                  </p>
                  <p>
                    Instead of the traditional "take-make-dispose" linear model, a circular economy 
                    creates closed loops where waste becomes input for new products.
                  </p>
                  <p>
                    By choosing RYGNeco, you're making a measurable difference and supporting a future 
                    where electronics aren't discarded—they're revived, respected, and reintegrated 
                    into the world responsibly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fun Facts */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Fun Facts About E-Waste</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {funFacts.map((fact, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-foreground-subtle">{fact}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Learning */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Community Learning In Action</h2>
              <p className="text-lg text-foreground-subtle mb-8">
                Education is at the heart of sustainable change. We offer workshops, resources, 
                and partnerships to spread awareness about responsible e-waste management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    icon: BookOpen,
                    title: "Educational Workshops",
                    description: "Interactive sessions for schools, businesses, and communities about e-waste impacts and solutions."
                  },
                  {
                    icon: Users,
                    title: "Community Partnerships",
                    description: "Collaborate with local organizations to create e-waste collection drives and awareness campaigns."
                  },
                  {
                    icon: Globe,
                    title: "Online Resources",
                    description: "Access guides, infographics, and educational materials to share knowledge about circular economy principles."
                  }
                ].map((item, index) => (
                  <Card key={index} className="p-6 text-center">
                    <div className="inline-flex p-3 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-foreground-subtle text-sm">{item.description}</p>
                  </Card>
                ))}
              </div>

              <div className="mt-12">
                <Link to="/contact">
                  <Button variant="secondary" size="lg">
                    Request Educational Workshop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Education;