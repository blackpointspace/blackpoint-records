import { useState, useEffect } from "react";
import { Users, Package, DollarSign, Store, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface AdminStats {
  totalArtists: number;
  totalReleases: number;
  totalStreams: number;
  totalRoyalties: number;
  pendingReleases: number;
}

interface ArtistRow {
  user_id: string;
  name: string;
  avatar_url: string | null;
  plan: string;
}

const CHART_COLORS = [
  "hsl(270, 70%, 55%)", "hsl(290, 60%, 50%)", "hsl(250, 65%, 60%)",
  "hsl(310, 55%, 45%)", "hsl(230, 60%, 55%)",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({ totalArtists: 0, totalReleases: 0, totalStreams: 0, totalRoyalties: 0, pendingReleases: 0 });
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [search, setSearch] = useState("");
  const [streamsByDate, setStreamsByDate] = useState<{ date: string; streams: number }[]>([]);
  const [streamsByPlatform, setStreamsByPlatform] = useState<{ name: string; value: number; color: string }[]>([]);
  const [royaltiesByMonth, setRoyaltiesByMonth] = useState<{ month: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [artistsRes, releasesRes, streamsRes, royaltiesRes, platformRes, monthlyRoyRes, pendingRes] = await Promise.all([
        supabase.from("profiles").select("user_id, name, avatar_url, plan"),
        supabase.from("releases").select("id", { count: "exact", head: true }),
        supabase.from("streams").select("streams, date, platform"),
        supabase.from("royalties").select("amount"),
        supabase.from("streams").select("platform, streams"),
        supabase.from("royalties").select("month, amount"),
        supabase.from("releases").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      const artistList = (artistsRes.data || []) as ArtistRow[];
      setArtists(artistList);

      const totalStreams = (streamsRes.data || []).reduce((sum, s) => sum + (s.streams || 0), 0);
      const totalRoy = (royaltiesRes.data || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);

      setStats({
        totalArtists: artistList.length,
        totalReleases: releasesRes.count || 0,
        totalStreams,
        totalRoyalties: totalRoy,
        pendingReleases: pendingRes.count || 0,
      });

      const dateMap: Record<string, number> = {};
      (streamsRes.data || []).forEach((s) => {
        const d = s.date;
        dateMap[d] = (dateMap[d] || 0) + (s.streams || 0);
      });
      setStreamsByDate(
        Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b)).slice(-30).map(([date, streams]) => ({ date, streams }))
      );

      const platMap: Record<string, number> = {};
      (platformRes.data || []).forEach((s) => {
        platMap[s.platform] = (platMap[s.platform] || 0) + (s.streams || 0);
      });
      setStreamsByPlatform(
        Object.entries(platMap).map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }))
      );

      const monthMap: Record<string, number> = {};
      (monthlyRoyRes.data || []).forEach((r) => {
        monthMap[r.month] = (monthMap[r.month] || 0) + Number(r.amount || 0);
      });
      setRoyaltiesByMonth(
        Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([month, amount]) => ({ month, amount }))
      );

      setLoading(false);
    };
    fetchAll();
  }, []);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  };

  const filteredArtists = artists.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  const statCards = [
    { label: "Clientes", value: formatNumber(stats.totalArtists), icon: Users, bg: "bg-blue-500/15", iconColor: "text-blue-400", border: "border-blue-500/20" },
    { label: "Lançamentos", value: formatNumber(stats.totalReleases), icon: Package, bg: "bg-emerald-500/15", iconColor: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Vendas (Streams)", value: formatNumber(stats.totalStreams), icon: DollarSign, bg: "bg-sky-500/15", iconColor: "text-sky-400", border: "border-sky-500/20" },
    { label: "Royalties Pagos", value: `R$ ${formatNumber(stats.totalRoyalties)}`, icon: Store, bg: "bg-amber-500/15", iconColor: "text-amber-400", border: "border-amber-500/20" },
    { label: "Pendentes", value: formatNumber(stats.pendingReleases), icon: Clock, bg: "bg-red-500/15", iconColor: "text-red-400", border: "border-red-500/20" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Painel Admin</h1>
        <p className="text-muted-foreground text-sm">Visão geral da plataforma.</p>
      </div>

      {/* Colored Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className={`border ${s.border} bg-card`}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Streams (últimos 30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={streamsByDate}>
                <defs>
                  <linearGradient id="adminStreamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 16%)" />
                <XAxis dataKey="date" stroke="hsl(270, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(270, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} />
                <Area type="monotone" dataKey="streams" stroke="hsl(270, 70%, 55%)" fill="url(#adminStreamGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Por Plataforma</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {streamsByPlatform.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={streamsByPlatform} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {streamsByPlatform.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 w-full mt-2">
                  {streamsByPlatform.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-muted-foreground">{p.name}</span>
                      </div>
                      <span className="text-foreground font-medium">{formatNumber(p.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm py-8">Nenhum dado de stream ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Month */}
      {royaltiesByMonth.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={royaltiesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 16%)" />
                <XAxis dataKey="month" stroke="hsl(270, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(270, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Receita"]} />
                <Bar dataKey="amount" fill="hsl(270, 70%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Artists List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-foreground">Artistas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar artista..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted border-border" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredArtists.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Nenhum artista encontrado.</p>
            ) : (
              filteredArtists.map((a) => (
                <div key={a.user_id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {a.avatar_url ? (
                        <img src={a.avatar_url} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">Plano: {a.plan || "Orbit"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Ver</Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
