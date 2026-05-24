'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, DollarSign, TrendingUp, Award } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    phone?: string;
    netSale?: string | number;
    profit?: string | number;
    commission?: string | number;
    subordinates?: User[];
}

// Safe Hierarchy Tree Component
const HierarchyTree = ({ user, level = 0 }: { user: User; level?: number }) => {
    const initials = user.name
        ? user.name.substring(0, 2).toUpperCase()
        : '??';

    return (
        <div className={`ml-${level * 8} mt-4`}>
            <div className="flex items-center gap-4 p-4 bg-white border rounded-2xl hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                    {initials}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-lg">
                        {user.name || 'Unnamed User'}
                    </p>
                    <p className="text-sm text-slate-500">{user.role}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="font-bold text-emerald-600">
                        ৳{(Number(user.netSale) || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Net Sale</p>
                </div>
            </div>

            {user.subordinates && user.subordinates.length > 0 && (
                <div className="border-l-2 border-emerald-200 pl-8 mt-3">
                    {user.subordinates.map((sub) => (
                        <HierarchyTree key={sub.id} user={sub} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/users/${id}/with-subordinates`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="p-20 text-center text-xl">Loading user hierarchy...</div>;
    }

    if (!user) {
        return <div className="p-20 text-center text-red-600 text-2xl">User not found</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                ← Back to Users
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-3xl">{user.name || 'Unnamed User'}</CardTitle>
                        <Badge className="text-lg py-1 px-4">{user.role}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 text-lg">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                    </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card className="lg:col-span-8">
                    <CardHeader>
                        <CardTitle>Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <DollarSign className="mx-auto text-emerald-600 mb-3" size={50} />
                                <p className="text-4xl font-bold">
                                    ৳{(Number(user.netSale) || 0).toLocaleString()}
                                </p>
                                <p className="text-slate-500">Net Sale</p>
                            </div>
                            <div>
                                <TrendingUp className="mx-auto text-blue-600 mb-3" size={50} />
                                <p className="text-4xl font-bold">
                                    ৳{(Number(user.profit) || 0).toLocaleString()}
                                </p>
                                <p className="text-slate-500">Profit</p>
                            </div>
                            <div>
                                <Award className="mx-auto text-amber-600 mb-3" size={50} />
                                <p className="text-4xl font-bold">
                                    ৳{(Number(user.commission) || 0).toLocaleString()}
                                </p>
                                <p className="text-slate-500">Commission</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recursive Hierarchy Tree */}
            <Card className="mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Users className="text-emerald-600" /> Full Reporting Hierarchy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <HierarchyTree user={user} />
                </CardContent>
            </Card>
        </div>
    );
}