import { useState, useRef } from "react";
import { Upload, FileText, Plus, X, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManualEntry {
  track_title: string;
  platform: string;
  streams: string;
  downloads: string;
  date: string;
}

const PLATFORMS = ["Spotify", "Apple Music", "YouTube Music", "Deezer", "Amazon Music", "Tidal", "Outro"];

const AdminImport = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState<ManualEntry>({ track_title: "", platform: "Spotify", streams: "0", downloads: "0", date: new Date().toISOString().slice(0, 10) });
  const [tracks, setTracks] = useState<{ id: string; title: string; release_id: string }[]>([]);

  const fetchTracks = async () => {
    const { data } = await supabase.from("tracks").select("id, title, release_id");
    setTracks(data || []);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setFileName(f.name); }
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] || ""; });
      return row;
    });
  };

  const handleImport = async () => {
    if (!file) { toast({ title: "Selecione um arquivo CSV", variant: "destructive" }); return; }
    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) { toast({ title: "CSV vazio ou formato inválido", variant: "destructive" }); return; }

      if (tracks.length === 0) await fetchTracks();

      let imported = 0;
      for (const row of rows) {
        const trackTitle = row.track_title || row.title || "";
        const track = tracks.find(t => t.title.toLowerCase() === trackTitle.toLowerCase());
        if (!track) continue;

        await supabase.from("streams").insert({
          track_id: track.id,
          platform: row.platform || "Unknown",
          streams: parseInt(row.streams || "0") || 0,
          downloads: parseInt(row.downloads || "0") || 0,
          date: row.date || new Date().toISOString().slice(0, 10),
        });
        imported++;
      }

      toast({ title: `${imported} registros importados de ${rows.length} linhas.` });
      setFile(null);
      setFileName("");
    } catch (err: any) {
      toast({ title: "Erro ao importar", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  const handleManualAdd = async () => {
    if (!manual.track_title) { toast({ title: "Informe o título da faixa", variant: "destructive" }); return; }
    if (tracks.length === 0) await fetchTracks();
    const track = tracks.find(t => t.title.toLowerCase() === manual.track_title.toLowerCase());
    if (!track) {
      toast({ title: "Faixa não encontrada", description: "Verifique o título exato.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("streams").insert({
      track_id: track.id,
      platform: manual.platform,
      streams: parseInt(manual.streams) || 0,
      downloads: parseInt(manual.downloads) || 0,
      date: manual.date,
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Stream adicionado!" });
      setManual({ track_title: "", platform: "Spotify", streams: "0", downloads: "0", date: new Date().toISOString().slice(0, 10) });
      setManualOpen(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Uploaded Files / Importar Streams</h1>
          <p className="text-muted-foreground text-sm">Upload CSV ou adicione manualmente streams e downloads.</p>
        </div>
        <Dialog open={manualOpen} onOpenChange={setManualOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-primary-foreground border-0" onClick={() => { fetchTracks(); }}>
              <Plus className="w-4 h-4 mr-2" /> Manual
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">Adicionar Stream Manual</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Título da Faixa</Label>
                <Input value={manual.track_title} onChange={e => setManual({ ...manual, track_title: e.target.value })} placeholder="Título exato da faixa" className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <Label className="text-foreground">Plataforma</Label>
                <Select value={manual.platform} onValueChange={v => setManual({ ...manual, platform: v })}>
                  <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Streams</Label>
                  <Input type="number" value={manual.streams} onChange={e => setManual({ ...manual, streams: e.target.value })} className="mt-1 bg-muted border-border" />
                </div>
                <div>
                  <Label className="text-foreground">Downloads</Label>
                  <Input type="number" value={manual.downloads} onChange={e => setManual({ ...manual, downloads: e.target.value })} className="mt-1 bg-muted border-border" />
                </div>
              </div>
              <div>
                <Label className="text-foreground">Data</Label>
                <Input type="date" value={manual.date} onChange={e => setManual({ ...manual, date: e.target.value })} className="mt-1 bg-muted border-border" />
              </div>
              <Button className="w-full gradient-purple text-primary-foreground border-0" onClick={handleManualAdd}>Adicionar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Upload CSV</CardTitle></CardHeader>
        <CardContent>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer"
          >
            {fileName ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <span className="text-foreground font-medium">{fileName}</span>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-foreground font-medium mb-1">Arraste o arquivo CSV aqui</p>
                <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar</p>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Formato: track_title, platform, streams, downloads, date</p>
          <div className="mt-6 flex justify-end">
            <Button className="gradient-purple text-primary-foreground border-0" onClick={handleImport} disabled={importing || !file}>
              {importing ? "Importando..." : "Importar Dados"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImport;
