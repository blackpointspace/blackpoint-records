import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect based on email
    if (email.includes("admin")) {
      toast({ title: "Bem-vindo, Admin!", description: "Redirecionando para o painel administrativo." });
      navigate("/admin");
    } else {
      toast({ title: "Bem-vindo!", description: "Redirecionando para seu dashboard." });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">Black Point</span>
        </Link>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex rounded-lg border border-border bg-muted p-1 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isLogin ? "gradient-purple text-primary-foreground" : "text-muted-foreground"}`}>
              Entrar
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isLogin ? "gradient-purple text-primary-foreground" : "text-muted-foreground"}`}>
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-foreground">Nome Artístico</Label>
                <Input id="name" placeholder="Seu nome artístico" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-muted border-border" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 bg-muted border-border" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted border-border pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-purple text-primary-foreground border-0">
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          {isLogin && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              <span className="text-primary cursor-pointer hover:underline">Esqueceu a senha?</span>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo: use <span className="text-primary">admin@blackpoint.space</span> para admin ou qualquer email para artista
        </p>
      </div>
    </div>
  );
};

export default Login;
