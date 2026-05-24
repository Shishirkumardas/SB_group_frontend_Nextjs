'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, TrendingUp, DollarSign, Award, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    netSale?: string|number;
    profit?: string|number;
    commission?: string|number;
    subordinatesCount?: string|number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                setFilteredUsers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = [...users];
        if (search) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (selectedRole !== 'ALL') {
            result = result.filter(u => u.role === selectedRole);
        }
        setFilteredUsers(result);
    }, [search, selectedRole, users]);

    const roles = ['ALL', 'ADMIN', 'DMD', 'PD', 'GM', 'MANAGER', 'EXECUTIVE', 'STAFF'];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">User Management</h1>
                    <p className="text-slate-500">Hierarchy • Performance • Commission</p>
                </div>
                <Button onClick={() => router.push('/users/create')}>
                    <UserPlus className="mr-2" /> Add New User
                </Button>
            </div>

            <Tabs defaultValue="list" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="list">User List</TabsTrigger>
                    <TabsTrigger value="performance">Performance Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="border rounded-lg px-4 py-2"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Name</th>
                                    <th className="text-left p-4">Role</th>
                                    <th className="text-center p-4">Net Sale</th>
                                    <th className="text-center p-4">Profit</th>
                                    <th className="text-center p-4">Commission</th>
                                    <th className="text-center p-4">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="border-b hover:bg-slate-50">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4"><Badge>{user.role}</Badge></td>
                                        <td className="p-4 text-center font-semibold">৳{user.netSale?.toLocaleString() || '0'}</td>
                                        <td className="p-4 text-center font-semibold text-emerald-600">৳{user.profit?.toLocaleString() || '0'}</td>
                                        <td className="p-4 text-center font-semibold text-amber-600">৳{user.commission?.toLocaleString() || '0'}</td>
                                        <td className="p-4 text-center">
                                            <Button variant="ghost" size="sm" onClick={() => router.push(`/users/${user.id}`)}>
                                                <Eye size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.filter(u => ['GM', 'MANAGER', 'DMD'].includes(u.role)).map(user => (
                            <Card key={user.id}>
                                <CardHeader>
                                    <CardTitle>{user.name}</CardTitle>
                                    <p className="text-sm text-slate-500">{user.role}</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between"><span>Net Sale</span><span className="font-bold">৳{user.netSale?.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Profit</span><span className="font-bold text-emerald-600">৳{user.profit?.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Commission</span><span className="font-bold text-amber-600">৳{user.commission?.toLocaleString()}</span></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}