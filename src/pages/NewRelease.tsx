import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const NewRelease = () => {
  const [type, setType] = useState("single");
  const [tracks, setTracks] = useState<string[]>([""]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addTrack = () => setTracks([...tracks, ""]);
  const removeTrack = (i: number) => setTracks(tracks.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "album" && tracks.length < 2) {
      toast({ title: "Erro", description: "Álbuns precisam de no mínimo 2 faixas.", variant: "destructive" });
      return;
    }
    toast({ title: "Lançamento criado!", description: "Seu lançamento foi salvo como rascunho." });
    navigate("/dashboard/releases");
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
              <Input placeholder="Nome do lançamento" className="mt-1 bg-muted border-border" required />
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
              <Input type="date" className="mt-1 bg-muted border-border" required />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-foreground">Capa</CardTitle></CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Arraste ou clique para upload</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Min 3000x3000px</p>
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
            {tracks.map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Music className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input placeholder="Título da faixa" className="bg-background border-border" />
                  <Input placeholder="ISRC (opcional)" className="bg-background border-border" />
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-muted-foreground shrink-0" onClick={() => removeTrack(i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <p className="text-sm text-muted-foreground">Upload de arquivos de áudio (MP3, WAV)</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/releases")}>Cancelar</Button>
          <Button type="submit" className="gradient-purple text-primary-foreground border-0">Salvar Rascunho</Button>
        </div>
      </form>
    </div>
  );
};

export default NewRelease;
