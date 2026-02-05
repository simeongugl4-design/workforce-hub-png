import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, ArrowRight, Shield } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [phone, setPhone] = useState('+675 ');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, navigate to dashboard
    navigate('/dashboard');
  };

  const handleDemoLogin = (role: string) => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo size="lg" />
            <p className="text-muted-foreground mt-2">
              Sign in to manage your workforce
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Enter your PNG phone number to receive a verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'credentials' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+675 7XXX XXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Papua New Guinea phone numbers only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    Send Verification Code
                    <ArrowRight size={18} />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-primary" size={32} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="font-medium">{phone}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    Verify & Sign In
                    <ArrowRight size={18} />
                  </Button>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => setStep('credentials')}
                  >
                    Use a different number
                  </Button>
                </form>
              )}

              {/* Demo login options */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Demo: Quick login as
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('ceo')}
                  >
                    CEO
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('manager')}
                  >
                    Manager
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('supervisor')}
                  >
                    Supervisor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('worker')}
                  >
                    Worker
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground">
          <h2 className="font-display text-4xl font-bold mb-4">
            Streamline Your Workforce
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            From timesheets to payslips, manage your entire workforce with one powerful platform.
          </p>
          
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-primary-foreground/60">Workers Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-primary-foreground/60">Auto Payslips</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-primary-foreground/60">Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
