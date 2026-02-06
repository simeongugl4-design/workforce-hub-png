import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye, Calendar, DollarSign, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePayslips } from "@/hooks/usePayslips";

export default function PayslipsPage() {
  const { primaryRole } = useAuth();
  const { data: payslips, isLoading } = usePayslips();
  const isAdmin = ['ceo', 'manager', 'accountant'].includes(primaryRole);

  const latestPayslip = payslips?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          {isAdmin ? "Payroll Management" : "Payslips"}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin ? "All worker payslips" : "Your automatically generated payslips"}
        </p>
      </div>

      {/* Latest Payslip Summary */}
      {latestPayslip && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Latest Payslip
                </CardTitle>
                <CardDescription>
                  {new Date(latestPayslip.period_start).toLocaleDateString()} - {new Date(latestPayslip.period_end).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className={latestPayslip.status === 'paid' ? 'bg-success' : 'bg-warning text-warning-foreground'}>
                {latestPayslip.status === 'paid' ? 'Paid' : latestPayslip.status === 'generated' ? 'Generated' : 'Draft'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="text-center p-4 rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="text-2xl font-bold">{Number(latestPayslip.total_hours).toFixed(1)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-2xl font-bold">K {Number(latestPayslip.hourly_rate).toFixed(2)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">Gross</p>
                <p className="text-2xl font-bold">K {Number(latestPayslip.gross_pay).toLocaleString()}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <p className="text-sm text-muted-foreground">Deductions</p>
                <p className="text-2xl font-bold text-destructive">K {Number(latestPayslip.deductions).toFixed(2)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary text-primary-foreground">
                <p className="text-sm opacity-80">Net Pay</p>
                <p className="text-2xl font-bold">K {Number(latestPayslip.net_pay).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payslip History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Payslip History
          </CardTitle>
          <CardDescription>All generated payslips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>Worker</TableHead>}
                  <TableHead>Period</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips?.map((payslip: any) => (
                  <TableRow key={payslip.id}>
                    {isAdmin && <TableCell className="font-medium">{payslip.worker?.full_name}</TableCell>}
                    <TableCell>
                      {new Date(payslip.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(payslip.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>{Number(payslip.total_hours).toFixed(1)}</TableCell>
                    <TableCell>K {Number(payslip.gross_pay).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">K {Number(payslip.net_pay).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={payslip.status === 'paid' ? 'bg-success' : payslip.status === 'generated' ? 'bg-warning text-warning-foreground' : ''} variant={payslip.status === 'draft' ? 'secondary' : 'default'}>
                        {payslip.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!payslips || payslips.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                      No payslips generated yet. Payslips are auto-generated when timesheets are approved.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Auto-generation Notice */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Automatic Payslip Generation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Payslips are automatically generated when timesheets are approved by supervisors.
                Workers cannot edit payslips—all calculations are done by the system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
