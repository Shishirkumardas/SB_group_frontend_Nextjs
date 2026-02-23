"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pay = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/customer/pay?masterDataId=${id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to initiate payment");
            }

            const data = await response.json();

            // Assuming backend returns { bkashURL: "https://bkash.com/..." } from bKash response
            if (data.bkashURL) {
                // Redirect to bKash payment gateway
                window.location.href = data.bkashURL;
            } else {
                throw new Error("No payment URL received from backend");
            }
        } catch (err: any) {
            console.error("Payment initiation failed:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-10 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Confirm Payment
                    </h1>
                    <p className="mt-3 text-emerald-100/90 text-lg">
                        You're about to complete the payment for order #{id}
                    </p>
                </div>

                {/* Content */}
                <div className="p-10 text-center space-y-8">
                    <div className="text-6xl animate-bounce">💳</div>

                    <p className="text-xl text-gray-700 font-medium">
                        Are you ready to process this payment?
                    </p>

                    {error && (
                        <p className="text-red-600 font-medium mb-4">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={pay}
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Pay Now"
                        )}
                    </button>

                    <p className="text-sm text-emerald-700/70">
                        This action cannot be undone after confirmation
                    </p>
                </div>
            </div>
        </div>
    );
}