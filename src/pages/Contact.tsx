import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Contact <span className="gradient-text">Us</span>
              </h1>
              <p className="text-xl text-foreground-subtle mb-8">
                Have questions about our e-waste recycling services? Ready to schedule a pickup? 
                We're here to help you make a positive environmental impact.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  content: "info@rygneco.com",
                  description: "Send us an email anytime"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  content: "+1 616-794-6326",
                  description: "Mon-Fri 9AM-6PM EST"
                },
                {
                  icon: MapPin,
                  title: "Location",
                  content: "India",
                  description: "Serving major cities across India"
                },
                {
                  icon: Clock,
                  title: "Response Time",
                  content: "24-48 Hours",
                  description: "We respond to all inquiries quickly"
                }
              ].map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex p-3 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-primary font-medium mb-1">{item.content}</p>
                  <p className="text-foreground-subtle text-sm">{item.description}</p>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Send Us A Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="business">Business Partnership</option>
                      <option value="pickup">Schedule Pickup</option>
                      <option value="education">Educational Workshop</option>
                      <option value="support">Customer Support</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" variant="cta" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Additional Information */}
              <div className="space-y-8">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">Quick Questions?</h3>
                  </div>
                  <p className="text-foreground-subtle mb-4">
                    For immediate assistance, check out our FAQ section or contact us directly via WhatsApp.
                  </p>
                  <Button variant="outline" className="w-full">
                    WhatsApp Support
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Business Inquiries</h3>
                  <p className="text-foreground-subtle mb-4">
                    Looking for bulk pickup services or corporate partnerships? We'd love to discuss 
                    custom solutions for your organization.
                  </p>
                  <ul className="space-y-2 text-sm text-foreground-subtle">
                    <li>• Corporate e-waste management</li>
                    <li>• CSR compliance documentation</li>
                    <li>• Employee education programs</li>
                    <li>• Quarterly impact reports</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Educational Partnerships</h3>
                  <p className="text-foreground-subtle mb-4">
                    Interested in bringing e-waste education to your school or community? 
                    We offer workshops and educational resources.
                  </p>
                  <ul className="space-y-2 text-sm text-foreground-subtle">
                    <li>• Interactive workshops</li>
                    <li>• Campus-wide collection drives</li>
                    <li>• Educational materials</li>
                    <li>• Community impact programs</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Hours */}
        <section className="py-20 bg-background-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Service Areas</h2>
              <p className="text-lg text-foreground-subtle mb-12">
                Currently serving major cities across India with plans to expand nationwide.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    region: "North India",
                    cities: ["Delhi", "Gurgaon", "Noida", "Chandigarh"]
                  },
                  {
                    region: "West India", 
                    cities: ["Mumbai", "Pune", "Ahmedabad", "Surat"]
                  },
                  {
                    region: "South India",
                    cities: ["Bangalore", "Chennai", "Hyderabad", "Kochi"]
                  }
                ].map((area, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{area.region}</h3>
                    <ul className="space-y-2">
                      {area.cities.map((city, cityIndex) => (
                        <li key={cityIndex} className="text-foreground-subtle">
                          {city}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>

              <p className="text-foreground-subtle mt-8">
                Don't see your city? Contact us - we're rapidly expanding our service areas!
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;