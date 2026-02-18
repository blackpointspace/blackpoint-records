import { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SaleRow {
  id: string;
  user_id: string;
  month: string;
  amount: number;
  status: string;
}

const AdminSales = () => {
  const [royalties, setRoyalties] = useState<SaleRow[]>([]);
  const [artists, setArtists] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [rRes, aRes] = await Promise.all([
        supabase.from("royalties").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, name"),
      ]);
      setRoyalties(rRes.data || []);
      const map: Record<string, string> = {};
      (aRes.data || []).forEach((a: any) => { map[a.user_id] = a.name; });
      setArtists(map);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = royalties.filter(r => {
    const name = artists[r.user_id] || "";
    return name.toLowerCase().includes(search.toLowerCase()) || r.month.includes(search);
  });

  const totalSales = filtered.reduce((s, r) => s + Number(r.amount), 0);

  const statusLabels: Record<string, string> = { pending: "Pendente", available: "Disponível", paid: "Pago" };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Sales</h1>
          <p className="text-muted-foreground text-sm">Total: R$ {totalSales.toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted border-border" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhuma venda encontrada.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <Card key={r.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{artists[r.user_id] || "—"}</p>
                    <p className="text-xs text-muted-foreground">{r.month}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display font-semibold text-foreground">R$ {Number(r.amount).toFixed(2).replace(".", ",")}</span>
                  <Badge variant="outline">{statusLabels[r.status] || r.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSales;
