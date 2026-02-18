import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Releases from "./pages/Releases";
import NewRelease from "./pages/NewRelease";
import Royalties from "./pages/Royalties";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Documents from "./pages/Documents";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReleases from "./pages/AdminReleases";
import AdminImport from "./pages/AdminImport";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/precos" element={<Pricing />} />
            <Route path="/login" element={<Login />} />

            {/* Artist Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="releases" element={<Releases />} />
              <Route path="releases/new" element={<NewRelease />} />
              <Route path="royalties" element={<Royalties />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="documents" element={<Documents />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><DashboardLayout isAdmin /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="releases" element={<AdminReleases />} />
              <Route path="artists" element={<AdminDashboard />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="import" element={<AdminImport />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
