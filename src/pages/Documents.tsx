import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockDocs = [
  { id: "1", title: "Contrato de Distribuição 2025", date: "2025-01-10" },
  { id: "2", title: "Relatório de Streams - Dezembro 2024", date: "2025-01-15" },
  { id: "3", title: "Recibo de Pagamento - Nov 2024", date: "2024-12-05" },
];

const Documents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Documentos</h1>
        <p className="text-muted-foreground text-sm">Arquivos enviados pela administração.</p>
      </div>

      <div className="space-y-3">
        {mockDocs.map((d) => (
          <Card key={d.id} className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documents;
