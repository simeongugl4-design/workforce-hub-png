import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Loader2, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAllProfiles } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { PendingApprovals } from "@/components/workers/PendingApprovals";
import { WorkerDetailPanel } from "@/components/workers/WorkerDetailPanel";
import { WorkSummarySection } from "@/components/workers/WorkSummarySection";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved': return <Badge className="bg-success">Active</Badge>;
    case 'pending': return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

function WorkersTable({
  workers,
  isLoading,
  selectedWorkerId,
  onSelectWorker,
}: {
  workers: any[];
  isLoading: boolean;
  selectedWorkerId: string | null;
  onSelectWorker: (id: string | null) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker: any) => (
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
              <TableCell>K {Number(worker.hourly_rate || 0).toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(worker.account_status)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelectWorker(selectedWorkerId === worker.id ? null : worker.id)}
                >
                  <Eye size={16} className="mr-1" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {workers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No workers found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function WorkersPage() {
  const { primaryRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const { data: profiles, isLoading } = useAllProfiles();

  const isAdmin = ['ceo', 'manager'].includes(primaryRole);
  const isSupervisor = primaryRole === 'supervisor';

  const filterWorkers = (type: 'permanent' | 'temporary') =>
    profiles?.filter((w: any) => {
      const matchesSearch = w.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.position?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = w.employment_type === type;
      return matchesSearch && matchesType;
    }) || [];

  const permanentWorkers = filterWorkers('permanent');
  const temporaryWorkers = filterWorkers('temporary');
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
      {(isAdmin || isSupervisor) && <PendingApprovals />}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input placeholder="Search workers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* Permanent / Temporary Tabs */}
      <Tabs defaultValue="permanent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="permanent" className="gap-2">
            <Users size={16} /> Permanent ({permanentWorkers.length})
          </TabsTrigger>
          <TabsTrigger value="temporary" className="gap-2">
            <Users size={16} /> Temporary ({temporaryWorkers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permanent">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className={selectedWorkerId && selectedWorker?.employment_type === 'permanent' ? "lg:col-span-2" : "lg:col-span-3"}>
              <CardContent className="pt-6">
                <WorkersTable
                  workers={permanentWorkers}
                  isLoading={isLoading}
                  selectedWorkerId={selectedWorkerId}
                  onSelectWorker={setSelectedWorkerId}
                />
              </CardContent>
            </Card>
            {selectedWorkerId && selectedWorker?.employment_type === 'permanent' && (
              <div className="space-y-4">
                <WorkerDetailPanel worker={selectedWorker} workerId={selectedWorkerId} />
                <WorkSummarySection workerId={selectedWorkerId} />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="temporary">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className={selectedWorkerId && selectedWorker?.employment_type === 'temporary' ? "lg:col-span-2" : "lg:col-span-3"}>
              <CardContent className="pt-6">
                <WorkersTable
                  workers={temporaryWorkers}
                  isLoading={isLoading}
                  selectedWorkerId={selectedWorkerId}
                  onSelectWorker={setSelectedWorkerId}
                />
              </CardContent>
            </Card>
            {selectedWorkerId && selectedWorker?.employment_type === 'temporary' && (
              <div className="space-y-4">
                <WorkerDetailPanel worker={selectedWorker} workerId={selectedWorkerId} />
                <WorkSummarySection workerId={selectedWorkerId} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
