import { useState, useEffect } from "react";
import { Upload, Headphones, Megaphone, ArrowRight, Gift, CreditCard, TrendingUp, Newspaper } from "lucide-react";
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
      const { data: prof } = await supabase.from("profiles").select("plan").eq("user_id", user.id).single();
      if (prof) setPlan(prof.plan);

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
    },
    {
      icon: Headphones,
      title: "Masterização Instantânea",
      description: "Masterize suas faixas com IA de ponta em segundos, pronto para streaming.",
      cta: "Masterize minha faixa",
      to: "/dashboard/releases",
    },
    {
      icon: Megaphone,
      title: "Promoção de Marca e Lançamento",
      description: "Impulsione seu lançamento com ferramentas de marketing e promoção exclusivas.",
      cta: "Explorar o Artist Hub",
      to: "/dashboard/releases",
    },
  ];

  const newsCards = [
    { title: "Como entrar nas playlists do Spotify", tag: "Dica", desc: "Descubra as melhores estratégias para conseguir playlisting editorial." },
    { title: "Novos recursos de promoção disponíveis", tag: "Novidade", desc: "Conheça as ferramentas do Artist Hub para impulsionar lançamentos." },
    { title: "Aumente seus streams com estratégias testadas", tag: "Guia", desc: "Aprenda táticas comprovadas por artistas independentes de sucesso." },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Bem-vindo, {profile?.name || "Artista"}!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie sua música e acompanhe sua performance.</p>
      </div>

      {/* Service Cards — large prominent cards like Behance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {serviceCards.map((card) => (
          <Card key={card.title} className="bg-card border-border overflow-hidden group hover:border-primary/40 transition-all relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col h-full relative">
              <div className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center mb-5 shadow-lg group-hover:glow-purple transition-all">
                <card.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-5 leading-relaxed">{card.description}</p>
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
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Plano Atual</p>
            <p className="text-3xl font-display font-bold gradient-purple-text">{plan}</p>
            <Link to="/dashboard/profile">
              <Button variant="link" className="text-primary p-0 mt-3 text-xs h-auto">
                Gerenciar plano →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[hsl(var(--success))]/10 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Indique artistas e ganhe</p>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">Compartilhe seu link de indicação e ganhe créditos para cada artista que se cadastrar.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Seus Créditos</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-2xl font-display font-bold text-foreground">R$ 0,00</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Promocionais</p>
                <p className="text-2xl font-display font-bold text-[hsl(var(--success))]">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streams Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="font-display text-foreground text-lg">Streams</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">Últimos 30 dias — Total: {totalStreams.toLocaleString("pt-BR")}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          {streamsByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={streamsByDate}>
                <defs>
                  <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="streams" stroke="hsl(270, 70%, 55%)" fill="url(#streamGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-16">Nenhum stream registrado ainda. Publique lançamentos para acompanhar aqui.</p>
          )}
        </CardContent>
      </Card>

      {/* News */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Newspaper className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">News</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsCards.map((n) => (
            <Card key={n.title} className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group">
              <CardContent className="p-5">
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">{n.tag}</span>
                <p className="text-foreground font-medium text-sm mt-2 mb-1">{n.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{n.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
