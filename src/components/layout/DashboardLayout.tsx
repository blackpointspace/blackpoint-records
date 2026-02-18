import { Link, useLocation, Outlet } from "react-router-dom";
import { Music, LayoutDashboard, Disc3, DollarSign, User, Bell, FileText, LogOut, Shield, Users, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const artistLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: 0 },
  { to: "/dashboard/releases", icon: Disc3, label: "Lançamentos", badge: 0 },
  { to: "/dashboard/royalties", icon: DollarSign, label: "Royalties", badge: 0 },
  { to: "/dashboard/profile", icon: User, label: "Perfil", badge: 0 },
  { to: "/dashboard/notifications", icon: Bell, label: "Notificações", badge: 2 },
  { to: "/dashboard/documents", icon: FileText, label: "Documentos", badge: 0 },
];

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", badge: 0 },
  { to: "/admin/artists", icon: Users, label: "Artistas", badge: 0 },
  { to: "/admin/releases", icon: Disc3, label: "Lançamentos", badge: 0 },
  { to: "/admin/notifications", icon: Bell, label: "Notificações", badge: 0 },
  { to: "/admin/import", icon: Upload, label: "Importar Streams", badge: 0 },
];

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const location = useLocation();
  const links = isAdmin ? adminLinks : artistLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar p-4">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
            <Music className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">Black Point</span>
          {isAdmin && <Badge variant="outline" className="text-xs border-primary text-primary ml-auto">Admin</Badge>}
        </Link>

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.badge && (
                  <span className="ml-auto w-5 h-5 rounded-full gradient-purple text-[10px] flex items-center justify-center text-primary-foreground font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-4 mt-4">
          {!isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all">
              <Shield className="w-4 h-4" />
              Painel Admin
            </Link>
          )}
          {isAdmin && (
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all">
              <User className="w-4 h-4" />
              Portal Artista
            </Link>
          )}
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all">
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Black Point</span>
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden flex overflow-x-auto border-b border-border px-2 py-1 gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                  isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground"
                }`}
              >
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
