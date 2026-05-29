'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Eye,
    CreditCard,
    Search,
    Loader2,
    AlertCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Customer {
    id: number | string;
    name: string;
    phone: string;
    purchaseAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: string;
}

const API_URL = 'http://localhost:8080/api/shoppingmall-master-data';

export default function ShoppingMallCustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(API_URL, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data)) {
                throw new Error('Invalid API response');
            }

            const normalizePhone = (phone: any): string => {
                if (!phone) return 'N/A';

                let cleaned = phone.toString().trim();

                // Remove any existing spaces or dashes for checking
                cleaned = cleaned.replace(/[\s-]/g, '');

                if (cleaned === '') return 'N/A';

                // Add leading zero if it doesn't have one and looks like a BD phone number
                if (!cleaned.startsWith('0') && cleaned.length >= 9) {
                    cleaned = '0' + cleaned;
                }

                return cleaned;
            };

            const mappedData: Customer[] = data.map((c) => {
                const due =
                    Number(c?.dueAmount ?? c?.totalDue ?? 0);

                return {
                    id: c?.id ?? '',
                    name: c?.name ?? c?.customerName ?? 'N/A',
                    phone: normalizePhone(c?.phone ?? c?.mobile ?? c?.contactNumber),
                    purchaseAmount: Number(
                        c?.purchaseAmount ?? c?.totalPurchase ?? 0
                    ),
                    paidAmount: Number(
                        c?.paidAmount ?? c?.totalPaid ?? 0
                    ),
                    dueAmount: due,
                    status:
                        c?.status ??
                        (due > 0 ? 'PARTIALLY_PAID' : 'PAID'),
                };
            });

            setCustomers(mappedData);
            setFilteredCustomers(mappedData);
        } catch (err) {
            console.error(err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch customers');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = customers.filter((c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.phone?.includes(search)
        );

        setFilteredCustomers(filtered);
    }, [search, customers]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">
                            Shopping Mall Customers
                        </h1>

                        <p className="text-slate-600 mt-1">
                            Manage all customers and their payments
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/shopping-mall/register">
                            <Plus className="mr-2 h-5 w-5" />
                            New Customer
                        </Link>
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                All Customers ({filteredCustomers.length})
                            </CardTitle>

                            <div className="relative w-80">
                                <Search
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={20}
                                />

                                <Input
                                    placeholder="Search by name or phone..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2
                                    className="animate-spin text-emerald-600"
                                    size={50}
                                />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead className="text-right">
                                            Purchase
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Paid
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Due
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredCustomers.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-12 text-gray-500"
                                            >
                                                No customers found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCustomers.map((customer) => (
                                            <TableRow
                                                key={customer.id}
                                                className="hover:bg-slate-50"
                                            >
                                                <TableCell className="font-medium">
                                                    {customer.name}
                                                </TableCell>

                                                <TableCell>
                                                    {customer.phone}
                                                </TableCell>

                                                <TableCell className="text-right font-semibold">
                                                    ৳
                                                    {customer.purchaseAmount.toLocaleString()}
                                                </TableCell>

                                                <TableCell className="text-right text-green-600 font-semibold">
                                                    ৳
                                                    {customer.paidAmount.toLocaleString()}
                                                </TableCell>

                                                <TableCell className="text-right text-red-600 font-semibold">
                                                    ৳
                                                    {customer.dueAmount.toLocaleString()}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            customer.status ===
                                                            'PAID'
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {customer.status}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={`/shopping-mall-customer/${customer.id}`}
                                                            >
                                                                <Eye size={16} />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            asChild
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={`/shopping-mall-customer/${customer.id}/payments`}
                                                            >
                                                                <CreditCard
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                Payment
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}