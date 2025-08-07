import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Truck, Shield, Award, CheckCircle, Search } from "lucide-react";
import { useState } from "react";

const HowItWorks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const acceptedItems = {
    "Smartphones & Tablets": ["iPhone", "Android phones", "iPads", "Tablets", "Smart watches"],
    "Laptops & Computers": ["Laptops", "Desktop computers", "Monitors", "Keyboards", "Mice"],
    "Printers & Scanners": ["Inkjet printers", "Laser printers", "Scanners", "Copiers"],
    "Gaming Consoles": ["PlayStation", "Xbox", "Nintendo", "Gaming controllers"],
    "Smart TVs & Monitors": ["LED TVs", "LCD TVs", "Computer monitors", "Smart displays"],
    "Home Appliances": ["Microwaves", "Toasters", "Coffee makers", "Blenders"],
    "Cables & Accessories": ["USB cables", "Power adapters", "Headphones", "Chargers"]
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    let found = false;
    
    for (const [category, items] of Object.entries(acceptedItems)) {
      for (const item of items) {
        if (item.toLowerCase().includes(query) || query.includes(item.toLowerCase())) {
          setSearchResult(`Yes! We accept ${item} under ${category}.`);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    
    if (!found) {
      setSearchResult("We currently do not accept this item. Please contact us for more information.");
    }
  };

  const steps = [
    {
      step: "01",
      icon: Calendar,
      title: "Register",
      description: "Create your account and join our community of responsible recyclers.",
      details: "Sign up with your basic information and choose your user type. Get instant access to our pickup scheduling system."
    },
    {
      step: "02", 
      icon: Truck,
      title: "Request Pickup",
      description: "Schedule a convenient time for our certified team to collect your e-waste.",
      details: "Use our online form to request pickup. Choose your preferred date and time slot. Our team will confirm your appointment."
    },
    {
      step: "03",
      icon: Shield,
      title: "Prepare",
      description: "Get your devices ready following our preparation guidelines.",
      details: "Back up your data, remove personal information, and package items safely. We'll provide detailed preparation instructions."
    },
    {
      step: "04",
      icon: Award,
      title: "Recycling",
      description: "We handle secure data destruction and responsible recycling.",
      details: "Receive certificates for data destruction and recycling. Track your environmental impact through detailed reports."
    }
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
                How It <span className="gradient-text">Works</span>
              </h1>
              <p className="text-xl text-foreground-subtle mb-8">
                Our simple 4-step process ensures your e-waste is handled responsibly 
                with complete transparency and maximum environmental impact.
              </p>
              <Link to="/join">
                <Button variant="cta" size="lg">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={step.step} className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground-muted mb-2">{step.step}</div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-foreground-subtle mb-4">{step.description}</p>
                    <p className="text-sm text-foreground-muted">{step.details}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Search Accepted Items</h2>
              <p className="text-foreground-subtle mb-8">
                Not sure if we accept your item? Search our database to find out!
              </p>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="e.g., iPhone, laptop, printer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="secondary">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
              
              {searchResult && (
                <Card className="p-4 mt-4">
                  <p className="text-foreground">{searchResult}</p>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Accepted Items */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">What Items We Accept</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(acceptedItems).map(([category, items]) => (
                <Card key={category} className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{category}</h3>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-foreground-subtle">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recycling Reports */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Recycling Reports You Can Rely On</h2>
              <p className="text-lg text-foreground-subtle">
                We provide detailed documentation with every e-waste pickup, helping your business 
                stay compliant, transparent, and eco-conscious.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Certificate of Recycling",
                  description: "Proof that your materials were responsibly processed in accordance with regulations."
                },
                {
                  title: "Data Destruction Certificate", 
                  description: "Confirms secure erasure or shredding of data-bearing devices."
                },
                {
                  title: "Asset Tracking Report",
                  description: "Itemized list with serial numbers and descriptions of every item collected."
                },
                {
                  title: "Weight Summary",
                  description: "Breakdown of total materials collected, categorized by type."
                },
                {
                  title: "Environmental Impact Report",
                  description: "See your positive impact in emissions saved and waste diverted from landfills."
                },
                {
                  title: "Chain of Custody",
                  description: "A full record of how your e-waste was handled from pickup to final processing."
                }
              ].map((report, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{report.title}</h3>
                  <p className="text-foreground-subtle">{report.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;