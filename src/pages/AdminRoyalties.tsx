import { useState, useEffect } from "react";
import { DollarSign, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ArtistOption { user_id: string; name: string; }
interface RoyaltyRow { id: string; user_id: string; month: string; amount: number; status: string; created_at: string; }

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendente", class: "bg-warning/10 text-warning border-warning/20" },
  available: { label: "Disponível", class: "gradient-purple text-primary-foreground border-0" },
  paid: { label: "Pago", class: "bg-success/10 text-success border-success/20" },
};

const AdminRoyalties = () => {
  const [royalties, setRoyalties] = useState<RoyaltyRow[]>([]);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ user_id: "", month: "", amount: "", status: "pending" });
  const { toast } = useToast();

  const fetchAll = async () => {
    const [royRes, artRes] = await Promise.all([
      supabase.from("royalties").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, name"),
    ]);
    setRoyalties(royRes.data || []);
    setArtists(artRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async () => {
    if (!form.user_id || !form.month || !form.amount) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("royalties").insert({
      user_id: form.user_id,
      month: form.month,
      amount: parseFloat(form.amount),
      status: form.status as any,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Royalty adicionado!" });
      setForm({ user_id: "", month: "", amount: "", status: "pending" });
      setOpen(false);
      fetchAll();
    }
  };

  const getArtistName = (uid: string) => artists.find(a => a.user_id === uid)?.name || uid;

  const filtered = royalties.filter(r => {
    const name = getArtistName(r.user_id).toLowerCase();
    return name.includes(search.toLowerCase()) || r.month.includes(search);
  });

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
          <h1 className="font-display text-2xl font-bold text-foreground">Royalties</h1>
          <p className="text-muted-foreground text-sm">Gerencie royalties dos artistas.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted border-border" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-purple text-primary-foreground border-0">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">Adicionar Royalty</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Artista</Label>
                  <Select value={form.user_id} onValueChange={(v) => setForm({ ...form, user_id: v })}>
                    <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue placeholder="Selecionar artista" /></SelectTrigger>
                    <SelectContent>
                      {artists.map(a => (
                        <SelectItem key={a.user_id} value={a.user_id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-foreground">Mês (YYYY-MM)</Label>
                  <Input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} placeholder="2025-02" className="mt-1 bg-muted border-border" />
                </div>
                <div>
                  <Label className="text-foreground">Valor (R$)</Label>
                  <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="mt-1 bg-muted border-border" />
                </div>
                <div>
                  <Label className="text-foreground">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="available">Disponível</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-purple text-primary-foreground border-0" onClick={handleAdd}>Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">Nenhum royalty encontrado.</p>
        ) : (
          filtered.map((r) => {
            const cfg = statusLabels[r.status] || statusLabels.pending;
            return (
              <Card key={r.id} className="bg-card border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{getArtistName(r.user_id)}</p>
                      <p className="text-xs text-muted-foreground">{r.month}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-foreground font-display font-semibold">R$ {Number(r.amount).toFixed(2).replace(".", ",")}</span>
                    <Badge className={cfg.class}>{cfg.label}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminRoyalties;
