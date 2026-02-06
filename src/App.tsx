import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import WorkerDashboard from "@/pages/dashboard/WorkerDashboard";
import TimesheetPage from "@/pages/TimesheetPage";
import PayslipsPage from "@/pages/PayslipsPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import WorkersPage from "@/pages/WorkersPage";
import CEOAnalytics from "@/pages/CEOAnalytics";
import AccountsPage from "@/pages/AccountsPage";

// Layout & Auth
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<WorkerDashboard />} />
              <Route path="/timesheet" element={<TimesheetPage />} />
              <Route path="/payslips" element={<PayslipsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/workers" element={
                <ProtectedRoute allowedRoles={['ceo', 'manager', 'supervisor', 'accountant']}>
                  <WorkersPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute allowedRoles={['ceo', 'manager']}>
                  <CEOAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/accounts" element={
                <ProtectedRoute allowedRoles={['ceo', 'manager', 'accountant']}>
                  <AccountsPage />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute allowedRoles={['supervisor', 'manager', 'ceo']}>
                  <WorkersPage />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['manager', 'ceo', 'accountant']}>
                  <CEOAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/payroll" element={<PayslipsPage />} />
              <Route path="/broadcast" element={<ChatPage />} />
              <Route path="/settings" element={<ProfilePage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
