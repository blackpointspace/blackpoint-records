import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendente", class: "bg-warning/10 text-warning border-warning/20" },
  available: { label: "Disponível", class: "gradient-purple text-primary-foreground border-0" },
  paid: { label: "Pago", class: "bg-success/10 text-success border-success/20" },
};

interface Royalty {
  id: string;
  month: string;
  amount: number;
  status: string;
}

const Royalties = () => {
  const [royalties, setRoyalties] = useState<Royalty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("royalties")
        .select("*")
        .eq("user_id", user.id)
        .order("month", { ascending: false });
      setRoyalties(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalPending = royalties.filter((r) => r.status === "pending").reduce((a, b) => a + Number(b.amount), 0);
  const totalAvailable = royalties.filter((r) => r.status === "available").reduce((a, b) => a + Number(b.amount), 0);
  const totalPaid = royalties.filter((r) => r.status === "paid").reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Royalties</h1>
        <p className="text-muted-foreground text-sm">Acompanhe seus ganhos e pagamentos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pendente", value: totalPending, color: "text-warning" },
          { label: "Disponível", value: totalAvailable, color: "text-primary" },
          { label: "Pago", value: totalPaid, color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-2xl font-display font-bold ${s.color}`}>
                R$ {s.value.toFixed(2).replace(".", ",")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Histórico</CardTitle></CardHeader>
        <CardContent>
          {royalties.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhum royalty registrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {royalties.map((r) => {
                const cfg = statusConfig[r.status] || statusConfig.pending;
                return (
                  <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.month}</p>
                        <p className="text-xs text-muted-foreground">Royalties mensais</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-foreground font-display font-semibold">R$ {Number(r.amount).toFixed(2).replace(".", ",")}</span>
                      <Badge className={cfg.class}>{cfg.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Royalties;
