"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Transaction {
    paymentId?: string;
    trxId: string;
    transactionStatus: string;
    amount: string;
    currency: string;
    intent: string;
    merchantInvoiceNumber?: string;
    payerAccount?: string;
    payerReference?: string;
    payerType?: string;
    paymentExecuteTime?: string;
    maxRefundableAmount?: string;
    subMerchantName?: string;
    [key: string]: any; // for extra fields
}

export default function TransactionsDashboard() {
    const [trxId, setTrxId] = useState("");
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchTransaction = async () => {
        if (!trxId.trim()) {
            setError("Please enter a Transaction ID");
            return;
        }

        setLoading(true);
        setError(null);
        setTransaction(null);

        try {
            const res = await fetch(`http://localhost:8080/api/bkash/search?trxId=${encodeURIComponent(trxId.trim())}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || `Error ${res.status}`);
            }

            const data = await res.json();
            setTransaction(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch transaction");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || "";
        if (s === "completed") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <CheckCircle2 size={16} /> Completed
        </span>
            );
        }
        if (s.includes("failed") || s.includes("error")) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          <XCircle size={16} /> Failed
        </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
        <AlertCircle size={16} /> {status || "Unknown"}
      </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
                        Transaction Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Search and view details of all bKash transactions using Transaction ID (trxId)
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 mb-10">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label htmlFor="trxId" className="block text-sm font-medium text-gray-700 mb-2">
                                Transaction ID (trxId)
                            </label>
                            <div className="relative">
                                <input
                                    id="trxId"
                                    type="text"
                                    value={trxId}
                                    onChange={(e) => setTrxId(e.target.value.trim())}
                                    placeholder="e.g. DBF80OFHE8"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <button
                            onClick={searchTransaction}
                            disabled={loading || !trxId.trim()}
                            className={`px-8 py-3 rounded-xl font-medium text-white transition-all shadow-md
                ${loading || !trxId.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Searching...
                </span>
                            ) : (
                                "Search Transaction"
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                            {error}
                        </div>
                    )}
                </div>

                {/* Transaction Result */}
                {transaction ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-8 py-6">
                            <h2 className="text-2xl font-bold">Transaction Details</h2>
                            <p className="mt-1 opacity-90">
                                Trx ID: <span className="font-mono font-medium">{transaction.trxId}</span>
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="mt-1">{getStatusBadge(transaction.transactionStatus)}</div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="text-xl font-bold text-emerald-700 mt-1">
                                        ৳{Number(transaction.amount).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Payment ID</p>
                                    <p className="font-mono text-gray-800 mt-1 break-all">
                                        {transaction.paymentId || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Merchant Invoice</p>
                                    <p className="font-medium text-gray-800 mt-1">
                                        {transaction.merchantInvoiceNumber || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Payer Account</p>
                                    <p className="font-medium text-gray-800 mt-1">
                                        {transaction.payerAccount || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Executed At</p>
                                    <p className="font-medium text-gray-800 mt-1">
                                        {transaction.paymentExecuteTime || "—"}
                                    </p>
                                </div>

                                {transaction.payerReference && (
                                    <div>
                                        <p className="text-sm text-gray-500">Payer Reference</p>
                                        <p className="font-medium text-gray-800 mt-1">
                                            {transaction.payerReference}
                                        </p>
                                    </div>
                                )}

                                {transaction.maxRefundableAmount && (
                                    <div>
                                        <p className="text-sm text-gray-500">Max Refundable</p>
                                        <p className="font-medium text-amber-700 mt-1">
                                            ৳{Number(transaction.maxRefundableAmount).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    trxId.trim() && !loading && !error && (
                        <div className="text-center py-16 text-gray-500">
                            No transaction found for this ID. Try another trxId.
                        </div>
                    )
                )}

                {!trxId.trim() && !loading && (
                    <div className="text-center py-16 text-gray-600">
                        <Search className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-lg font-medium">Enter a Transaction ID above to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}