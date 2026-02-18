import { Search, Check, X, Eye, Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockReleases } from "@/lib/mock-data";

const AdminReleases = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Lançamentos</h1>
          <p className="text-muted-foreground text-sm">Aprove ou rejeite lançamentos dos artistas.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar lançamento..." className="pl-9 bg-muted border-border" />
        </div>
      </div>

      <div className="space-y-3">
        {mockReleases.map((r) => (
          <Card key={r.id} className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                  <Music className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">{r.type} • {r.releaseDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={r.status === "draft" ? "outline" : "default"} className={r.status === "published" ? "gradient-purple text-primary-foreground border-0" : ""}>
                  {r.status === "draft" ? "Rascunho" : r.status === "published" ? "Publicado" : "Aprovado"}
                </Badge>
                {r.status === "draft" && (
                  <>
                    <Button size="sm" variant="ghost" className="text-success"><Check className="w-4 h-4 mr-1" />Aprovar</Button>
                    <Button size="sm" variant="ghost" className="text-destructive"><X className="w-4 h-4 mr-1" />Rejeitar</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReleases;
