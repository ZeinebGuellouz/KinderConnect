import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import News from "./pages/News";
import Requests from "./pages/Requests";
import Contact from "./pages/Contact";
import TestAuth from "./pages/TestAuth";
import AdminPanel from "./pages/AdminPanel";
import CreateDemoEvents from "./pages/CreateDemoEvents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Removed automatic redirect - allow users to access homepage even when authenticated

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test-auth" element={<TestAuth />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/demo-events" element={<CreateDemoEvents />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
