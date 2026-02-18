import { useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

const titleMap: Record<string, string> = {
  "/admin/sellers": "Sellers",
  "/admin/reports": "Reports",
  "/admin/marketing": "Marketing",
  "/admin/support": "Suporte",
  "/admin/payments": "Payment Gateways",
  "/admin/website": "Website Setup",
  "/admin/settings": "Setup & Configurations",
  "/admin/staff": "Staffs",
  "/admin/system": "System",
};

const AdminPlaceholder = () => {
  const location = useLocation();
  const title = titleMap[location.pathname] || "Página";

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Settings className="w-7 h-7 text-primary" />
      </div>
      <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground text-sm mt-2 max-w-md">
        Esta seção está em desenvolvimento. Em breve terá funcionalidades completas.
      </p>
    </div>
  );
};

export default AdminPlaceholder;
