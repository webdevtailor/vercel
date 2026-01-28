/* VERSION: 3.1 
   UPDATES: Merged professional Shell structure with Vercel-ready routing.
   TARGET: GitHub src/App.tsx (Vercel Project)
*/

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// This sets up the "Cache" so your app is fast
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* These are the pop-up notifications (Toasters) you wanted */}
      <Toaster />
      <Sonner />
      
      <BrowserRouter>
        <Routes>
          {/* This is your beautiful Calendar Page with the working Save button */}
          <Route path="/" element={<Index />} />
          
          {/* This catches any wrong URLs and shows a 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
