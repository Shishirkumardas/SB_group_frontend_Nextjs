'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Plus, RefreshCw, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Customer {
    id: number | string;
    name: string;
    phone: string;
    purchaseAmount?: number;
    paidAmount?: number;
    dueAmount?: number;
    status?: string;
}

interface Payment {
    id: number;
    paidAmount: number;
    paymentMethod: string;
    paymentDate: string;
    trxId?: string;
    status: string;
}

export default function CustomerPaymentsPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form
    const [form, setForm] = useState({
        paidAmount: '',
        paymentMethod: 'CASH',
        trxId: '',
    });

    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Real-time polling
    useEffect(() => {
        fetchAllData();

        pollRef.current = setInterval(() => {
            fetchAllData(false); // silent refresh
        }, 7000); // every 7 seconds

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [customerId]);

    const fetchAllData = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const [custRes, payRes] = await Promise.all([
                fetch(`http://localhost:8080/api/shoppingmall-master-data/masterData?id=${customerId}`, {
                    credentials: 'include'
                }),
                fetch(`http://localhost:8080/api/shoppingMall-payments/${customerId}/payments`, {
                    credentials: 'include'
                })
            ]);

            if (custRes.ok) {
                const custData = await custRes.json();
                setCustomer(custData);
            }

            if (payRes.ok) {
                const payData: Payment[] = await payRes.json();
                setPayments(payData);
            }

            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.paidAmount) return;

        setSubmitting(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/shoppingMall-payments/${customerId}/pay`,   // Use this endpoint
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        paidAmount: parseFloat(form.paidAmount),
                        paymentMethod: form.paymentMethod,
                        trxId: form.trxId?.trim() || null,
                        paymentDate: new Date().toISOString().split('T')[0]   // YYYY-MM-DD
                    })
                }
            );

            if (response.ok) {
                alert("✅ Payment added successfully!");
                setForm({ paidAmount: '', paymentMethod: 'CASH', trxId: '' });
                fetchAllData();
            } else {
                alert("Failed to add payment: " + response.status);
            }
        } catch (err) {
            console.error(err);
            alert("Error adding payment");
        } finally {
            setSubmitting(false);
        }
    };

    const printReceipt = (payment: Payment) => {
        const printWin = window.open('', '_blank');
        if (!printWin) return;

        printWin.document.write(`
            <html><head><title>Payment Receipt - NJBL Mall</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .receipt { border: 2px dashed #000; padding: 25px; max-width: 420px; margin: auto; }
                h2 { text-align: center; }
            </style>
            </head><body>
                <div class="receipt">
                    <h2>NJBL SHOPPING MALL</h2>
                    <p style="text-align:center">Payment Receipt</p>
                    <hr/>
                    <p><strong>Date:</strong> ${new Date(payment.paymentDate).toLocaleString()}</p>
                    <p><strong>Customer:</strong> ${customer?.name}</p>
                    <p><strong>Phone:</strong> ${customer?.phone}</p>
                    <p><strong>Amount Paid:</strong> ৳${payment.paidAmount}</p>
                    <p><strong>Method:</strong> ${payment.paymentMethod}</p>
                    ${payment.trxId ? `<p><strong>Trx ID:</strong> ${payment.trxId}</p>` : ''}
                    <p><strong>Status:</strong> ${payment.status}</p>
                    <hr/>
                    <p style="text-align:center; margin-top:30px; font-size:14px;">Thank You! Visit Again</p>
                </div>
            </body></html>
        `);
        printWin.document.close();
        setTimeout(() => printWin.print(), 600);
    };

    // Pagination Logic
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    const paginatedPayments = payments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading && !customer) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" size={70} /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft size={20} /> Back to Customer
                    </Button>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                        <Button variant="ghost" size="sm" onClick={() => fetchAllData()}>
                            <RefreshCw size={16} />
                        </Button>
                    </div>
                </div>

                {/* Customer Summary */}
                {customer && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Customer: {customer.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Total Purchase</p>
                                    <p className="text-3xl font-bold">৳{customer.purchaseAmount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Paid</p>
                                    <p className="text-3xl font-bold text-green-600">৳{customer.paidAmount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Due Amount</p>
                                    <p className="text-3xl font-bold text-red-600">৳{customer.dueAmount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <Badge variant="default" className="text-lg px-4 py-1">
                                        {customer.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Add Payment Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus size={22} /> Add New Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddPayment} className="space-y-6">
                                <div>
                                    <Label>Payment Amount (৳)</Label>
                                    <Input
                                        type="number"
                                        value={form.paidAmount}
                                        onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Payment Method</Label>
                                    <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH">Cash</SelectItem>
                                            <SelectItem value="BKASH">bKash</SelectItem>
                                            <SelectItem value="CARD">Card</SelectItem>
                                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Transaction ID (Optional)</Label>
                                    <Input
                                        value={form.trxId}
                                        onChange={(e) => setForm({ ...form, trxId: e.target.value })}
                                        placeholder="bKash Ref / Bank Ref"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12" disabled={submitting}>
                                    {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Add Payment
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Payment History with Pagination */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Payment History ({payments.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {payments.length === 0 ? (
                                <p className="text-center py-12 text-gray-500">No payments found</p>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Trx ID</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedPayments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell>{new Date(payment.paymentDate).toLocaleDateString('en-GB')}</TableCell>
                                                    <TableCell className="font-bold">৳{payment.paidAmount}</TableCell>
                                                    <TableCell>{payment.paymentMethod}</TableCell>
                                                    <TableCell className="font-mono">{payment.trxId || '-'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={payment.status === 'SUCCEEDED' ? "default" : "destructive"}>
                                                            {payment.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="outline" size="sm" onClick={() => printReceipt(payment)}>
                                                            <Printer size={16} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-6">
                                            <Button
                                                variant="outline"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                            >
                                                Previous
                                            </Button>
                                            <span className="flex items-center px-4">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}