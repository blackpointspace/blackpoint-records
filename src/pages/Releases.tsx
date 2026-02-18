import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Music, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig: Record<string, { label: string; variant: "outline" | "default" | "secondary" }> = {
  draft: { label: "Rascunho", variant: "outline" },
  pending: { label: "Pendente", variant: "secondary" },
  approved: { label: "Aprovado", variant: "secondary" },
  rejected: { label: "Rejeitado", variant: "outline" },
  published: { label: "Publicado", variant: "default" },
};

interface Release {
  id: string;
  title: string;
  type: string;
  cover_art_url: string | null;
  release_date: string | null;
  status: string;
  created_at: string;
}

const Releases = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchReleases = async () => {
      const { data } = await supabase
        .from("releases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setReleases(data || []);
      setLoading(false);
    };
    fetchReleases();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {releases.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-1">Nenhum lançamento ainda</p>
            <p className="text-sm text-muted-foreground mb-4">Crie seu primeiro lançamento para começar a distribuir.</p>
            <Button className="gradient-purple text-primary-foreground border-0" asChild>
              <Link to="/dashboard/releases/new"><Plus className="w-4 h-4 mr-2" /> Novo Lançamento</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {releases.map((r) => {
            const cfg = statusConfig[r.status] || statusConfig.draft;
            return (
              <Card key={r.id} className="bg-card border-border overflow-hidden hover:border-primary/30 transition-colors">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {r.cover_art_url ? (
                        <img src={r.cover_art_url} alt={r.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-foreground truncate">{r.title}</h3>
                        <Badge variant={cfg.variant} className={r.status === "published" ? "gradient-purple text-primary-foreground border-0" : ""}>
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize mt-1">{r.type}</p>
                      {r.release_date && (
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.release_date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Releases;
