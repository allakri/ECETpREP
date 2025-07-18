
"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from "recharts";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const examData = [
  { name: 'Test 1', score: 65 },
  { name: 'Test 2', score: 78 },
  { name: 'Test 3', score: 82 },
  { name: 'Test 4', score: 75 },
  { name: 'Test 5', score: 91 },
];

const overallPerformanceData = [
    { name: 'Correct', value: 45 },
    { name: 'Incorrect', value: 15 },
    { name: 'Unanswered', value: 5 },
];

const COLORS = ['#84cc16', '#ef4444', '#a1a1aa'];


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
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
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow bg-secondary/30">
        <div className="container mx-auto p-4 md:p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground">Here is a summary of your learning progress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Branch</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-2xl font-bold">{user.branch}</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>College</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-2xl font-bold">{user.college}</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>Year of Study</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-2xl font-bold">{user.yearOfStudy}</p>
                  </CardContent>
              </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Exam Score History</CardTitle>
                <CardDescription>Your scores on recent mock tests.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={examData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
                <CardDescription>Your overall question breakdown.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={overallPerformanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {overallPerformanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
