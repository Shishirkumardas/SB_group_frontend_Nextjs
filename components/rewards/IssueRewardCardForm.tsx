'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Loader2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Customer {
    id: number;
    name: string;
    phone: string;
}

interface IssueRewardCardFormProps {
    onSuccess?: (customerId: string) => void;
}

export default function IssueRewardCardForm({ onSuccess }: IssueRewardCardFormProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [issuing, setIssuing] = useState(false);
    const [success, setSuccess] = useState(false);

    // Live Search with Debounce
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setCustomers([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:8080/api/shopping-mall-customer/search?query=${encodeURIComponent(searchQuery)}`,
                    { credentials: 'include' }
                );

                if (res.ok) {
                    const data = await res.json();
                    setCustomers(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const issueCard = async () => {
        if (!selectedCustomer) return;

        setIssuing(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/rewards/issue?customerId=${selectedCustomer.id}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (res.ok) {
                const data = await res.json();
                setSuccess(true);

                setTimeout(() => {
                    setSuccess(false);
                    setSelectedCustomer(null);
                    setSearchQuery('');
                    setCustomers([]);
                    onSuccess?.(selectedCustomer.id.toString());
                }, 2000);
            } else {
                alert("Failed to issue reward card");
            }
        } catch (err) {
            console.error(err);
            alert("Server error occurred");
        } finally {
            setIssuing(false);
        }
    };

    return (
        <Card className="border-0 shadow-2xl bg-white rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-emerald-100 p-4 rounded-2xl">
                        <UserPlus className="text-emerald-700" size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Issue Reward Card</h2>
                        <p className="text-slate-500">Search customer and issue loyalty card</p>
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative mb-8">
                    <div className="relative">
                        <Search className="absolute left-5 top-4 text-slate-400" size={20} />
                        <Input
                            placeholder="Search by customer name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-emerald-500"
                        />
                    </div>

                    {/* Live Search Dropdown */}
                    {customers.length > 0 && (
                        <div className="absolute z-50 w-full mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-auto">
                            {customers.map((customer) => (
                                <div
                                    key={customer.id}
                                    onClick={() => {
                                        setSelectedCustomer(customer);
                                        setSearchQuery('');
                                        setCustomers([]);
                                    }}
                                    className="px-6 py-5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b last:border-none"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">{customer.name}</p>
                                        <p className="text-sm text-slate-500">{customer.phone}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="rounded-xl">
                                        Select
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Customer Preview */}
                {selectedCustomer && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-emerald-600 text-sm font-medium">Selected Customer</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">{selectedCustomer.name}</p>
                                <p className="text-slate-600 mt-1">{selectedCustomer.phone}</p>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-slate-400 hover:text-red-500 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Issue Button */}
                <Button
                    onClick={issueCard}
                    disabled={!selectedCustomer || issuing}
                    className="w-full h-16 text-xl font-semibold bg-emerald-700 hover:bg-emerald-800 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {issuing ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            Issuing Reward Card...
                        </>
                    ) : success ? (
                        <>
                            <CheckCircle size={26} />
                            Reward Card Issued Successfully!
                        </>
                    ) : (
                        <>
                            <UserPlus size={26} />
                            Issue Reward Card
                        </>
                    )}
                </Button>

                {success && (
                    <p className="text-center text-emerald-600 font-medium mt-4">
                        🎉 Card has been successfully issued to the customer
                    </p>
                )}
            </CardContent>
        </Card>
    );
}