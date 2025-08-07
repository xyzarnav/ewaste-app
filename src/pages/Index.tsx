import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhoWeServeSection from "@/components/WhoWeServeSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <WhoWeServeSection />
        <HowItWorksSection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
