"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function TransactionSearch() {
    const [trxId, setTrxId] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!trxId.trim()) {
            setError("Please enter a Transaction ID");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`http://localhost:8080/api/bkash/search?trxId=${encodeURIComponent(trxId.trim())}`, {
                credentials: "include", // sends cookies/JWT
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to fetch transaction");
            }

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Search bKash Transaction</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.trim())}
                    placeholder="Enter trxId (e.g. DBF80OFHE8)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading || !trxId.trim()}
                    className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${
                        loading || !trxId.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Searching...
            </span>
                    ) : (
                        <>
                            <Search size={18} className="inline mr-2" />
                            Search
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
                    <div className="bg-emerald-700 text-white px-6 py-4">
                        <h2 className="text-xl font-semibold">Transaction Found</h2>
                        <p className="text-sm opacity-90 mt-1">Trx ID: {result.trxId}</p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-bold text-lg mt-1">
                                {result.transactionStatus === "Completed" ? (
                                    <span className="text-green-600 flex items-center gap-2">
                    <CheckCircle2 size={20} /> Completed
                  </span>
                                ) : (
                                    <span className="text-red-600 flex items-center gap-2">
                    <AlertCircle size={20} /> {result.transactionStatus}
                  </span>
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="text-xl font-bold text-emerald-700 mt-1">
                                ৳ {Number(result.amount || 0).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Payment ID</p>
                            <p className="font-mono mt-1 break-all">{result.paymentId || "—"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Merchant Invoice</p>
                            <p className="font-medium mt-1">{result.merchantInvoiceNumber || "—"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Payer Account</p>
                            <p className="font-medium mt-1">{result.payerAccount || "—"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Executed At</p>
                            <p className="font-medium mt-1">{result.paymentExecuteTime || "—"}</p>
                        </div>

                        {result.payerReference && (
                            <div>
                                <p className="text-sm text-gray-500">Payer Reference</p>
                                <p className="font-medium mt-1">{result.payerReference}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}