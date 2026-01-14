"use client";

import { useEffect, useState } from "react";

interface Purchase {
    date: string;
    purchaseAmount: number;
}

export default function PurchasePage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    const fetchPurchases = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/master-data/purchases", {
                credentials: "include", // Add this if authentication is required
            });
            if (!res.ok) throw new Error("Failed to fetch purchases");
            const data = await res.json();
            setPurchases(data);
        } catch (err) {
            console.error("Error fetching purchases:", err);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-3 tracking-tight">
                        🛒 Purchase History
                    </h1>
                    <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">
                        Track all your purchases in one beautiful place
                    </p>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-emerald-100">
                            <thead className="bg-gradient-to-r from-emerald-700 to-teal-700">
                            <tr>
                                <th className="w-1/2 px-8 py-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="w-1/2 px-8 py-6 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                    Purchase Amount
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-emerald-50">
                            {purchases.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-8 py-16 text-center text-gray-500 text-lg font-medium"
                                    >
                                        No purchases recorded yet
                                    </td>
                                </tr>
                            ) : (
                                purchases.map((p, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-emerald-50 transition-colors duration-200"
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-800 font-medium">
                                            {new Date(p.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-lg font-semibold text-emerald-700">
                                            {p.purchaseAmount.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Optional footer note */}
                <div className="mt-8 text-center text-sm text-emerald-700/70">
                    Showing all recorded purchases • Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}