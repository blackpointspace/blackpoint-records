import { useState, useEffect } from "react";
import { Users, Search, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PLAN_OPTIONS = ["Orbit", "Nebula", "Dark Orbit", "Void", "Singularity"];

interface ArtistRow {
  user_id: string;
  name: string;
  avatar_url: string | null;
  plan: string;
  biography: string | null;
  created_at: string;
}

const AdminArtists = () => {
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editArtist, setEditArtist] = useState<ArtistRow | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const { toast } = useToast();

  const fetchArtists = async () => {
    const { data } = await supabase.from("profiles").select("user_id, name, avatar_url, plan, biography, created_at").order("created_at", { ascending: false });
    setArtists((data || []) as ArtistRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchArtists(); }, []);

  const handleSavePlan = async () => {
    if (!editArtist) return;
    const { error } = await supabase.from("profiles").update({ plan: editPlan }).eq("user_id", editArtist.user_id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plano atualizado!" });
      setEditArtist(null);
      fetchArtists();
    }
  };

  const filtered = artists.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="font-display text-2xl font-bold text-foreground">Artistas</h1>
          <p className="text-muted-foreground text-sm">{artists.length} artistas cadastrados</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar artista..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted border-border" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">Nenhum artista encontrado.</p>
        ) : (
          filtered.map((a) => (
            <Card key={a.user_id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {a.avatar_url ? (
                      <img src={a.avatar_url} alt={a.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">Desde {new Date(a.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-primary/30 text-primary">{a.plan || "Orbit"}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => { setEditArtist(a); setEditPlan(a.plan || "Orbit"); }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editArtist} onOpenChange={(o) => !o && setEditArtist(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">Editar Plano - {editArtist?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Plano</Label>
              <Select value={editPlan} onValueChange={setEditPlan}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full gradient-purple text-primary-foreground border-0" onClick={handleSavePlan}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArtists;
