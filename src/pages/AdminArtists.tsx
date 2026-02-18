import { useState, useEffect } from "react";
import { Users, Search, Edit2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface ReleaseRow {
  id: string;
  title: string;
  type: string;
  status: string;
  release_date: string | null;
}

const AdminArtists = () => {
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editArtist, setEditArtist] = useState<ArtistRow | null>(null);
  const [editForm, setEditForm] = useState({ name: "", plan: "" });
  const [viewArtist, setViewArtist] = useState<ArtistRow | null>(null);
  const [artistReleases, setArtistReleases] = useState<ReleaseRow[]>([]);
  const { toast } = useToast();

  const fetchArtists = async () => {
    const { data } = await supabase.from("profiles").select("user_id, name, avatar_url, plan, biography, created_at").order("created_at", { ascending: false });
    setArtists((data || []) as ArtistRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchArtists(); }, []);

  const handleEdit = (a: ArtistRow) => {
    setEditArtist(a);
    setEditForm({ name: a.name, plan: a.plan || "Orbit" });
  };

  const handleSave = async () => {
    if (!editArtist) return;
    const { error } = await supabase.from("profiles").update({ name: editForm.name, plan: editForm.plan }).eq("user_id", editArtist.user_id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
      setEditArtist(null);
      fetchArtists();
    }
  };

  const handleView = async (a: ArtistRow) => {
    setViewArtist(a);
    const { data } = await supabase.from("releases").select("id, title, type, status, release_date").eq("user_id", a.user_id).order("created_at", { ascending: false });
    setArtistReleases(data || []);
  };

  const filtered = artists.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const statusLabels: Record<string, string> = { draft: "Rascunho", pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado", published: "Publicado" };

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
          <h1 className="font-display text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground text-sm">{artists.length} clientes cadastrados</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted border-border" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">Nenhum cliente encontrado.</p>
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
                  <Button variant="ghost" size="sm" onClick={() => handleView(a)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(a)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editArtist} onOpenChange={(o) => !o && setEditArtist(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">Editar Cliente - {editArtist?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Nome</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1 bg-muted border-border" />
            </div>
            <div>
              <Label className="text-foreground">Plano</Label>
              <Select value={editForm.plan} onValueChange={(v) => setEditForm({ ...editForm, plan: v })}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full gradient-purple text-primary-foreground border-0" onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewArtist} onOpenChange={(o) => !o && setViewArtist(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">{viewArtist?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="info">
            <TabsList className="bg-muted">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="releases">Lançamentos</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Plano:</span> <span className="text-foreground font-medium ml-1">{viewArtist?.plan || "Orbit"}</span></div>
                <div><span className="text-muted-foreground">Desde:</span> <span className="text-foreground font-medium ml-1">{viewArtist?.created_at ? new Date(viewArtist.created_at).toLocaleDateString("pt-BR") : ""}</span></div>
              </div>
              {viewArtist?.biography && <p className="text-sm text-muted-foreground">{viewArtist.biography}</p>}
            </TabsContent>
            <TabsContent value="releases" className="mt-4">
              {artistReleases.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum lançamento.</p>
              ) : (
                <div className="space-y-2">
                  {artistReleases.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.type} • {r.release_date || "Sem data"}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{statusLabels[r.status] || r.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArtists;
