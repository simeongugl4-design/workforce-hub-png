import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Clock, Award, Edit, Building, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useBankDetails, useUpsertBankDetails } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: bankDetails } = useBankDetails();
  const upsertBank = useUpsertBankDetails();
  const { toast } = useToast();
  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bank_name: '',
    branch: '',
    account_name: '',
    account_number: '',
    bsb_code: '',
    swift_code: '',
  });

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = profile.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?';

  const handleSaveBank = async () => {
    if (!user) return;
    try {
      await upsertBank.mutateAsync({ userId: user.id, details: bankForm });
      toast({ title: "Bank details saved" });
      setEditingBank(false);
    } catch (err: any) {
      toast({ title: "Error saving bank details", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-hero" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold">{profile.full_name}</h1>
                  <p className="text-muted-foreground">{profile.position || 'Employee'}</p>
                </div>
                <Badge className={profile.account_status === 'approved' ? 'bg-success' : 'bg-warning text-warning-foreground'}>
                  {profile.account_status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.phone || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{profile.location || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium text-lg">{profile.position || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{profile.department || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employment Type</p>
                  <Badge className="mt-1">{profile.employment_type}</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="font-medium">K {Number(profile.hourly_rate).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1 bg-success">{profile.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Bank Details
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => {
                  if (bankDetails) {
                    setBankForm({
                      bank_name: bankDetails.bank_name || '',
                      branch: bankDetails.branch || '',
                      account_name: bankDetails.account_name || '',
                      account_number: bankDetails.account_number || '',
                      bsb_code: bankDetails.bsb_code || '',
                      swift_code: bankDetails.swift_code || '',
                    });
                  }
                  setEditingBank(!editingBank);
                }}>
                  <Edit size={16} className="mr-2" />
                  {editingBank ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              <CardDescription>Your bank account for salary payments</CardDescription>
            </CardHeader>
            <CardContent>
              {editingBank ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input value={bankForm.bank_name} onChange={(e) => setBankForm(prev => ({ ...prev, bank_name: e.target.value }))} placeholder="BSP, Kina Bank..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch</Label>
                      <Input value={bankForm.branch} onChange={(e) => setBankForm(prev => ({ ...prev, branch: e.target.value }))} placeholder="Port Moresby" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input value={bankForm.account_name} onChange={(e) => setBankForm(prev => ({ ...prev, account_name: e.target.value }))} placeholder="Full account name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input value={bankForm.account_number} onChange={(e) => setBankForm(prev => ({ ...prev, account_number: e.target.value }))} placeholder="XXXX XXXX XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>BSB / Swift Code</Label>
                      <Input value={bankForm.swift_code} onChange={(e) => setBankForm(prev => ({ ...prev, swift_code: e.target.value }))} placeholder="Optional" />
                    </div>
                  </div>
                  <Button onClick={handleSaveBank} disabled={upsertBank.isPending} className="w-full">
                    {upsertBank.isPending ? 'Saving...' : 'Save Bank Details'}
                  </Button>
                </div>
              ) : bankDetails ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p className="font-medium">{bankDetails.bank_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">{bankDetails.branch || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-medium">{bankDetails.account_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-medium">{'•••• ' + (bankDetails.account_number?.slice(-4) || '—')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No bank details added yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setEditingBank(true)}>
                    Add Bank Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
