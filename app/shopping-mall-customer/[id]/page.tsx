'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Edit3,
    CreditCard,
    Phone,
    User,
    Calendar,
    Loader2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Customer {
    id: number | string;
    name: string;
    phone: string;
    purchaseAmount?: number;
    paidAmount?: number;
    dueAmount?: number;
    status?: string;
    createdAt?: string;
}

interface Payment {
    id: number;
    paidAmount: number;
    paymentMethod: string;
    paymentDate: string;
    trxId?: string;
    status: string;
}

export default function CustomerViewPage() {
    const params = useParams();
    const router = useRouter();

    const customerId = params.id as string;
    const isCreateMode = customerId === 'new';

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isCreateMode) {
            setCustomer({
                id: '',
                name: '',
                phone: '',
                purchaseAmount: 0,
                paidAmount: 0,
                dueAmount: 0,
                status: 'NEW',
            });
            setPayments([]);
            setLoading(false);
            return;
        }
        fetchCustomerData();
    }, [customerId]);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch Customer
            const custRes = await fetch(
                `http://localhost:8080/api/shoppingmall-master-data/masterData?id=${customerId}`,
                { credentials: 'include' }
            );

            if (!custRes.ok) {
                if (custRes.status === 403) throw new Error("Access Denied");
                throw new Error('Customer not found');
            }

            const custData = await custRes.json();
            setCustomer(custData);

            // ✅ FIXED: Correct Payments Endpoint (same as working page)
            const payRes = await fetch(
                `http://localhost:8080/api/shoppingMall-payments/${customerId}/payments`,
                { credentials: 'include' }
            );

            if (payRes.ok) {
                const payData = await payRes.json();
                setPayments(Array.isArray(payData) ? payData : []);
            } else {
                console.warn("Payments fetch failed:", payRes.status);
                setPayments([]);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to load customer data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-emerald-600" size={70} />
            </div>
        );
    }

    if (!isCreateMode && (error || !customer)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        {error || 'Customer Not Found'}
                    </h2>
                    <Button onClick={() => router.push('/shopping-mall-customer')} className="mt-4">
                        Back to Customers
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft size={20} />
                        Back to Customers
                    </Button>

                    {!isCreateMode && (
                        <div className="flex gap-3">
                            <Button asChild variant="outline">
                                <Link href={`/shopping-mall-customer/${customerId}/edit`}>
                                    <Edit3 size={18} className="mr-2" />
                                    Edit Customer
                                </Link>
                            </Button>

                            <Button asChild>
                                <Link href={`/shopping-mall-customer/${customerId}/payments`}>
                                    <CreditCard size={18} className="mr-2" />
                                    Add Payment
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Rest of your JSX remains the same */}
                {/* ... (Customer Info, Financial Summary, Recent Payments) ... */}

                {/* Recent Payments Section */}
                {!isCreateMode && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Payments</CardTitle>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/shopping-mall-customer/${customerId}/payments`}>
                                    View All Payments
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {payments.length === 0 ? (
                                <p className="text-center py-12 text-gray-500">
                                    No payments recorded yet
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Trx ID</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.slice(0, 5).map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    ৳{payment.paidAmount}
                                                </TableCell>
                                                <TableCell>{payment.paymentMethod}</TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {payment.trxId || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={payment.status === 'SUCCEEDED' ? 'default' : 'destructive'}>
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}