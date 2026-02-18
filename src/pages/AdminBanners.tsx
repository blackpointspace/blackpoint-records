import { useState, useEffect, useRef } from "react";
import { Image, Plus, Edit2, Trash2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BannerRow {
  id: string;
  title: string;
  image_url: string;
  link: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminBanners = () => {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<BannerRow | null>(null);
  const [form, setForm] = useState({ title: "", link: "", active: true, sort_order: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchBanners = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setBanners((data || []) as BannerRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openNew = () => {
    setEditBanner(null);
    setForm({ title: "", link: "", active: true, sort_order: banners.length });
    setImageFile(null);
    setImagePreview(null);
    setOpen(true);
  };

  const openEdit = (b: BannerRow) => {
    setEditBanner(b);
    setForm({ title: b.title, link: b.link || "", active: b.active, sort_order: b.sort_order });
    setImageFile(null);
    setImagePreview(b.image_url);
    setOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!form.title) { toast({ title: "Informe o título", variant: "destructive" }); return; }
    if (!editBanner && !imageFile) { toast({ title: "Selecione uma imagem", variant: "destructive" }); return; }

    setSaving(true);
    try {
      let imageUrl = editBanner?.image_url || "";

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("banners").upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: pubUrl } = supabase.storage.from("banners").getPublicUrl(path);
        imageUrl = pubUrl.publicUrl;
      }

      if (editBanner) {
        const { error } = await supabase.from("banners").update({
          title: form.title,
          image_url: imageUrl,
          link: form.link || null,
          active: form.active,
          sort_order: form.sort_order,
        }).eq("id", editBanner.id);
        if (error) throw error;
        toast({ title: "Banner atualizado!" });
      } else {
        const { error } = await supabase.from("banners").insert({
          title: form.title,
          image_url: imageUrl,
          link: form.link || null,
          active: form.active,
          sort_order: form.sort_order,
        });
        if (error) throw error;
        toast({ title: "Banner criado!" });
      }

      setOpen(false);
      fetchBanners();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Banner removido!" });
      fetchBanners();
    }
  };

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
          <h1 className="font-display text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-muted-foreground text-sm">Gerencie os banners exibidos no frontend.</p>
        </div>
        <Button className="gradient-purple text-primary-foreground border-0" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhum banner cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <Card key={b.id} className="bg-card border-border overflow-hidden">
              <div className="h-40 bg-muted">
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.active ? "Ativo" : "Inativo"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">{editBanner ? "Editar Banner" : "Novo Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Título</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 bg-muted border-border" />
            </div>
            <div>
              <Label className="text-foreground">Link (opcional)</Label>
              <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." className="mt-1 bg-muted border-border" />
            </div>
            <div>
              <Label className="text-foreground">Imagem</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <div onClick={() => fileRef.current?.click()} className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/30 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-24 mx-auto rounded object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Clique para upload</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Ativo</Label>
              <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
            </div>
            <Button className="w-full gradient-purple text-primary-foreground border-0" onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBanners;
