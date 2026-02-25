import { useState, useEffect } from "react";
import { Upload, Headphones, Megaphone, ArrowRight, Gift, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [streamsByDate, setStreamsByDate] = useState<{ date: string; streams: number }[]>([]);
  const [totalStreams, setTotalStreams] = useState(0);
  const [plan, setPlan] = useState("Orbit");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      // Get plan
      const { data: prof } = await supabase.from("profiles").select("plan").eq("user_id", user.id).single();
      if (prof) setPlan(prof.plan);

      // Get user's releases → tracks → streams
      const { data: releases } = await supabase.from("releases").select("id").eq("user_id", user.id);
      const releaseIds = (releases || []).map(r => r.id);

      let trackIds: string[] = [];
      if (releaseIds.length > 0) {
        const { data: tracks } = await supabase.from("tracks").select("id").in("release_id", releaseIds);
        trackIds = (tracks || []).map(t => t.id);
      }

      let streamsData: any[] = [];
      if (trackIds.length > 0) {
        const { data } = await supabase.from("streams").select("*").in("track_id", trackIds);
        streamsData = data || [];
      }

      const total = streamsData.reduce((sum, s) => sum + (s.streams || 0), 0);
      setTotalStreams(total);

      // Streams by date (last 30)
      const dateMap: Record<string, number> = {};
      streamsData.forEach(s => {
        dateMap[s.date] = (dateMap[s.date] || 0) + (s.streams || 0);
      });
      setStreamsByDate(
        Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b)).slice(-30).map(([date, streams]) => ({ date, streams }))
      );

      setLoading(false);
    };
    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const serviceCards = [
    {
      icon: Upload,
      title: "Subir a Música",
      description: "Distribua suas músicas para mais de 150 plataformas digitais em todo o mundo.",
      cta: "Iniciar meu lançamento",
      to: "/dashboard/releases/new",
      gradient: "from-[hsl(270,70%,55%)] to-[hsl(290,60%,50%)]",
    },
    {
      icon: Headphones,
      title: "Masterização Instantânea",
      description: "Masterize suas faixas com IA de ponta em segundos, pronto para streaming.",
      cta: "Masterize minha faixa",
      to: "/dashboard/releases",
      gradient: "from-[hsl(250,60%,50%)] to-[hsl(270,70%,55%)]",
    },
    {
      icon: Megaphone,
      title: "Promoção de Marca e Lançamento",
      description: "Impulsione seu lançamento com ferramentas de marketing e promoção exclusivas.",
      cta: "Explorar o Artist Hub",
      to: "/dashboard/releases",
      gradient: "from-[hsl(290,60%,50%)] to-[hsl(310,50%,55%)]",
    },
  ];

  const newsCards = [
    { title: "Como entrar nas playlists do Spotify", tag: "Dica" },
    { title: "Novos recursos de promoção disponíveis", tag: "Novidade" },
    { title: "Aumente seus streams com estratégias testadas", tag: "Guia" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Bem-vindo, {profile?.name || "Artista"}!
        </h1>
        <p className="text-muted-foreground text-sm">Gerencie sua música e acompanhe sua performance.</p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {serviceCards.map((card) => (
          <Card key={card.title} className="bg-card border-border overflow-hidden group hover:border-primary/40 transition-all">
            <CardContent className="p-6 flex flex-col h-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <card.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-4">{card.description}</p>
              <Link to={card.to}>
                <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 group-hover:border-primary transition-all">
                  {card.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Plano Atual</p>
            <p className="text-2xl font-display font-bold gradient-purple-text">{plan}</p>
            <Link to="/dashboard/profile">
              <Button variant="link" className="text-primary p-0 mt-2 text-xs h-auto">
                Gerenciar plano →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Indique artistas e ganhe</p>
              <p className="text-muted-foreground text-xs mt-1">Compartilhe seu link de indicação e ganhe créditos para cada artista que se cadastrar.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Seus Créditos</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-xl font-display font-bold text-foreground">R$ 0,00</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Promocionais</p>
                <p className="text-xl font-display font-bold text-[hsl(var(--success))]">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streams Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display text-foreground">Streams</CardTitle>
            <p className="text-muted-foreground text-sm">Últimos 30 dias — Total: {totalStreams.toLocaleString("pt-BR")}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          {streamsByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={streamsByDate}>
                <defs>
                  <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 16%)" />
                <XAxis dataKey="date" stroke="hsl(270, 10%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(270, 10%, 55%)" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} />
                <Area type="monotone" dataKey="streams" stroke="hsl(270, 70%, 55%)" fill="url(#streamGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">Nenhum stream registrado ainda. Publique lançamentos para acompanhar aqui.</p>
          )}
        </CardContent>
      </Card>

      {/* News */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsCards.map((n) => (
            <Card key={n.title} className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-5">
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">{n.tag}</span>
                <p className="text-foreground font-medium text-sm mt-2">{n.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
