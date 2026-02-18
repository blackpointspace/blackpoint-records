import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRoyalties } from "@/lib/mock-data";

const statusConfig = {
  pending: { label: "Pendente", class: "bg-warning/10 text-warning border-warning/20" },
  available: { label: "Disponível", class: "gradient-purple text-primary-foreground border-0" },
  paid: { label: "Pago", class: "bg-success/10 text-success border-success/20" },
};

const Royalties = () => {
  const totalPending = mockRoyalties.filter((r) => r.status === "pending").reduce((a, b) => a + b.amount, 0);
  const totalAvailable = mockRoyalties.filter((r) => r.status === "available").reduce((a, b) => a + b.amount, 0);
  const totalPaid = mockRoyalties.filter((r) => r.status === "paid").reduce((a, b) => a + b.amount, 0);

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
          <div className="space-y-3">
            {mockRoyalties.map((r) => (
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
                  <span className="text-foreground font-display font-semibold">R$ {r.amount.toFixed(2).replace(".", ",")}</span>
                  <Badge className={statusConfig[r.status].class}>{statusConfig[r.status].label}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Royalties;
