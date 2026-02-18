import { BarChart3, Disc3, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockStreamsData, mockPlatformData } from "@/lib/mock-data";

const stats = [
  { label: "Streams Totais", value: "241.2K", icon: BarChart3, change: "+12%" },
  { label: "Downloads", value: "4.8K", icon: TrendingUp, change: "+8%" },
  { label: "Royalties Pendentes", value: "R$ 855,30", icon: DollarSign, change: "+23%" },
  { label: "Lançamentos", value: "4", icon: Disc3, change: "+1" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta! Aqui está o resumo da sua performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-success font-medium">{s.change}</span>
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
            <CardTitle className="font-display text-foreground">Streams & Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockStreamsData}>
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
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Por Plataforma</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={mockPlatformData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {mockPlatformData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(270, 40%, 8%)", border: "1px solid hsl(270, 20%, 16%)", borderRadius: "8px", color: "hsl(270, 10%, 95%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 w-full mt-2">
              {mockPlatformData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted-foreground">{p.name}</span>
                  </div>
                  <span className="text-foreground font-medium">{p.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
