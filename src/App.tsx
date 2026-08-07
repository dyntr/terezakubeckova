import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Gdpr from "./pages/Gdpr";
import Cookies from "./pages/Cookies";
import LepsiZivot from "./pages/LepsiZivot";
import LepsiZivotDekujeme from "./pages/LepsiZivotDekujeme";
import BytProDite from "./pages/BytProDite";
import RStop from "./pages/RStop";
import RStopVysledek from "./pages/RStopVysledek";
import PotvrzeniEmail from "./pages/PotvrzeniEmail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gdpr" element={<Gdpr />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/lepsi-zivot" element={<LepsiZivot />} />
          <Route path="/lepsi-zivot-dekujeme" element={<LepsiZivotDekujeme />} />
          <Route path="/byt-pro-dite" element={<BytProDite />} />
          <Route path="/r-stop" element={<RStop />} />
          <Route path="/r-stop-vysledek" element={<RStopVysledek />} />
          <Route path="/potvrzeni" element={<PotvrzeniEmail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
