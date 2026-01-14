"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CashbackPaymentPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!id || !amount || !date) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`http://localhost:8080/api/cashback/${id}/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentDate: date,
                }),
            });

            if (!res.ok) {
                throw new Error("Payment failed");
            }

            router.push(`/cashback/${id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to save payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-lg">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-10 py-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            ➕ Cashback Payment
                        </h1>
                        <p className="mt-3 text-emerald-100/90 text-lg">
                            Record a new cashback payment
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 md:p-12 space-y-7">
                        {/* Payment Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount
                            </label>
                            <input
                                placeholder="Enter cashback amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                type="number"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={submit}
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mt-6 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Saving..." : "Save Payment"}
                        </button>
                    </div>
                </div>

                {/* Trust note */}
                <p className="mt-8 text-center text-sm text-emerald-700/70">
                    Payment will be processed securely • Thank you!
                </p>
            </div>
        </div>
    );
}