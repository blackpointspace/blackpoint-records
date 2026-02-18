import { Link, useLocation } from "react-router-dom";
import { Music, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");

  if (isDashboard) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-purple flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">Black Point</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Início</Link>
          <Link to="/precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</Link>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
          <a href="#platforms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Plataformas</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button size="sm" className="gradient-purple text-primary-foreground border-0" asChild>
            <Link to="/login?tab=register">Começar Grátis</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-border p-4 space-y-3">
          <Link to="/" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Início</Link>
          <Link to="/precos" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Preços</Link>
          <Link to="/login" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Entrar</Link>
          <Button size="sm" className="gradient-purple text-primary-foreground border-0 w-full" asChild>
            <Link to="/login?tab=register" onClick={() => setMobileOpen(false)}>Começar Grátis</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
