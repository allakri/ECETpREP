
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, CheckCircle, Clock, Target, Award, TrendingUp, BookOpen, User } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts';

const mockExamData = [
  { name: 'Mock Test 1', score: 65 },
  { name: 'Mock Test 2', score: 78 },
  { name: 'Mock Test 3', score: 72 },
  { name: 'Mock Test 4', score: 85 },
  { name: 'Mock Test 5', score: 91 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow bg-secondary/30 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                </div>
                <Skeleton className="h-80 rounded-lg" />
            </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-headline text-primary">Welcome to your Dashboard, {user.name}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Tests Attempted</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">+2 since last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">78.2%</div>
                        <p className="text-xs text-muted-foreground">Trending upwards</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10h 32m</div>
                        <p className="text-xs text-muted-foreground">Across all tests</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">391</div>
                        <p className="text-xs text-muted-foreground">Out of 500 questions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5"/> Performance Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsBarChart data={mockExamData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))"
                                    }}
                                />
                                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between"><strong>Email:</strong> <span>{user.email}</span></div>
                        <div className="flex justify-between"><strong>Phone:</strong> <span>{user.phone}</span></div>
                        <div className="flex justify-between"><strong>College:</strong> <span>{user.college}</span></div>
                        <div className="flex justify-between"><strong>Branch:</strong> <span>{user.branch}</span></div>
                        <div className="flex justify-between"><strong>Year:</strong> <span>{user.year}</span></div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
