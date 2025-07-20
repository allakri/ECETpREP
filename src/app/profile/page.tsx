
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
import { Loader2, Flame, BarChart as BarChartIcon, Trophy, Pencil, Book, ListChecks, LayoutDashboard } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Bar } from "recharts";
import { ScoreChart } from "@/components/results/ScoreChart";
import { StudyActivityCalendar } from '@/components/profile/StudyActivityCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalNotes } from '@/components/profile/PersonalNotes';
import { TodoList } from '@/components/profile/TodoList';


// Mock data, in a real app this would come from a database
const examData = [
  { name: 'Test 1', score: 65 },
  { name: 'Test 2', score: 78 },
  { name: 'Test 3', score: 82 },
  { name: 'Test 4', score: 75 },
  { name: 'Test 5', score: 91 },
];

const overallPerformanceData = {
    score: 81,
    correctCount: 45,
    incorrectCount: 15,
    unansweredCount: 5,
    totalQuestions: 65
};

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setPhone(user.phoneNumber);
      setBranch(user.branch);
      setCollege(user.college);
      setYear(user.yearOfStudy);
    }
    setIsEditing(false);
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow p-4 md:p-8">
        <div className="container mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline text-primary">Welcome, {user.name}!</h1>
                <p className="text-muted-foreground">Your personal study hub. Track your progress, take notes, and manage your tasks.</p>
            </div>
            
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8 bg-background border">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><LayoutDashboard className="mr-2"/> Dashboard</TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Book className="mr-2"/> Personal Notes</TabsTrigger>
                <TabsTrigger value="todos" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><ListChecks className="mr-2"/> Todo List</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column for Profile Editing */}
                    <div className="lg:col-span-1">
                    <Card className="w-full shadow-lg">
                        <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-headline text-primary">My Profile</CardTitle>
                            <CardDescription>View and edit your personal information.</CardDescription>
                        </div>
                        {!isEditing && (
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-5 w-5" />
                            </Button>
                        )}
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={handleSaveChanges} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                {isEditing ? <Input id="name" value={name} onChange={(e) => setName(e.target.value)} /> : <p className="text-muted-foreground">{name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                {isEditing ? <Input id="phoneNumber" value={phone} onChange={(e) => setPhone(e.target.value)} /> : <p className="text-muted-foreground">{phone}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch">Branch</Label>
                                {isEditing ? <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} /> : <p className="text-muted-foreground">{branch}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="college">College</Label>
                                {isEditing ? <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} /> : <p className="text-muted-foreground">{college}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="yearOfStudy">Year of Study</Label>
                                {isEditing ? (
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
                                ) : (
                                <p className="text-muted-foreground">{year}</p>
                                )}
                            </div>
                            {isEditing && (
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Save Changes
                                </Button>
                            </div>
                            )}
                        </form>
                        </CardContent>
                    </Card>
                    </div>

                    {/* Right Column for Dashboard Widgets */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                                    <Trophy className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">78%</div>
                                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
                                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground">2 more to reach your goal</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                        <StudyActivityCalendar />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                            <Card className="shadow-lg xl:col-span-3">
                                <CardHeader>
                                    <CardTitle>Exam Score History</CardTitle>
                                    <CardDescription>Your scores on recent mock tests show a positive trend.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={examData}>
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`}/>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--background))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "var(--radius)"
                                            }}
                                        />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <div className="xl:col-span-2">
                                <ScoreChart {...overallPerformanceData} />
                            </div>
                        </div>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <PersonalNotes />
              </TabsContent>
              <TabsContent value="todos">
                <TodoList />
              </TabsContent>
            </Tabs>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
