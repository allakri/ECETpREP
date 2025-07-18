
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setName(user.name);
      setPhone(user.phoneNumber);
      setBranch(user.branch);
      setCollege(user.college);
      setYear(user.yearOfStudy);
    }
  }, [user, loading, router]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails = {
      name,
      phoneNumber: phone,
      branch,
      college,
      yearOfStudy: year,
    };
    updateUser(updatedDetails);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex items-center justify-center bg-secondary/30 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center bg-secondary/30 p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">My Profile</CardTitle>
            <CardDescription>View and edit your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">College</Label>
                <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="yearOfStudy">Year of Study</Label>
                 <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="yearOfStudy">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
