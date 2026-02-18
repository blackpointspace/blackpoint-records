import { useState, useEffect } from "react";
import { Search, Check, X, Music, Download, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrackRow {
  id: string;
  title: string;
  track_number: number;
  audio_file_url: string | null;
  isrc: string | null;
}

interface ReleaseRow {
  id: string;
  title: string;
  type: string;
  status: string;
  release_date: string | null;
  cover_art_url: string | null;
  user_id: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  published: "Publicado",
};

const AdminReleases = () => {
  const [releases, setReleases] = useState<ReleaseRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Record<string, TrackRow[]>>({});
  const [artistNames, setArtistNames] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchReleases = async () => {
    const [relRes, profRes] = await Promise.all([
      supabase.from("releases").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, name"),
    ]);
    setReleases(relRes.data || []);
    const names: Record<string, string> = {};
    (profRes.data || []).forEach((p: any) => { names[p.user_id] = p.name; });
    setArtistNames(names);
    setLoading(false);
  };

  useEffect(() => { fetchReleases(); }, []);

  const toggleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!tracks[id]) {
      const { data } = await supabase.from("tracks").select("*").eq("release_id", id).order("track_number");
      setTracks(prev => ({ ...prev, [id]: data || [] }));
    }
  };

  const downloadTrack = async (audioPath: string, trackTitle: string) => {
    const { data, error } = await supabase.storage.from("audio").createSignedUrl(audioPath, 300);
    if (error || !data?.signedUrl) {
      toast({ title: "Erro", description: "Não foi possível gerar link de download.", variant: "destructive" });
      return;
    }
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = trackTitle;
    a.click();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("releases").update({ status: status as any }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Lançamento ${status === "approved" ? "aprovado" : status === "rejected" ? "rejeitado" : "publicado"}!` });
      fetchReleases();
    }
  };

  const filtered = releases.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || (artistNames[r.user_id] || "").toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="font-display text-2xl font-bold text-foreground">Produtos (Lançamentos)</h1>
          <p className="text-muted-foreground text-sm">Aprove, rejeite ou baixe faixas dos lançamentos.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por título ou artista..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted border-border" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhum lançamento encontrado.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className="bg-card border-border">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {r.cover_art_url ? (
                        <img src={r.cover_art_url} alt={r.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{r.title}</h3>
                      <p className="text-xs text-muted-foreground">{artistNames[r.user_id] || "—"} • {r.type} • {r.release_date || "Sem data"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={r.status === "published" ? "default" : "outline"} className={r.status === "published" ? "gradient-purple text-primary-foreground border-0" : ""}>
                      {statusLabels[r.status] || r.status}
                    </Badge>
                    {(r.status === "draft" || r.status === "pending") && (
                      <>
                        <Button size="sm" variant="ghost" className="text-success" onClick={() => updateStatus(r.id, "approved")}>
                          <Check className="w-4 h-4 mr-1" />Aprovar
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateStatus(r.id, "rejected")}>
                          <X className="w-4 h-4 mr-1" />Rejeitar
                        </Button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <Button size="sm" variant="ghost" className="text-primary" onClick={() => updateStatus(r.id, "published")}>
                        Publicar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => toggleExpand(r.id)}>
                      {expandedId === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {expandedId === r.id && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Faixas:</p>
                    {(tracks[r.id] || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhuma faixa cadastrada.</p>
                    ) : (
                      <div className="space-y-2">
                        {(tracks[r.id] || []).map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-2 rounded bg-muted">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground font-mono w-5">{t.track_number}</span>
                              <span className="text-sm text-foreground">{t.title}</span>
                              {t.isrc && <span className="text-xs text-muted-foreground">ISRC: {t.isrc}</span>}
                            </div>
                            {t.audio_file_url && (
                              <Button size="sm" variant="ghost" className="text-primary" onClick={() => downloadTrack(t.audio_file_url!, t.title)}>
                                <Download className="w-4 h-4 mr-1" /> Download
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReleases;
