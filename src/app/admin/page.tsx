import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// This is a placeholder for user data. In a real app, you would fetch this from Firestore.
const users = [
    { id: "1", name: "John Doe", email: "john.doe@example.com", role: "student", lastLogin: "2024-07-28" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com", role: "student", lastLogin: "2024-07-28" },
    { id: "3", name: "Admin User", email: "admin@example.com", role: "admin", lastLogin: "2024-07-29" },
];

export default function AdminPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-grow bg-secondary/30 py-12">
                <div className="container mx-auto px-4">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline text-primary">Admin Dashboard</CardTitle>
                            <CardDescription>Manage users and platform settings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h2 className="text-2xl font-bold mb-4">User Management</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Last Login</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>{user.lastLogin}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
