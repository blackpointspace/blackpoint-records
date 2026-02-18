import { useState, useEffect } from "react";
import { BarChart3, Disc3, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PLATFORM_COLORS: Record<string, string> = {
  Spotify: "hsl(141, 73%, 42%)",
  "Apple Music": "hsl(0, 0%, 60%)",
  "YouTube Music": "hsl(0, 100%, 50%)",
  Deezer: "hsl(270, 70%, 55%)",
};
const DEFAULT_COLOR = "hsl(40, 80%, 55%)";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ streams: 0, downloads: 0, pendingRoy: 0, releases: 0 });
  const [streamsByDate, setStreamsByDate] = useState<{ date: string; streams: number; downloads: number }[]>([]);
  const [platformData, setPlatformData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      // Get user's releases
      const { data: releases } = await supabase.from("releases").select("id").eq("user_id", user.id);
      const releaseIds = (releases || []).map(r => r.id);

      // Get tracks for those releases
      let trackIds: string[] = [];
      if (releaseIds.length > 0) {
        const { data: tracks } = await supabase.from("tracks").select("id").in("release_id", releaseIds);
        trackIds = (tracks || []).map(t => t.id);
      }

      // Get streams for those tracks
      let streamsData: any[] = [];
      if (trackIds.length > 0) {
        const { data } = await supabase.from("streams").select("*").in("track_id", trackIds);
        streamsData = data || [];
      }

      // Get royalties
      const { data: royalties } = await supabase.from("royalties").select("*").eq("user_id", user.id);

      const totalStreams = streamsData.reduce((sum, s) => sum + (s.streams || 0), 0);
      const totalDownloads = streamsData.reduce((sum, s) => sum + (s.downloads || 0), 0);
      const pendingRoy = (royalties || []).filter(r => r.status === "pending").reduce((sum, r) => sum + Number(r.amount), 0);

      setStats({ streams: totalStreams, downloads: totalDownloads, pendingRoy, releases: releaseIds.length });

      // Streams by date
      const dateMap: Record<string, { streams: number; downloads: number }> = {};
      streamsData.forEach(s => {
        if (!dateMap[s.date]) dateMap[s.date] = { streams: 0, downloads: 0 };
        dateMap[s.date].streams += s.streams || 0;
        dateMap[s.date].downloads += s.downloads || 0;
      });
      setStreamsByDate(
        Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b)).slice(-30).map(([date, v]) => ({ date, ...v }))
      );

      // Platform data
      const platMap: Record<string, number> = {};
      streamsData.forEach(s => { platMap[s.platform] = (platMap[s.platform] || 0) + (s.streams || 0); });
      const total = Object.values(platMap).reduce((a, b) => a + b, 0) || 1;
      setPlatformData(
        Object.entries(platMap).map(([name, value]) => ({ name, value: Math.round(value / total * 100), color: PLATFORM_COLORS[name] || DEFAULT_COLOR }))
      );

      setLoading(false);
    };
    fetchAll();
  }, [user]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Streams Totais", value: formatNumber(stats.streams), icon: BarChart3 },
    { label: "Downloads", value: formatNumber(stats.downloads), icon: TrendingUp },
    { label: "Royalties Pendentes", value: `R$ ${stats.pendingRoy.toFixed(2).replace(".", ",")}`, icon: DollarSign },
    { label: "Lançamentos", value: stats.releases.toString(), icon: Disc3 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta! Aqui está o resumo da sua performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Streams & Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            {streamsByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={streamsByDate}>
                  <defs>
                    <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 16%)" />
                  <XAxis dataKey="date" stroke="hsl(270, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(270, 10%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} />
                  <Area type="monotone" dataKey="streams" stroke="hsl(270, 70%, 55%)" fill="url(#streamGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="downloads" stroke="hsl(290, 60%, 50%)" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-12">Nenhum dado de stream ainda. Publique lançamentos para ver suas métricas aqui.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Por Plataforma</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {platformData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={platformData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {platformData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 w-full mt-2">
                  {platformData.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-muted-foreground">{p.name}</span>
                      </div>
                      <span className="text-foreground font-medium">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm py-8">Sem dados de plataforma.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
