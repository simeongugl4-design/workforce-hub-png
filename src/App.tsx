import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import WorkerDashboard from "@/pages/dashboard/WorkerDashboard";
import TimesheetPage from "@/pages/TimesheetPage";
import PayslipsPage from "@/pages/PayslipsPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import WorkersPage from "@/pages/WorkersPage";
import CEOAnalytics from "@/pages/CEOAnalytics";

// Layout
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const queryClient = new QueryClient();

// Demo wrapper for dashboard with user context
function DashboardWrapper() {
  // Demo user state - in production this would come from auth context
  const [userRole] = useState<'ceo' | 'manager' | 'supervisor' | 'worker'>('worker');
  const userName = "John Waim";

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      {/* Outlet renders child routes */}
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={<DashboardWrapper />}>
            <Route path="/dashboard" element={<WorkerDashboard />} />
            <Route path="/timesheet" element={<TimesheetPage />} />
            <Route path="/payslips" element={<PayslipsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/workers" element={<WorkersPage />} />
            <Route path="/analytics" element={<CEOAnalytics />} />
            <Route path="/team" element={<WorkersPage />} />
            <Route path="/reports" element={<CEOAnalytics />} />
            <Route path="/payroll" element={<PayslipsPage />} />
            <Route path="/broadcast" element={<ChatPage />} />
            <Route path="/settings" element={<ProfilePage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
