import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, FileText, DollarSign, Calendar, TrendingUp, ArrowRight, Loader2, Users, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTimesheets } from "@/hooks/useTimesheets";
import { usePayslips } from "@/hooks/usePayslips";
import { usePendingApprovals } from "@/hooks/useAccountApprovals";

export default function WorkerDashboard() {
  const { user, primaryRole } = useAuth();
  const { data: timesheets, isLoading: loadingTimesheets } = useTimesheets();
  const { data: payslips } = usePayslips();
  const { data: pendingApprovals } = usePendingApprovals();

  const isAdmin = ['ceo', 'manager', 'supervisor'].includes(primaryRole);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Calculate stats
  const thisWeekHours = timesheets?.filter((t: any) => {
    const d = new Date(t.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return d >= weekStart && t.status === 'approved';
  }).reduce((sum: number, t: any) => sum + Number(t.total_hours || 0), 0) || 0;

  const latestPayslip = payslips?.[0];
  const pendingCount = timesheets?.filter((t: any) => t.status === 'pending').length || 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            {greeting()}, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>
        {isAdmin ? (
          <Link to="/timesheet">
            <Button className="gap-2"><Clock size={18} />Enter Timesheets</Button>
          </Link>
        ) : (
          <Link to="/timesheet">
            <Button className="gap-2"><Clock size={18} />View Timesheets</Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekHours.toFixed(1)}</div>
            <Progress value={(thisWeekHours / 40) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">of 40 hours target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              K {latestPayslip ? Number(latestPayslip.net_pay).toLocaleString() : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latestPayslip ? `${new Date(latestPayslip.period_start).toLocaleDateString()} period` : 'No payslips yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Timesheets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timesheets?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All time entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? 'timesheets to review' : 'awaiting approval'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific: Pending Approvals */}
      {isAdmin && pendingApprovals && pendingApprovals.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-warning" />
              {pendingApprovals.length} Pending Account Approval{pendingApprovals.length > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/workers">
              <Button variant="outline" className="gap-2">
                Review Approvals <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timesheets
            </CardTitle>
            <CardDescription>
              {isAdmin ? 'Enter and approve timesheets' : 'View your work hours'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/timesheet">
              <Button className="w-full gap-2">
                {isAdmin ? 'Manage Timesheets' : 'View Timesheets'}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Payslips
            </CardTitle>
            <CardDescription>
              {latestPayslip 
                ? `Latest: K ${Number(latestPayslip.net_pay).toLocaleString()}`
                : 'No payslips generated yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/payslips">
              <Button variant="outline" className="w-full gap-2">
                View Payslips <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>View your profile and bank details</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/profile">
              <Button variant="outline" className="w-full gap-2">
                My Profile <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Employment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>Your current employment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">{user?.position || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Employment Type</p>
              <Badge>{user?.employment_type || 'permanent'}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant="outline" className="capitalize">{primaryRole}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
              <p className="font-medium">K {Number(user?.hourly_rate || 0).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
