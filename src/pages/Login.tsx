import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, role } = useAuth();

  // Redirect if already logged in
  if (user && role) {
    navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
        // Role-based redirect happens after auth state updates
        const checkRole = async () => {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id).single();
            navigate(roleData?.role === "admin" ? "/admin" : "/dashboard");
          }
        };
        checkRole();
      }
    } else {
      if (password.length < 6) {
        toast({ title: "Erro", description: "A senha deve ter no mínimo 6 caracteres.", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Conta criada!", description: "Verifique seu email para confirmar a conta." });
      }
    }
    setLoading(false);
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
                <Input id="name" placeholder="Seu nome artístico" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-muted border-border" required={!isLogin} />
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

            <Button type="submit" className="w-full gradient-purple text-primary-foreground border-0" disabled={loading}>
              {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
