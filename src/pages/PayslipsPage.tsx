import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye, Calendar, DollarSign } from "lucide-react";

interface Payslip {
  id: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  hours: number;
  rate: number;
  gross: number;
  deductions: number;
  net: number;
  status: 'generated' | 'viewed';
}

const mockPayslips: Payslip[] = [
  { id: '1', period: 'January 2025', periodStart: '2025-01-01', periodEnd: '2025-01-15', hours: 80, rate: 15, gross: 1200, deductions: 120, net: 1080, status: 'generated' },
  { id: '2', period: 'December 2024', periodStart: '2024-12-16', periodEnd: '2024-12-31', hours: 88, rate: 15, gross: 1320, deductions: 132, net: 1188, status: 'viewed' },
  { id: '3', period: 'December 2024', periodStart: '2024-12-01', periodEnd: '2024-12-15', hours: 72, rate: 15, gross: 1080, deductions: 108, net: 972, status: 'viewed' },
  { id: '4', period: 'November 2024', periodStart: '2024-11-16', periodEnd: '2024-11-30', hours: 80, rate: 15, gross: 1200, deductions: 120, net: 1080, status: 'viewed' },
];

export default function PayslipsPage() {
  const latestPayslip = mockPayslips[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Payslips</h1>
        <p className="text-muted-foreground">Your automatically generated payslips</p>
      </div>

      {/* Latest Payslip Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Latest Payslip
              </CardTitle>
              <CardDescription>{latestPayslip.period}</CardDescription>
            </div>
            <Badge className="bg-success">New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-5">
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-sm text-muted-foreground">Hours Worked</p>
              <p className="text-2xl font-bold">{latestPayslip.hours}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
              <p className="text-2xl font-bold">K {latestPayslip.rate}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-sm text-muted-foreground">Gross Pay</p>
              <p className="text-2xl font-bold">K {latestPayslip.gross.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-sm text-muted-foreground">Deductions</p>
              <p className="text-2xl font-bold text-destructive">K {latestPayslip.deductions}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary text-primary-foreground">
              <p className="text-sm opacity-80">Net Pay</p>
              <p className="text-2xl font-bold">K {latestPayslip.net.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button className="gap-2">
              <Eye size={16} />
              View Full Payslip
            </Button>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payslip History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Payslip History
          </CardTitle>
          <CardDescription>All your generated payslips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.period}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payslip.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(payslip.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>{payslip.hours}</TableCell>
                    <TableCell>K {payslip.gross.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">K {payslip.net.toLocaleString()}</TableCell>
                    <TableCell>
                      {payslip.status === 'generated' ? (
                        <Badge className="bg-success">New</Badge>
                      ) : (
                        <Badge variant="secondary">Viewed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
                Your payslips are automatically generated based on your approved timesheets. 
                You cannot edit payslips directly—all calculations are done by the system to ensure accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
