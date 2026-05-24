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

            const custRes = await fetch(
                `http://localhost:8080/api/shoppingmall-master-data/masterData?id=${customerId}`,
                {
                    credentials: 'include',
                }
            );

            if (!custRes.ok) {
                throw new Error('Customer not found');
            }

            const custData = await custRes.json();
            setCustomer(custData);

            const payRes = await fetch(
                `http://localhost:8080/api/shoppingMall-payments/customer/${customerId}/payments`,
                {
                    credentials: 'include',
                }
            );

            if (payRes.ok) {
                const payData = await payRes.json();
                setPayments(payData);
            } else {
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
                <Loader2
                    className="animate-spin text-emerald-600"
                    size={70}
                />
            </div>
        );
    }

    if (!isCreateMode && (error || !customer)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        Customer Not Found
                    </h2>

                    <Button
                        onClick={() =>
                            router.push('/shopping-mall-customer')
                        }
                        className="mt-4"
                    >
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
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft size={20} />
                        Back to Customers
                    </Button>

                    {!isCreateMode && (
                        <div className="flex gap-3">
                            <Button asChild variant="outline">
                                <Link
                                    href={`/shopping-mall-customer/${customerId}/edit`}
                                >
                                    <Edit3
                                        size={18}
                                        className="mr-2"
                                    />
                                    Edit Customer
                                </Link>
                            </Button>

                            <Button asChild>
                                <Link
                                    href={`/shopping-mall-customer/${customerId}/payments`}
                                >
                                    <CreditCard
                                        size={18}
                                        className="mr-2"
                                    />
                                    Add Payment
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white rounded-t-3xl">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <User size={28} />
                                    {isCreateMode
                                        ? 'New Customer'
                                        : customer?.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-100 p-4 rounded-2xl">
                                        <Phone
                                            className="text-emerald-700"
                                            size={28}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Phone Number
                                        </p>

                                        <p className="text-xl font-semibold">
                                            {customer?.phone || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-100 p-4 rounded-2xl">
                                        <Calendar
                                            className="text-amber-700"
                                            size={28}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Joined On
                                        </p>

                                        <p className="text-lg font-medium">
                                            {customer?.createdAt
                                                ? new Date(
                                                    customer.createdAt
                                                ).toLocaleDateString(
                                                    'en-GB'
                                                )
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Badge
                                        variant={
                                            customer?.status === 'PAID'
                                                ? 'default'
                                                : 'destructive'
                                        }
                                        className="text-lg px-6 py-2"
                                    >
                                        {customer?.status || 'ACTIVE'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Financial Summary
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border">
                                        <p className="text-gray-500">
                                            Total Purchase
                                        </p>

                                        <p className="text-4xl font-bold mt-2">
                                            ৳
                                            {customer?.purchaseAmount || 0}
                                        </p>
                                    </div>

                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                                        <p className="text-emerald-600">
                                            Total Paid
                                        </p>

                                        <p className="text-4xl font-bold mt-2 text-emerald-700">
                                            ৳{customer?.paidAmount || 0}
                                        </p>
                                    </div>

                                    <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                                        <p className="text-red-600">
                                            Due Amount
                                        </p>

                                        <p className="text-4xl font-bold mt-2 text-red-700">
                                            ৳{customer?.dueAmount || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {!isCreateMode && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>
                                        Recent Payments
                                    </CardTitle>

                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Link
                                            href={`/shopping-mall-customer/${customerId}/payments`}
                                        >
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
                                                    <TableHead>
                                                        Date
                                                    </TableHead>
                                                    <TableHead>
                                                        Amount
                                                    </TableHead>
                                                    <TableHead>
                                                        Method
                                                    </TableHead>
                                                    <TableHead>
                                                        Trx ID
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {payments
                                                    .slice(0, 5)
                                                    .map((payment) => (
                                                        <TableRow
                                                            key={payment.id}
                                                        >
                                                            <TableCell>
                                                                {new Date(
                                                                    payment.paymentDate
                                                                ).toLocaleDateString(
                                                                    'en-GB'
                                                                )}
                                                            </TableCell>

                                                            <TableCell className="font-bold">
                                                                ৳
                                                                {
                                                                    payment.paidAmount
                                                                }
                                                            </TableCell>

                                                            <TableCell>
                                                                {
                                                                    payment.paymentMethod
                                                                }
                                                            </TableCell>

                                                            <TableCell className="font-mono text-sm">
                                                                {payment.trxId ||
                                                                    '-'}
                                                            </TableCell>

                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        payment.status ===
                                                                        'SUCCEEDED'
                                                                            ? 'default'
                                                                            : 'destructive'
                                                                    }
                                                                >
                                                                    {
                                                                        payment.status
                                                                    }
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
            </div>
        </div>
    );
}