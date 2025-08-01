
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
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, Book, ListChecks, LayoutDashboard, BarChart2, CheckCircle } from 'lucide-react';
import { StudyActivityCalendar } from '@/components/profile/StudyActivityCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalNotes } from '@/components/profile/PersonalNotes';
import { TodoList } from '@/components/profile/TodoList';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar as RechartsBar } from 'recharts';
import { ScoreChart } from '@/components/results/ScoreChart';

const ProfilePageSkeleton = () => (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow p-4 md:p-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <Skeleton className="h-9 w-1/3 mb-2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="h-10 w-full max-w-lg mx-auto mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="w-full shadow-lg">
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {[...Array(6)].map((_, i) => (
                    <div className="grid gap-2" key={i}>
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <Skeleton className="h-80 w-full xl:col-span-3" />
                <Skeleton className="h-80 w-full xl:col-span-2" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
)

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
      setName(user.name || '');
      setPhone(user.phoneNumber || '');
      setBranch(user.branch || '');
      setCollege(user.college || '');
      setYear(user.yearOfStudy || '');
    }
  }, [user, loading, router]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const updatedDetails = {
      name,
      phone_number: phone,
      branch,
      college,
      year_of_study: year,
    };
    await updateUser(updatedDetails);
    setIsUpdating(false);
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

  const overallPerformanceData = useMemo(() => {
    if (!user || !user.exam_score_history) return null;
    const totalQuestions = (user.tests_taken || 0) * 100; // This is an approximation
    if (totalQuestions === 0) return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, totalQuestions: 0 };
    
    const correctCount = user.exam_score_history.reduce((acc, test) => acc + (test.score / 100 * totalQuestions / user.tests_taken), 0);

    return user.exam_score_history.reduce(
        (acc, test) => {
            const correct = Math.round(test.score * (100 / 100)); // Assuming each test has 100 questions for simplicity
            acc.correctCount += correct;
            acc.incorrectCount += (100 - correct);
            return acc;
        },
        { score: user.avg_score || 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, totalQuestions: totalQuestions }
    );
  }, [user]);

  if (loading || !user) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow p-4 md:p-8">
        <div className="container mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline text-primary">Welcome, {user.name || 'Student'}!</h1>
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
                                {isEditing ? <Input id="name" value={name} onChange={(e) => setName(e.target.value)} /> : <p className="text-muted-foreground">{name || 'Not set'}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                {isEditing ? <Input id="phoneNumber" value={phone} onChange={(e) => setPhone(e.target.value)} /> : <p className="text-muted-foreground">{phone || 'Not set'}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch">Branch</Label>
                                {isEditing ? <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} /> : <p className="text-muted-foreground">{branch || 'Not set'}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="college">College</Label>
                                {isEditing ? <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} /> : <p className="text-muted-foreground">{college || 'Not set'}</p>}
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
                                <p className="text-muted-foreground">{year || 'Not set'}</p>
                                )}
                            </div>
                            {isEditing && (
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={handleCancel} disabled={isUpdating}>Cancel</Button>
                                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{user.avg_score.toFixed(1)}%</div>
                                    <p className="text-xs text-muted-foreground">Across {user.tests_taken} tests.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
                                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{user.tests_taken}</div>
                                    <p className="text-xs text-muted-foreground">Keep up the great work!</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <StudyActivityCalendar activityData={user.study_activities} streakData={{current: user.current_streak, lastMonth: user.last_month_streak, highest: user.highest_streak}}/>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Exam Score History</CardTitle>
                                    <CardDescription>Your performance over time.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    {user.exam_score_history.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={user.exam_score_history.map(h => ({ name: h.examName, score: h.score }))}>
                                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`}/>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "hsl(var(--background))",
                                                        border: "1px solid hsl(var(--border))",
                                                        borderRadius: "var(--radius)"
                                                    }}
                                                />
                                                <Legend iconType="circle" />
                                                <RechartsBar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center text-muted-foreground">
                                                <p>No exam data yet.</p>
                                                <Button variant="link" onClick={() => router.push('/exams')}>Take your first test!</Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Overall Performance</CardTitle>
                                    <CardDescription>A summary of all your answers.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    {user.tests_taken > 0 && overallPerformanceData ? (
                                       <ScoreChart {...overallPerformanceData} />
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center text-muted-foreground">
                                                <p>Complete an exam to see your performance.</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
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
