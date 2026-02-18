import { User, Instagram, Music2, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-muted-foreground text-sm">Gerencie suas informações públicas.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Avatar</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <Button variant="outline" size="sm">Upload Foto</Button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Máx 2MB.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Informações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-foreground">Nome Artístico</Label>
            <Input defaultValue="MC Luna" className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label className="text-foreground">Email</Label>
            <Input defaultValue="luna@email.com" className="mt-1 bg-muted border-border" disabled />
          </div>
          <div>
            <Label className="text-foreground">Biografia</Label>
            <Textarea placeholder="Conte sobre você e sua música..." className="mt-1 bg-muted border-border" rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Redes Sociais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: Instagram, label: "Instagram", placeholder: "@seuuser" },
            { icon: Music2, label: "Spotify", placeholder: "Link do perfil" },
            { icon: Youtube, label: "YouTube", placeholder: "Link do canal" },
            { icon: Globe, label: "TikTok", placeholder: "@seuuser" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon className="w-5 h-5 text-muted-foreground shrink-0" />
              <Input placeholder={s.placeholder} className="bg-muted border-border" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gradient-purple text-primary-foreground border-0" onClick={() => toast({ title: "Perfil salvo!" })}>
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default Profile;
