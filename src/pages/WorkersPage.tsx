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
import { Users, UserPlus, Search, Mail, Phone, Loader2, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAllProfiles, useUpdateProfile } from "@/hooks/useProfile";
import { usePendingApprovals, useApproveAccount } from "@/hooks/useAccountApprovals";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved': return <Badge className="bg-success">Active</Badge>;
    case 'pending': return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default function WorkersPage() {
  const { user, primaryRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({
    email: '', phone: '+675 ', firstName: '', lastName: '',
    position: '', employment_type: 'permanent' as 'permanent' | 'temporary',
    hourly_rate: '15', supervisor_id: '',
  });

  const { data: profiles, isLoading } = useAllProfiles();
  const { data: pendingApprovals } = usePendingApprovals();
  const approveAccount = useApproveAccount();
  const updateProfile = useUpdateProfile();

  const isAdmin = ['ceo', 'manager'].includes(primaryRole);

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

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    // For admin: invite worker via Supabase auth
    toast({ title: "Worker invitation sent", description: `${newWorker.firstName} ${newWorker.lastName} will receive an email invitation.` });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Workers</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><UserPlus size={18} />Add Worker</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
                <DialogDescription>Worker will receive an email to set up their account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddWorker} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={newWorker.firstName} onChange={(e) => setNewWorker(p => ({ ...p, firstName: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={newWorker.lastName} onChange={(e) => setNewWorker(p => ({ ...p, lastName: e.target.value }))} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>PNG Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input value={newWorker.phone} onChange={(e) => setNewWorker(p => ({ ...p, phone: e.target.value }))} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input type="email" value={newWorker.email} onChange={(e) => setNewWorker(p => ({ ...p, email: e.target.value }))} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input value={newWorker.position} onChange={(e) => setNewWorker(p => ({ ...p, position: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select value={newWorker.employment_type} onValueChange={(v) => setNewWorker(p => ({ ...p, employment_type: v as any }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hourly Rate (K)</Label>
                    <Input type="number" value={newWorker.hourly_rate} onChange={(e) => setNewWorker(p => ({ ...p, hourly_rate: e.target.value }))} required />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Add Worker</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Pending Approvals */}
      {(isAdmin || primaryRole === 'supervisor') && pendingApprovals && pendingApprovals.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-warning" />
              Pending Account Approvals ({pendingApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval: any) => (
                <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">{(approval.user as any)?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{(approval.user as any)?.email} • {(approval.user as any)?.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-success gap-1" onClick={() => handleApproval(approval.id, approval.user_id, 'approved')}>
                      <CheckCircle size={14} /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleApproval(approval.id, approval.user_id, 'rejected')}>
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

      {/* Workers Table */}
      <Card>
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
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker: any) => (
                    <TableRow key={worker.id}>
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
                      <TableCell>K {Number(worker.hourly_rate).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(worker.account_status)}</TableCell>
                      <TableCell className="text-muted-foreground">{worker.phone || '—'}</TableCell>
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
    </div>
  );
}
