
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { updateUserProfile } from '@/lib/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
  const { user, loading, userFromFirestore, setUserFromFirestore } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    branch: '',
    college: '',
    yearOfStudy: '',
  });

  useEffect(() => {
    if (userFromFirestore) {
      setFormData({
        name: userFromFirestore.name || '',
        email: userFromFirestore.email || '',
        phoneNumber: userFromFirestore.phoneNumber || '',
        branch: userFromFirestore.branch || '',
        college: userFromFirestore.college || '',
        yearOfStudy: userFromFirestore.yearOfStudy || '',
      });
    }
  }, [userFromFirestore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save changes.' });
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, formData);
      setUserFromFirestore(prev => prev ? { ...prev, ...formData } : null);
      toast({ title: 'Success', description: 'Your profile has been updated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
       <div className="flex h-screen items-center justify-center">
         <p>Please log in to view your profile.</p>
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
                <Input id="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" value={formData.branch} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">College</Label>
                <Input id="college" value={formData.college} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="yearOfStudy">Year of Study</Label>
                 <Select value={formData.yearOfStudy} onValueChange={(value) => handleSelectChange('yearOfStudy', value)}>
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
                <Button type="submit" disabled={isSaving} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
