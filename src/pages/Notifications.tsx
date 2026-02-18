import { Bell, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data";

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Notificações</h1>
          <p className="text-muted-foreground text-sm">{mockNotifications.filter(n => !n.isRead).length} não lidas</p>
        </div>
        <Button variant="outline" size="sm">
          <Check className="w-4 h-4 mr-2" /> Marcar Todas como Lidas
        </Button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((n) => (
          <Card key={n.id} className={`border-border ${!n.isRead ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? "gradient-purple" : "bg-muted"}`}>
                <Bell className={`w-5 h-5 ${!n.isRead ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-foreground">{n.title}</h3>
                  {!n.isRead && <div className="w-2 h-2 rounded-full gradient-purple" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{n.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
