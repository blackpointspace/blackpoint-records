import { Music } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Black Point</span>
          </Link>
          <p className="text-sm text-muted-foreground">Distribua sua música para mais de 150 plataformas digitais no mundo todo.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Produto</h4>
          <div className="space-y-2">
            <Link to="/precos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</Link>
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
            <a href="#platforms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Plataformas</a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Suporte</h4>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Central de Ajuda</a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Legal</h4>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
        © 2025 Black Point Space Music Distribution. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
