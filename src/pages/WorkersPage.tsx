import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Loader2, CheckCircle, XCircle, UserCheck, Eye, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAllProfiles, useBankDetails } from "@/hooks/useProfile";
import { usePendingApprovals, useApproveAccount } from "@/hooks/useAccountApprovals";
import { useToast } from "@/hooks/use-toast";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved': return <Badge className="bg-success">Active</Badge>;
    case 'pending': return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

function WorkerBankDetails({ workerId }: { workerId: string }) {
  const { data: bankDetails, isLoading } = useBankDetails(workerId);

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
  if (!bankDetails) return <span className="text-muted-foreground text-sm">No bank details</span>;

  return (
    <div className="grid gap-3 md:grid-cols-2 text-sm">
      <div>
        <p className="text-muted-foreground">Bank</p>
        <p className="font-medium">{bankDetails.bank_name || '—'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Branch</p>
        <p className="font-medium">{bankDetails.branch || '—'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Account Name</p>
        <p className="font-medium">{bankDetails.account_name || '—'}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Account Number</p>
        <p className="font-medium">{bankDetails.account_number || '—'}</p>
      </div>
    </div>
  );
}

export default function WorkersPage() {
  const { user, primaryRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const { data: profiles, isLoading } = useAllProfiles();
  const { data: pendingApprovals } = usePendingApprovals();
  const approveAccount = useApproveAccount();

  const isAdmin = ['ceo', 'manager'].includes(primaryRole);
  const isSupervisor = primaryRole === 'supervisor';

  const filteredWorkers = profiles?.filter((w: any) => {
    const matchesSearch = w.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || w.employment_type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  const handleApproval = async (approvalId: string, userId: string, status: 'approved' | 'rejected') => {
    try {
      await approveAccount.mutateAsync({ approvalId, userId, status });
      toast({ title: `Account ${status}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const selectedWorker = profiles?.find((p: any) => p.id === selectedWorkerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            {isSupervisor ? 'My Team' : 'Workers'}
          </h1>
          <p className="text-muted-foreground">
            {isSupervisor ? 'Manage your assigned workers' : 'Manage your workforce'}
          </p>
        </div>
      </div>

      {/* Pending Approvals */}
      {(isAdmin || isSupervisor) && pendingApprovals && pendingApprovals.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-warning" />
              Pending Account Approvals ({pendingApprovals.length})
            </CardTitle>
            <CardDescription>Review and approve new worker registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval: any) => (
                <div key={approval.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-warning/20 text-warning">
                        {(approval.user as any)?.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{(approval.user as any)?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        {(approval.user as any)?.email} • {(approval.user as any)?.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-success gap-1"
                      onClick={() => handleApproval(approval.id, approval.user_id, 'approved')}
                      disabled={approveAccount.isPending}
                    >
                      <CheckCircle size={14} /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleApproval(approval.id, approval.user_id, 'rejected')}
                      disabled={approveAccount.isPending}
                    >
                      <XCircle size={14} /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search workers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
            <SelectItem value="temporary">Temporary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workers Table */}
        <Card className={selectedWorkerId ? "lg:col-span-2" : "lg:col-span-3"}>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers.map((worker: any) => (
                      <TableRow key={worker.id} className={selectedWorkerId === worker.id ? 'bg-muted' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={worker.avatar_url} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {worker.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{worker.full_name}</p>
                              <p className="text-xs text-muted-foreground">{worker.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{worker.position || '—'}</TableCell>
                        <TableCell><Badge variant="outline">{worker.employment_type}</Badge></TableCell>
                        <TableCell>K {Number(worker.hourly_rate || 0).toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(worker.account_status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedWorkerId(selectedWorkerId === worker.id ? null : worker.id)}
                          >
                            <Eye size={16} className="mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredWorkers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No workers found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Worker Detail Panel */}
        {selectedWorkerId && selectedWorker && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedWorker.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedWorker.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedWorker.full_name}</CardTitle>
                  <CardDescription>{selectedWorker.position || 'No position'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                  <TabsTrigger value="bank" className="flex-1">Bank</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-3">
                  <div className="grid gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedWorker.email || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedWorker.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{selectedWorker.department || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employment Type</p>
                      <Badge variant="outline">{selectedWorker.employment_type}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hourly Rate</p>
                      <p className="font-medium">K {Number(selectedWorker.hourly_rate || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedWorker.location || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      {getStatusBadge(selectedWorker.account_status)}
                    </div>
                    <div>
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">{new Date(selectedWorker.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bank">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Bank Details</span>
                    </div>
                    <WorkerBankDetails workerId={selectedWorkerId} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
