import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, User, Settings, CheckCircle2, Clock4, Sparkles, Mail } from 'lucide-react';

interface ProfileData {
  email: string;
  createdAt?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const response = await apiFetch('/api/auth/me');
      if (response.ok && response.data?.user) {
        setProfile(response.data.user);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : '—';

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Profile</p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Your professional account</h1>
              <p className="max-w-2xl text-sm text-muted-foreground mt-2">
                Review account details, enhance security, and track your finance activity from one polished dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                Professional
              </Badge>
              <Button variant="outline">Edit profile</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border bg-background shadow-sm">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Account</p>
                </div>
                <p className="text-2xl font-semibold text-foreground">{profile?.email ?? <Skeleton className="h-6 w-40" />}</p>
                <p className="text-sm text-muted-foreground">Professional account created for finance management.</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-background shadow-sm">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Security</p>
                </div>
                <p className="text-2xl font-semibold text-foreground">Strong</p>
                <p className="text-sm text-muted-foreground">Your password meets the required strength.</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-background shadow-sm">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                </div>
                <p className="text-2xl font-semibold text-foreground">Premium</p>
                <p className="text-sm text-muted-foreground">Designed for professionals tracking multiple budgets.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Account details</CardTitle>
                <CardDescription>Everything you need to know about your account status.</CardDescription>
              </div>
              <Button variant="outline">Update password</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-sm text-muted-foreground">Email address</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{loading ? <Skeleton className="h-5 w-52" /> : profile?.email || '—'}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{loading ? <Skeleton className="h-5 w-32" /> : memberSince}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-sm text-muted-foreground">Account type</p>
                  <p className="mt-2 text-base font-semibold text-foreground">Professional</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-sm text-muted-foreground">Profile status</p>
                  <p className="mt-2 text-base font-semibold text-foreground">Verified</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-sm text-muted-foreground">Support</p>
                  <p className="mt-2 text-base font-semibold text-foreground">Support available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Security snapshot</CardTitle>
              <CardDescription>Easy access to secure profile settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                </div>
                <p className="text-sm text-muted-foreground">Make your account even more secure by enabling 2FA.</p>
                <Button variant="outline" className="w-full">Enable 2FA</Button>
              </div>

              <div className="space-y-2 rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">Security settings</p>
                </div>
                <p className="text-sm text-muted-foreground">Review your login and device activity frequently.</p>
                <Button variant="outline" className="w-full">View settings</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Latest activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">Recent login</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">Web dashboard</p>
                    <p className="text-sm text-muted-foreground">You logged in from your browser.</p>
                  </div>
                  <Clock4 className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">Support access</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">support@finance-tracker.app</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Professional insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your Finance Tracker profile is optimized for professionals. Keep your account updated to get better budget insights and reporting.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground">Billing</p>
                  <p className="mt-2 font-semibold text-foreground">Monthly overview</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground">Reports</p>
                  <p className="mt-2 font-semibold text-foreground">Advanced analytics ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
