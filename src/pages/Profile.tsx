import { useState, useEffect, useRef } from "react";
import { User, Instagram, Music2, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState({ instagram: "", spotify: "", youtube: "", tiktok: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setName(data.name || "");
        setBiography(data.biography || "");
        setAvatarUrl(data.avatar_url);
        const links = (data.social_links as Record<string, string>) || {};
        setSocialLinks({ instagram: links.instagram || "", spotify: links.spotify || "", youtube: links.youtube || "", tiktok: links.tiktok || "" });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erro no upload", variant: "destructive" }); return; }
    const { data: pub } = supabase.storage.from("covers").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl);
    await supabase.from("profiles").update({ avatar_url: pub.publicUrl }).eq("user_id", user.id);
    toast({ title: "Avatar atualizado!" });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name,
      biography,
      social_links: socialLinks,
    }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil salvo!" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-muted-foreground text-sm">Gerencie suas informações públicas.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Avatar</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <Button variant="outline" size="sm" onClick={() => avatarRef.current?.click()}>Upload Foto</Button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Máx 2MB.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Informações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-foreground">Nome Artístico</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label className="text-foreground">Email</Label>
            <Input value={user?.email || ""} className="mt-1 bg-muted border-border" disabled />
          </div>
          <div>
            <Label className="text-foreground">Biografia</Label>
            <Textarea value={biography} onChange={(e) => setBiography(e.target.value)} placeholder="Conte sobre você e sua música..." className="mt-1 bg-muted border-border" rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-foreground">Redes Sociais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: Instagram, key: "instagram" as const, placeholder: "@seuuser" },
            { icon: Music2, key: "spotify" as const, placeholder: "Link do perfil" },
            { icon: Youtube, key: "youtube" as const, placeholder: "Link do canal" },
            { icon: Globe, key: "tiktok" as const, placeholder: "@seuuser" },
          ].map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <s.icon className="w-5 h-5 text-muted-foreground shrink-0" />
              <Input value={socialLinks[s.key]} onChange={(e) => setSocialLinks({ ...socialLinks, [s.key]: e.target.value })} placeholder={s.placeholder} className="bg-muted border-border" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gradient-purple text-primary-foreground border-0" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
