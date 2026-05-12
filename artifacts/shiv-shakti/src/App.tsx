import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BrandPage from "@/pages/BrandPage";
import ProductPage from "@/pages/ProductPage";
import AdminPage from "@/pages/AdminPage";
import StockPage from "@/pages/StockPage";
import BlogListPage from "@/pages/BlogListPage";
import BlogPostPage from "@/pages/BlogPostPage";
import SearchPage from "@/pages/SearchPage";
import FindMyPartPage from "@/pages/FindMyPartPage";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import LedgerPage from "@/pages/LedgerPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/brands/:slug" component={BrandPage} />
      <Route path="/products/:slug" component={ProductPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/find-my-part" component={FindMyPartPage} />
      <Route path="/blog" component={BlogListPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/stock" component={StockPage} />
      <Route path="/ledger" component={LedgerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <FloatingWhatsApp />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
