import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminImport = () => {
  const { toast } = useToast();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Importar Streams</h1>
        <p className="text-muted-foreground text-sm">Faça upload de relatórios CSV de plataformas de distribuição.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Upload CSV</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-foreground font-medium mb-1">Arraste o arquivo CSV aqui</p>
            <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground">Formato esperado: track_title, platform, streams, date</p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="gradient-purple text-primary-foreground border-0" onClick={() => toast({ title: "Importação concluída!", description: "347 registros importados com sucesso." })}>
              Importar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImport;
