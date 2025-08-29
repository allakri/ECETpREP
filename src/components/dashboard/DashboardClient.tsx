
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, BarChart, Trophy } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { Skeleton } from "../ui/skeleton";

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


export default function DashboardClient() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Skeleton className="h-80 w-full" />
            </div>
            <div className="lg:col-span-2">
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="flex h-full items-center justify-center"><p>Please log in to see your dashboard.</p></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Here is a summary of your learning progress and achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">2 more to reach your goal</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">5 <span className="text-base font-normal">days</span></div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Branch</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{user.branch}</div>
                  <p className="text-xs text-muted-foreground">{user.college}</p>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Exam Score History</CardTitle>
            <CardDescription>Your scores on recent mock tests show a positive trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={examData}>
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
                <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
