import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  UserCheck,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyPayroll = [
  { month: 'Aug', amount: 125000 },
  { month: 'Sep', amount: 132000 },
  { month: 'Oct', amount: 128000 },
  { month: 'Nov', amount: 145000 },
  { month: 'Dec', amount: 152000 },
  { month: 'Jan', amount: 148000 },
];

const attendanceData = [
  { week: 'W1', rate: 94 },
  { week: 'W2', rate: 96 },
  { week: 'W3', rate: 92 },
  { week: 'W4', rate: 98 },
];

const employmentBreakdown = [
  { name: 'Permanent', value: 35, color: 'hsl(145, 72%, 28%)' },
  { name: 'Temporary', value: 15, color: 'hsl(45, 93%, 47%)' },
];

const departmentHours = [
  { dept: 'Civil', hours: 1250 },
  { dept: 'Survey', hours: 480 },
  { dept: 'Safety', hours: 320 },
  { dept: 'Admin', hours: 640 },
  { dept: 'Equipment', hours: 560 },
];

export default function CEOAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">CEO Analytics Dashboard</h1>
        <p className="text-muted-foreground">Complete workforce performance overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp size={12} />
              +4 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K 148,000</div>
            <p className="text-xs text-destructive flex items-center gap-1">
              <TrendingDown size={12} />
              -2.6% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp size={12} />
              +1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts Expiring</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Monthly Payroll Trend
            </CardTitle>
            <CardDescription>Total payroll expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPayroll}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `K${value/1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`K ${value.toLocaleString()}`, 'Payroll']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="amount" fill="hsl(145, 72%, 28%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Hours by Department
            </CardTitle>
            <CardDescription>This month's work hours distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentHours} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="dept" type="category" className="text-xs" width={60} />
                  <Tooltip 
                    formatter={(value: number) => [`${value} hours`, 'Hours']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="hours" fill="hsl(145, 72%, 40%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Attendance Trend
            </CardTitle>
            <CardDescription>Weekly attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" domain={[80, 100]} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Attendance']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="hsl(145, 72%, 28%)" strokeWidth={2} dot={{ fill: 'hsl(145, 72%, 28%)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Employment Breakdown
            </CardTitle>
            <CardDescription>Permanent vs Temporary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {employmentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} workers`, '']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {employmentBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Contract Alerts
            </CardTitle>
            <CardDescription>Upcoming expirations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
              <div>
                <p className="font-medium">Peter Manu</p>
                <p className="text-sm text-muted-foreground">Surveyor</p>
              </div>
              <Badge className="bg-warning text-warning-foreground">Feb 28</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="font-medium">James Kopi</p>
                <p className="text-sm text-muted-foreground">Equipment Operator</p>
              </div>
              <Badge variant="secondary">Jun 30</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="font-medium">Lisa Kumul</p>
                <p className="text-sm text-muted-foreground">Site Assistant</p>
              </div>
              <Badge variant="secondary">Jul 15</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
