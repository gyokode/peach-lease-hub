import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import BrowseAds from "./pages/BrowseAds";
import AdDetail from "./pages/AdDetail";
import PostAd from "./pages/PostAd";
import Auth from "./pages/Auth";
import ContactSupport from "./pages/ContactSupport";
import OurStory from "./pages/OurStory";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowseAds />} />
                <Route path="/ad/:id" element={<AdDetail />} />
                <Route path="/post" element={<PostAd />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/support" element={<ContactSupport />} />
                <Route path="/story" element={<OurStory />} />
                <Route path="/guidelines" element={<CommunityGuidelines />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
