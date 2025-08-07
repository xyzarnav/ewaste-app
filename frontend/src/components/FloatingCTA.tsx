import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const FloatingCTA = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link to="/schedule">
        <Button 
          variant="cta" 
          size="lg" 
          className="shadow-2xl hover:shadow-glow rounded-full px-6 py-3"
        >
          <Calendar className="h-5 w-5" />
          Schedule Pickup
        </Button>
      </Link>
    </div>
  );
};

export default FloatingCTA;