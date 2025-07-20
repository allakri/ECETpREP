
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Megaphone, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const users = [
  { name: "Priya Sharma", email: "priya.sharma@example.com", branch: "Computer Science", joined: "2023-10-15" },
  { name: "Rahul Verma", email: "rahul.verma@example.com", branch: "Mechanical Eng.", joined: "2023-10-12" },
  { name: "Anjali Gupta", email: "anjali.gupta@example.com", branch: "Electronics & Comm.", joined: "2023-10-10" },
  { name: "Suresh Kumar", email: "suresh.k@example.com", branch: "Civil Engineering", joined: "2023-11-01" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-muted-foreground">+50 in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tests Taken</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,450</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">12 new posts today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Series Management */}
        <Card>
          <CardHeader>
            <CardTitle>Test Series Management</CardTitle>
            <CardDescription>Upload new test questions or view existing JSON files.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="question-file">Upload New Questions (JSON)</Label>
              <div className="flex gap-2 mt-2">
                <Input id="question-file" type="file" accept=".json" />
                <Button><Upload className="mr-2 h-4 w-4" /> Upload</Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Existing Test Files</h4>
              <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded-md bg-muted/50">
                    <span className="text-sm font-mono">2024_cs_paper.json</span>
                    <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> View</Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded-md bg-muted/50">
                    <span className="text-sm font-mono">2023_mech_paper.json</span>
                    <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> View</Button>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Post an Announcement</CardTitle>
            <CardDescription>This will be displayed to all users on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Textarea placeholder="Enter your announcement here..." rows={6} />
             <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Megaphone className="mr-2 h-4 w-4" /> Post Announcement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>An overview of the latest users to join the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.branch}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
