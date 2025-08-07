import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, Users, Globe, Award, Target, Heart, Recycle, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "A long-term commitment to the planet—not just a quick fix. We believe in creating lasting environmental impact through thoughtful action."
    },
    {
      icon: Users,
      title: "Community",
      description: "Partnering locally to create jobs, share knowledge, and spark meaningful change. Together, we build a stronger, more sustainable future."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Always looking for smarter, cleaner ways to manage e-waste through thoughtful design and cutting-edge technology."
    },
    {
      icon: Shield,
      title: "Responsibility",
      description: "Ensuring every device we collect is handled with care—ethically reused, repurposed, or recycled with complete transparency."
    },
    {
      icon: Heart,
      title: "Equity",
      description: "Access to clean, affordable technology should be a right, not a privilege. We work to bridge the digital divide."
    }
  ];

  const services = [
    "E-Waste Collection & Logistics",
    "Device Refurbishment & Resale", 
    "Environmental Impact Reporting",
    "Community Workshops & Education",
    "Business Pick-Up Services",
    "Certified Recycling"
  ];

  const impacts = [
    "Reducing Harmful Waste",
    "Conserving Natural Resources", 
    "Supporting a Circular Economy",
    "Spreading The Knowledge"
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
                About <span className="gradient-text">RYGNeco</span>
              </h1>
              <p className="text-xl text-foreground-subtle mb-8">
                We are committed to transforming the way the world thinks about electronic waste. 
                Rooted in the principles of circular economy, clean technology, and community empowerment.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <div className="space-y-4 text-foreground-subtle">
                  <p>
                    At RYGNeco, we are committed to transforming the way the world thinks about electronic waste. 
                    Rooted in the principles of circular economy, clean technology, and community empowerment, 
                    we work to give devices a second life—reducing waste and restoring value.
                  </p>
                  <p>
                    We want to close the loop on e-waste by creating accessible, ethical, and sustainable 
                    systems for reuse, repair, and recycling.
                  </p>
                </div>
              </div>
              <Card className="p-8 bg-surface-elevated">
                <h3 className="text-xl font-semibold mb-6">What We Do</h3>
                <ul className="space-y-3">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground-subtle">{service}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Why Does It Matter?</h2>
              <p className="text-lg text-foreground-subtle">
                E-waste is one of the fastest-growing waste streams in the world. Toxic materials can leak 
                into soil and water when improperly disposed of. By choosing RYGNeco, you're making a 
                measurable difference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impacts.map((impact, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex p-3 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{impact}</h3>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-foreground-subtle">
                Our company represents a future where electronics aren't discarded—they're revived, 
                respected, and reintegrated into the world responsibly.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <p className="text-lg text-foreground-subtle">
                At RYGNeco, our values guide every step we take toward a more sustainable future.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex p-4 bg-gradient-to-r from-primary to-secondary rounded-full mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-foreground-subtle">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Meet The Team</h2>
              <p className="text-lg text-foreground-subtle">
                Our leadership team brings diverse expertise and a shared passion for environmental sustainability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Leila Meyer */}
              <Card className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Leila Meyer</h3>
                <p className="text-primary font-medium mb-4">Chief Executive Officer</p>
                <div className="text-foreground-subtle text-left space-y-4">
                  <p>
                    Leila Meyer is a passionate entrepreneur committed to tackling the global e-waste crisis 
                    through innovative, community-driven solutions.
                  </p>
                  <p>
                    With a multidisciplinary background spanning Architecture, Construction, Education, 
                    Interior Design, and Marketing, she brings a unique and holistic perspective to 
                    sustainability and circular design.
                  </p>
                  <p>
                    Leila earned her Bachelor of Science in Architecture from the University of Cincinnati, 
                    where she cultivated a deep understanding of design thinking and environmental responsibility.
                  </p>
                  <p>
                    Leila's vision for RYGNeco is to revolutionize how we manage electronic waste—transforming 
                    discarded tech into opportunity and paving the way for a more sustainable future.
                  </p>
                </div>
              </Card>

              {/* Sama Mushtaq */}
              <Card className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Sama Mushtaq</h3>
                <p className="text-primary font-medium mb-4">Chief Strategy Officer</p>
                <div className="text-foreground-subtle text-left">
                  <p>
                    Sama brings strategic leadership and operational excellence to RYGNeco's mission. 
                    With expertise in business strategy and sustainable operations, Sama helps drive 
                    our company's growth while maintaining our commitment to environmental responsibility.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-lg text-foreground-subtle mb-8">
                Be part of the solution. Together, we can create a future where electronic waste becomes 
                a resource for positive change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/join">
                  <Button variant="cta" size="lg">
                    Join RYGNeco Today
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Get In Touch
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

export default About;