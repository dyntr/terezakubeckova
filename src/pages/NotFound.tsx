import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-heading font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Stránka nenalezena</p>
          <a href="/" className="text-accent font-medium hover:underline transition-colors">
            Zpět na hlavní stránku
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
