import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import JoinUs from "./pages/JoinUs";
import HowItWorks from "./pages/HowItWorks";
import Education from "./pages/Education";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import LoginPage from "@/auth/pages/LoginPage";
import RegisterPage from "@/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/auth/pages/ForgotPasswordPage";
import ClientDashboard from "@/auth/pages/ClientDashboard";
import AdminDashboard from "@/auth/pages/AdminDashboard";
import ManageClients from "@/admin/pages/ManageClients";
import RegisterContact from "@/admin/pages/RegisterContact";
import AdminClientDashboard from "@/admin/pages/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Admin feature routes */}
          <Route path="/admin/manage-clients" element={<ManageClients />} />
          <Route path="/admin/register-contact" element={<RegisterContact />} />
          <Route path="/admin/client-dashboard" element={<AdminClientDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
