import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Music, LayoutDashboard, Disc3, DollarSign, User, Bell, FileText, LogOut, Shield, Users, Upload,
  Package, ShoppingCart, Store, Image, BarChart3, MessageSquare, Megaphone, Headphones, CreditCard,
  Globe, Settings, UserCog, Cpu, Puzzle, Library, Wrench, TrendingUp, Receipt, UserCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const artistLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Painel de controle" },
  { to: "/dashboard/releases", icon: Library, label: "Biblioteca" },
  { to: "/dashboard/releases/new", icon: Wrench, label: "Serviços" },
  { to: "/dashboard/royalties", icon: TrendingUp, label: "Analytics" },
  { to: "/dashboard/documents", icon: Receipt, label: "Faturamento" },
  { to: "/dashboard/profile", icon: UserCircle, label: "Conta" },
];

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/releases", icon: Package, label: "Produtos" },
  { to: "/admin/royalties", icon: DollarSign, label: "Notas" },
  { to: "/admin/sales", icon: ShoppingCart, label: "Sales" },
  { to: "/admin/artists", icon: Users, label: "Clientes" },
  { to: "/admin/sellers", icon: Store, label: "Sellers" },
  { to: "/admin/import", icon: Upload, label: "Uploaded Files" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/banners", icon: Image, label: "Banners" },
  { to: "/admin/marketing", icon: Megaphone, label: "Marketing" },
  { to: "/admin/support", icon: Headphones, label: "Suporte" },
  { to: "/admin/payments", icon: CreditCard, label: "Payment Gateways" },
  { to: "/admin/website", icon: Globe, label: "Website Setup" },
  { to: "/admin/settings", icon: Settings, label: "Setup & Config" },
  { to: "/admin/staff", icon: UserCog, label: "Staffs" },
  { to: "/admin/system", icon: Cpu, label: "System" },
  { to: "/admin/notifications", icon: Bell, label: "Notificações" },
];

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const location = useLocation();
  const links = isAdmin ? adminLinks : artistLinks;
  const { signOut, profile, role } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-sidebar shrink-0">
        <Link to="/" className="flex items-center gap-2 p-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
            <Music className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">Black Point</span>
          {isAdmin && <Badge variant="outline" className="text-[10px] border-primary text-primary ml-auto">Admin</Badge>}
        </Link>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all ${isActive ? "bg-primary/15 text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                <link.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-1">
          {profile && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
          {!isAdmin && role === "admin" && (
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground hover:bg-sidebar-accent transition-all">
              <Shield className="w-4 h-4" />
              Painel Admin
            </Link>
          )}
          {isAdmin && (
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground hover:bg-sidebar-accent transition-all">
              <User className="w-4 h-4" />
              Portal Artista
            </Link>
          )}
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Black Point</span>
          </Link>
        </div>
        <div className="lg:hidden flex overflow-x-auto border-b border-border px-2 py-1 gap-1">
          {links.slice(0, 8).map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground"}`}>
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
