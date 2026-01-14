"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Payment {
    paymentDate: string;
    amount: number;
}

interface CashbackData {
    name: string;
    cashbackStatus: string;
    totalPurchase: number;
    purchaseDate: string;
    expectedMonthlyCashbackAmount: number;
    missedCashbackAmount: number;
    missedCashbackCount: number;
    nextDueDate: string;
}

export default function CashbackDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<CashbackData | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAll = async () => {
            try {
                const cashbackRes = await fetch(`http://localhost:8080/api/cashback/${id}`, {
                    credentials: "include",
                });
                if (!cashbackRes.ok) throw new Error("Cashback fetch failed");
                const cashbackJson = await cashbackRes.json();
                setData(cashbackJson);

                const paymentsRes = await fetch(`http://localhost:8080/api/cashback/${id}/payments`, {
                    credentials: "include",
                });
                if (!paymentsRes.ok) throw new Error("Payments fetch failed");
                const paymentsJson = await paymentsRes.json();
                setPayments(Array.isArray(paymentsJson) ? paymentsJson : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-emerald-700 text-xl font-medium animate-pulse">Loading cashback details...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-red-600 text-xl font-medium">Error loading cashback data</div>
            </div>
        );
    }

    const formatDate = (d?: string) =>
        d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3 tracking-tight">
                        💰 Cashback Details
                    </h1>
                    <p className="text-lg text-emerald-700/80">Track your rewards and payments</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden mb-10">
                    {/* Summary Section */}
                    <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                        <h2 className="text-2xl font-bold mb-6">Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                                <p className="text-sm opacity-80 mb-1">Name</p>
                                <p className="text-xl font-semibold">{data.name}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                                <p className="text-sm opacity-80 mb-1">Status</p>
                                <p className={`text-xl font-semibold ${data.cashbackStatus === "ACTIVE" ? "text-emerald-200" : "text-amber-200"}`}>
                                    {data.cashbackStatus}
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                                <p className="text-sm opacity-80 mb-1">Total Purchase</p>
                                <p className="text-xl font-semibold">{data.totalPurchase.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                            <p className="text-sm text-emerald-700 mb-1">Purchase Date</p>
                            <p className="text-lg font-medium text-gray-800">{formatDate(data.purchaseDate)}</p>
                        </div>

                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                            <p className="text-sm text-emerald-700 mb-1">Monthly Cashback</p>
                            <p className="text-lg font-medium text-emerald-800">{data.expectedMonthlyCashbackAmount.toLocaleString()}</p>
                        </div>

                        <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                            <p className="text-sm text-red-700 mb-1">Missed Cashback</p>
                            <p className="text-lg font-medium text-red-800">{data.missedCashbackAmount.toLocaleString()}</p>
                        </div>

                        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                            <p className="text-sm text-amber-700 mb-1">Missed Months</p>
                            <p className="text-lg font-medium text-amber-800">{data.missedCashbackCount}</p>
                        </div>

                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                            <p className="text-sm text-emerald-700 mb-1">Next Due Date</p>
                            <p className="text-lg font-medium text-emerald-800">{formatDate(data.nextDueDate)}</p>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                    <div className="p-6 bg-emerald-700 text-white">
                        <h3 className="text-xl font-bold">Payment History</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                            {payments.length > 0 ? (
                                payments.map((p, i) => (
                                    <tr key={i} className="hover:bg-emerald-50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(p.paymentDate)}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-right font-medium text-emerald-700">
                                            {p.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500 text-lg">
                                        No payments recorded yet
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-10 text-center">
                    <button
                        onClick={() => router.push(`/cashback/${id}/pay`)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:-translate-y-1"
                    >
                        ➕ Add Cashback Payment 💳
                    </button>
                </div>
            </div>
        </div>
    );
}