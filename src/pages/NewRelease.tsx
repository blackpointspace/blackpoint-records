import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Music, FileAudio, Plus, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Lock, Info } from "lucide-react";

const LOCKED_LABEL_PLANS = ["Orbit", "Nebula", "Dark Orbit"];

const GENRES = [
  "Pop", "Rock", "Hip-Hop/Rap", "R&B/Soul", "Eletrônica", "Sertanejo", "Funk", "MPB",
  "Jazz", "Blues", "Country", "Reggae", "Metal", "Punk", "Clássica", "Gospel", "Forró",
  "Pagode", "Samba", "Bossa Nova", "Indie", "Alternative", "Dance", "Trap", "Lo-Fi", "Outro"
];

interface TrackData {
  title: string;
  isrc: string;
  file: File | null;
  uploading: boolean;
  progress: number;
}

interface RevenueSplit {
  name: string;
  percentage: number;
}

const NewRelease = () => {
  // Basic info
  const [title, setTitle] = useState("");
  const [type, setType] = useState("single");
  const [genre, setGenre] = useState("");
  const [version, setVersion] = useState("");
  const defaultReleaseDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 20);
    return d.toISOString().split("T")[0];
  };
  const [releaseDate, setReleaseDate] = useState(defaultReleaseDate());

  // Artists
  const [mainArtist, setMainArtist] = useState("");
  const [featArtists, setFeatArtists] = useState("");

  // Label / Copyright
  const [label, setLabel] = useState("");
  const [copyright, setCopyright] = useState("");
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear().toString());

  // Codes
  const [eanUpc, setEanUpc] = useState("");
  const [catalogNumber, setCatalogNumber] = useState("");

  // Previous publication
  const [previouslyPublished, setPreviouslyPublished] = useState(false);
  const [originalReleaseDate, setOriginalReleaseDate] = useState("");

  // Cover
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Tracks
  const [tracks, setTracks] = useState<TrackData[]>([{ title: "", isrc: "", file: null, uploading: false, progress: 0 }]);

  // Revenue Splits
  const [splits, setSplits] = useState<RevenueSplit[]>([{ name: "", percentage: 100 }]);

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const userPlan = profile?.plan || "Orbit";
  const isLabelLocked = LOCKED_LABEL_PLANS.includes(userPlan);
  const effectiveLabel = isLabelLocked ? "BlackPoint Records" : label;

  const addTrack = () => setTracks([...tracks, { title: "", isrc: "", file: null, uploading: false, progress: 0 }]);
  const removeTrack = (i: number) => setTracks(tracks.filter((_, idx) => idx !== i));
  const updateTrack = (i: number, field: keyof TrackData, value: any) => {
    setTracks(tracks.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const addSplit = () => setSplits([...splits, { name: "", percentage: 0 }]);
  const removeSplit = (i: number) => setSplits(splits.filter((_, idx) => idx !== i));
  const updateSplit = (i: number, field: keyof RevenueSplit, value: any) => {
    setSplits(splits.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const totalSplitPercentage = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);

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
    if (!title || !genre || !mainArtist) {
      toast({ title: "Erro", description: "Preencha título, gênero e artista principal.", variant: "destructive" });
      return;
    }
    if (type === "album" && tracks.length < 2) {
      toast({ title: "Erro", description: "Álbuns precisam de no mínimo 2 faixas.", variant: "destructive" });
      return;
    }
    if (tracks.some((t) => !t.title)) {
      toast({ title: "Erro", description: "Todas as faixas precisam de um título.", variant: "destructive" });
      return;
    }
    if (totalSplitPercentage !== 100) {
      toast({ title: "Erro", description: "Os Revenue Splits devem somar 100%.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let coverUrl: string | null = null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: coverErr } = await supabase.storage.from("covers").upload(path, coverFile);
        if (coverErr) throw coverErr;
        const { data: publicUrl } = supabase.storage.from("covers").getPublicUrl(path);
        coverUrl = publicUrl.publicUrl;
      }

      const { data: release, error: relErr } = await supabase.from("releases").insert({
        user_id: user.id,
        title,
        type: type as any,
        cover_art_url: coverUrl,
        release_date: releaseDate || null,
        status: "draft" as any,
      }).select("id").single();
      if (relErr) throw relErr;

      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        let audioUrl: string | null = null;
        if (t.file) {
          const ext = t.file.name.split(".").pop();
          const path = `${user.id}/${release.id}/${i + 1}.${ext}`;
          updateTrack(i, "uploading", true);
          const { error: audioErr } = await supabase.storage.from("audio").upload(path, t.file);
          if (audioErr) throw audioErr;
          audioUrl = path;
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Novo Lançamento</h1>
        <p className="text-muted-foreground text-sm">Preencha todas as informações do seu lançamento para distribuição.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Informações Básicas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Gênero *</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue placeholder="Selecionar gênero" /></SelectTrigger>
                  <SelectContent>
                    {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Título do Lançamento *</Label>
                <Input placeholder="Nome do lançamento" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 bg-muted border-border" required />
              </div>
              <div>
                <Label className="text-foreground">Versão</Label>
                <Input placeholder="Ex: Deluxe, Remix, Acoustic" value={version} onChange={(e) => setVersion(e.target.value)} className="mt-1 bg-muted border-border" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Data de Lançamento (data prevista)</Label>
              <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="mt-1 bg-muted border-border" />
              <p className="text-xs text-muted-foreground mt-1">Data prevista: mínimo 20 dias a partir de hoje.</p>
            </div>
          </CardContent>
        </Card>

        {/* Artists */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Artistas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground">Artista Principal *</Label>
              <Input placeholder="Nome do artista principal" value={mainArtist} onChange={(e) => setMainArtist(e.target.value)} className="mt-1 bg-muted border-border" required />
            </div>
            <div>
              <Label className="text-foreground">Featuring / Artistas Convidados</Label>
              <Input placeholder="Separados por vírgula" value={featArtists} onChange={(e) => setFeatArtists(e.target.value)} className="mt-1 bg-muted border-border" />
            </div>
          </CardContent>
        </Card>

        {/* Label & Copyright */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Selo & Direitos Autorais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label className="text-foreground">Selo (Label)</Label>
                  {isLabelLocked && (
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary gap-1">
                      <Lock className="w-3 h-3" /> Plano {userPlan}
                    </Badge>
                  )}
                </div>
                {isLabelLocked ? (
                  <div>
                    <Input value="BlackPoint Records" disabled className="mt-1 bg-muted border-border opacity-70" />
                    <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                      <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Seu plano <strong className="text-foreground">{userPlan}</strong> utiliza o selo BlackPoint Records.
                        Para usar um selo personalizado, contrate o add-on por{" "}
                        <strong className="text-primary">R$ 99,00/ano</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Input placeholder="Nome do selo" value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1 bg-muted border-border" />
                )}
              </div>
              <div>
                <Label className="text-foreground">© Ano Direitos Autorais</Label>
                <Input placeholder="2026" value={copyrightYear} onChange={(e) => setCopyrightYear(e.target.value)} className="mt-1 bg-muted border-border" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Direitos Autorais (Copyright)</Label>
              <Input placeholder="Nome do detentor dos direitos" value={copyright} onChange={(e) => setCopyright(e.target.value)} className="mt-1 bg-muted border-border" />
            </div>
          </CardContent>
        </Card>

        {/* Codes & Previous Publication */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Códigos & Publicação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">EAN / UPC (opcional)</Label>
                <Input placeholder="Código EAN/UPC" value={eanUpc} onChange={(e) => setEanUpc(e.target.value)} className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <Label className="text-foreground">Número de Catálogo (opcional)</Label>
                <Input placeholder="Código de catálogo" value={catalogNumber} onChange={(e) => setCatalogNumber(e.target.value)} className="mt-1 bg-muted border-border" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <Label className="text-foreground">Publicação anterior?</Label>
              <Switch checked={previouslyPublished} onCheckedChange={setPreviouslyPublished} />
            </div>
            {previouslyPublished && (
              <div>
                <Label className="text-foreground">Data Original de Lançamento</Label>
                <Input type="date" value={originalReleaseDate} onChange={(e) => setOriginalReleaseDate(e.target.value)} className="mt-1 bg-muted border-border" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Art */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Arte de Capa</CardTitle></CardHeader>
          <CardContent>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
            <div
              onClick={() => coverInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Capa" className="w-40 h-40 object-cover rounded-lg mx-auto" />
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Arraste ou clique para upload</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Min 3000x3000px recomendado</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tracks */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-foreground">Faixas</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addTrack}><Plus className="w-4 h-4 mr-1" /> Adicionar Faixa</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tracks.map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono w-6 text-center">{i + 1}</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input placeholder="Título da faixa" value={t.title} onChange={(e) => updateTrack(i, "title", e.target.value)} className="bg-background border-border" required />
                    <Input placeholder="ISRC (opcional)" value={t.isrc} onChange={(e) => updateTrack(i, "isrc", e.target.value)} className="bg-background border-border" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="text-muted-foreground shrink-0" onClick={() => removeTrack(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 ml-9">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                    <FileAudio className="w-4 h-4" />
                    {t.file ? t.file.name : "Selecionar áudio (MP3/WAV)"}
                    <input type="file" accept=".mp3,.wav" className="hidden" onChange={(e) => handleAudioSelect(i, e)} />
                  </label>
                </div>
                {t.uploading && <Progress value={t.progress} className="h-1 ml-9" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Splits */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-foreground">Revenue Splits</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSplit}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {splits.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Percent className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input placeholder="Nome do artista/participante" value={s.name} onChange={(e) => updateSplit(i, "name", e.target.value)} className="flex-1 bg-background border-border" />
                <div className="flex items-center gap-1 w-24">
                  <Input type="number" min={0} max={100} value={s.percentage} onChange={(e) => updateSplit(i, "percentage", Number(e.target.value))} className="bg-background border-border text-center" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
                {splits.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => removeSplit(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className={`text-right text-sm font-medium ${totalSplitPercentage === 100 ? "text-success" : "text-destructive"}`}>
              Total: {totalSplitPercentage}%
            </div>
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
