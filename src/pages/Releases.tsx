import { Link } from "react-router-dom";
import { Plus, Music, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockReleases } from "@/lib/mock-data";

const statusConfig = {
  draft: { label: "Rascunho", variant: "outline" as const },
  published: { label: "Publicado", variant: "default" as const },
  approved: { label: "Aprovado", variant: "secondary" as const },
};

const Releases = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Lançamentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus singles e álbuns.</p>
        </div>
        <Button className="gradient-purple text-primary-foreground border-0" asChild>
          <Link to="/dashboard/releases/new">
            <Plus className="w-4 h-4 mr-2" /> Novo Lançamento
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockReleases.map((r) => (
          <Card key={r.id} className="bg-card border-border overflow-hidden hover:border-primary/30 transition-colors">
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-foreground truncate">{r.title}</h3>
                    <Badge variant={statusConfig[r.status].variant} className={r.status === "published" ? "gradient-purple text-primary-foreground border-0" : ""}>
                      {statusConfig[r.status].label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize mt-1">{r.type}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.releaseDate}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{r.streams.toLocaleString()} streams</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Releases;
