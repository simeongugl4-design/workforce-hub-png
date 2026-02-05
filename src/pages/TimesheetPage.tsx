import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Calendar, Send, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface TimesheetEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  task: string;
  status: 'pending' | 'approved' | 'flagged';
}

const mockTimesheets: TimesheetEntry[] = [
  { id: '1', date: '2025-01-06', clockIn: '08:00', clockOut: '17:00', hours: 8, task: 'Site surveying', status: 'pending' },
  { id: '2', date: '2025-01-05', clockIn: '07:30', clockOut: '16:30', hours: 8, task: 'Foundation inspection', status: 'approved' },
  { id: '3', date: '2025-01-04', clockIn: '08:00', clockOut: '16:00', hours: 7.5, task: 'Material ordering', status: 'approved' },
  { id: '4', date: '2025-01-03', clockIn: '09:00', clockOut: '17:30', hours: 8, task: 'Project planning', status: 'approved' },
  { id: '5', date: '2025-01-02', clockIn: '08:00', clockOut: '15:00', hours: 6.5, task: 'Safety training', status: 'flagged' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-success"><CheckCircle2 size={14} className="mr-1" />Approved</Badge>;
    case 'pending':
      return <Badge variant="secondary"><Clock size={14} className="mr-1" />Pending</Badge>;
    case 'flagged':
      return <Badge className="bg-warning text-warning-foreground"><AlertCircle size={14} className="mr-1" />Flagged</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function TimesheetPage() {
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [supervisor, setSupervisor] = useState('');

  const calculateHours = () => {
    if (!clockIn || !clockOut) return 0;
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    return ((outHour * 60 + outMin) - (inHour * 60 + inMin)) / 60;
  };

  const hours = calculateHours();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit timesheet logic
    console.log({ clockIn, clockOut, taskDescription, supervisor, hours });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Timesheet</h1>
        <p className="text-muted-foreground">Submit your daily work hours</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Submit Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Entry
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clockIn">Clock In</Label>
                  <Input
                    id="clockIn"
                    type="time"
                    value={clockIn}
                    onChange={(e) => setClockIn(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clockOut">Clock Out</Label>
                  <Input
                    id="clockOut"
                    type="time"
                    value={clockOut}
                    onChange={(e) => setClockOut(e.target.value)}
                    required
                  />
                </div>
              </div>

              {hours > 0 && (
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-3xl font-bold text-primary">{hours.toFixed(1)}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="task">Task Description</Label>
                <Textarea
                  id="task"
                  placeholder="What did you work on today?"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor</Label>
                <Select value={supervisor} onValueChange={setSupervisor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="sarah">Sarah Williams</SelectItem>
                    <SelectItem value="david">David Okoro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2">
                <Send size={16} />
                Submit Timesheet
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Timesheets
            </CardTitle>
            <CardDescription>Your submitted work hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTimesheets.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell>{entry.clockIn}</TableCell>
                      <TableCell>{entry.clockOut}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{entry.task}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
