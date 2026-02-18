import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Music, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TrackData {
  title: string;
  isrc: string;
  file: File | null;
  uploading: boolean;
  progress: number;
}

const NewRelease = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("single");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackData[]>([{ title: "", isrc: "", file: null, uploading: false, progress: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const addTrack = () => setTracks([...tracks, { title: "", isrc: "", file: null, uploading: false, progress: 0 }]);
  const removeTrack = (i: number) => setTracks(tracks.filter((_, idx) => idx !== i));

  const updateTrack = (i: number, field: keyof TrackData, value: any) => {
    setTracks(tracks.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAudioSelect = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["mp3", "wav"].includes(ext || "")) {
        toast({ title: "Formato inválido", description: "Apenas MP3 e WAV são aceitos.", variant: "destructive" });
        return;
      }
      updateTrack(i, "file", file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (type === "album" && tracks.length < 2) {
      toast({ title: "Erro", description: "Álbuns precisam de no mínimo 2 faixas.", variant: "destructive" });
      return;
    }
    if (tracks.some((t) => !t.title)) {
      toast({ title: "Erro", description: "Todas as faixas precisam de um título.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Upload cover
      let coverUrl: string | null = null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: coverErr } = await supabase.storage.from("covers").upload(path, coverFile);
        if (coverErr) throw coverErr;
        const { data: publicUrl } = supabase.storage.from("covers").getPublicUrl(path);
        coverUrl = publicUrl.publicUrl;
      }

      // Create release
      const { data: release, error: relErr } = await supabase.from("releases").insert({
        user_id: user.id,
        title,
        type: type as any,
        cover_art_url: coverUrl,
        release_date: releaseDate || null,
        status: "draft" as any,
      }).select("id").single();
      if (relErr) throw relErr;

      // Upload tracks
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        let audioUrl: string | null = null;

        if (t.file) {
          const ext = t.file.name.split(".").pop();
          const path = `${user.id}/${release.id}/${i + 1}.${ext}`;
          updateTrack(i, "uploading", true);
          const { error: audioErr } = await supabase.storage.from("audio").upload(path, t.file);
          if (audioErr) throw audioErr;
          audioUrl = path; // Store path, use signed URL for playback
          updateTrack(i, "progress", 100);
        }

        await supabase.from("tracks").insert({
          release_id: release.id,
          title: t.title,
          isrc: t.isrc || null,
          audio_file_url: audioUrl,
          track_number: i + 1,
        });
      }

      toast({ title: "Lançamento criado!", description: "Seu lançamento foi salvo como rascunho." });
      navigate("/dashboard/releases");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Erro ao criar lançamento.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Novo Lançamento</h1>
        <p className="text-muted-foreground text-sm">Crie um novo single ou álbum para distribuição.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Informações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground">Título</Label>
              <Input placeholder="Nome do lançamento" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 bg-muted border-border" required />
            </div>
            <div>
              <Label className="text-foreground">Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="album">Álbum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Data de Lançamento</Label>
              <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="mt-1 bg-muted border-border" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Capa</CardTitle></CardHeader>
          <CardContent>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
            <div
              onClick={() => coverInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Capa" className="w-32 h-32 object-cover rounded-lg mx-auto" />
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Arraste ou clique para upload</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Min 3000x3000px</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-foreground">Faixas</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addTrack}>+ Adicionar Faixa</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tracks.map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted space-y-2">
                <div className="flex items-center gap-3">
                  <Music className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input placeholder="Título da faixa" value={t.title} onChange={(e) => updateTrack(i, "title", e.target.value)} className="bg-background border-border" required />
                    <Input placeholder="ISRC (opcional)" value={t.isrc} onChange={(e) => updateTrack(i, "isrc", e.target.value)} className="bg-background border-border" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="text-muted-foreground shrink-0" onClick={() => removeTrack(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                    <FileAudio className="w-4 h-4" />
                    {t.file ? t.file.name : "Selecionar áudio (MP3/WAV)"}
                    <input type="file" accept=".mp3,.wav" className="hidden" onChange={(e) => handleAudioSelect(i, e)} />
                  </label>
                </div>
                {t.uploading && <Progress value={t.progress} className="h-1" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/releases")}>Cancelar</Button>
          <Button type="submit" className="gradient-purple text-primary-foreground border-0" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar Rascunho"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewRelease;
