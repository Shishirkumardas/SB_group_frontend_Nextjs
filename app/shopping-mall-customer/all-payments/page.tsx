'use client';

import { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShoppingMallPaymentView {
    date: string;
    paidAmount: number;
    paymentMethod: string;
    status?: string;
    customerName: string;
    customerPhone: string | number;   // Can be BigDecimal or String
}

export default function AllPaymentsPage() {
    const [payments, setPayments] = useState<ShoppingMallPaymentView[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<ShoppingMallPaymentView[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [methodFilter, setMethodFilter] = useState('ALL');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/shoppingMall-payments', {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setPayments(data);
                setFilteredPayments(data);
            } else {
                console.error("Failed to fetch payments");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtering Logic
    useEffect(() => {
        let result = [...payments];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.customerName?.toLowerCase().includes(term) ||
                String(p.customerPhone || '').includes(term)
            );
        }

        if (methodFilter !== 'ALL') {
            result = result.filter(p => p.paymentMethod === methodFilter);
        }

        setFilteredPayments(result);
    }, [searchTerm, methodFilter, payments]);

    const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Payments History</h1>
                        <p className="text-gray-600 mt-1">NJBL Shopping Mall • Complete Transaction Records</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={fetchPayments} className="gap-2">
                            <RefreshCw size={18} /> Refresh
                        </Button>
                        <Button className="gap-2" onClick={() => window.print()}>
                            <Download size={18} /> Export Report
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Total Transactions</p>
                            <p className="text-4xl font-bold mt-2">{filteredPayments.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Total Collection</p>
                            <p className="text-4xl font-bold text-green-600 mt-2">
                                ৳{totalAmount.toLocaleString('en-US')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">Average Bill Value</p>
                            <p className="text-4xl font-bold mt-2">
                                ৳{filteredPayments.length ? Math.round(totalAmount / filteredPayments.length) : 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex-1 min-w-[280px]">
                                <Input
                                    placeholder="Search by customer name or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={methodFilter} onValueChange={setMethodFilter}>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Methods</SelectItem>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="BKASH">bKash</SelectItem>
                                    <SelectItem value="ROCKET">Rocket</SelectItem>
                                    <SelectItem value="NAGAD">Nagad</SelectItem>
                                    <SelectItem value="CARD">Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">Loading payments...</TableCell>
                                    </TableRow>
                                ) : filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">No payments found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50">
                                            <TableCell>
                                                {new Date(payment.date).toLocaleDateString('en-GB')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {payment.customerName || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {payment.customerPhone || 'N/A'}
                                            </TableCell>
                                            <TableCell className="font-bold text-green-600">
                                                ৳{Number(payment.paidAmount).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {payment.paymentMethod}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-700">SUCCESS</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}