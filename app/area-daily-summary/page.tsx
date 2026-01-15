"use client";

import { useEffect, useState } from "react";

interface AreaSummaryDTO {
    areaId: number;
    areaName: string;
    totalPurchase: number | null;
    totalQuantity: number | null;
    cashbackQuantity: number | null;
    totalCashback: number | null;
}

export default function AreaDailySummaryPage() {
    const today = new Date().toISOString().split("T")[0];

    const [date, setDate] = useState<string>(today);
    const [data, setData] = useState<AreaSummaryDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async (selectedDate: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `http://localhost:8080/api/areas/area-summary/daily?date=${selectedDate}`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const json = await res.json();
            setData(json);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to load daily summary");
        } finally {
            setLoading(false);
        }
    };

    // Run only once on mount → load today's data automatically
    useEffect(() => {
        fetchSummary(today);
    }, []); // ← Empty array = safe & correct (runs once)

    // Filter out areas with zero/null in ALL financial columns
    const filteredData = data.filter((item) => {
        const purchase = item.totalPurchase ?? 0;
        const quantity = item.totalQuantity ?? 0;
        const cashbackQty = item.cashbackQuantity ?? 0;
        const cashback = item.totalCashback ?? 0;

        return purchase > 0 || quantity > 0 || cashbackQty > 0 || cashback > 0;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-4 tracking-tight">
                        📅 Daily Area Summary
                    </h1>
                    <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">
                        View area-wise purchase, quantity, and cashback for any selected date
                    </p>
                </div>

                {/* Date Picker + Fetch Button (manual trigger only) */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 mb-12">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-4">
                            <label className="font-medium text-gray-700 whitespace-nowrap">
                                Select Date:
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border border-emerald-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                            />
                        </div>

                        <button
                            onClick={() => fetchSummary(date)}
                            disabled={loading}
                            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:-translate-y-1"
                            }`}
                        >
                            {loading ? "Loading..." : "Fetch Summary"}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center text-emerald-700 text-xl font-medium animate-pulse mb-8">
                        Loading daily summary...
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl mb-8 text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Table - Only show if filtered data has rows */}
                {!loading && filteredData.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-emerald-100">
                                <thead className="bg-gradient-to-r from-emerald-700 to-teal-700">
                                <tr>
                                    <th className="px-8 py-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                        Area
                                    </th>
                                    <th className="px-8 py-6 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                        Total Sold Package
                                    </th>
                                    <th className="px-8 py-6 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                        Total Purchase
                                    </th>
                                    <th className="px-8 py-6 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                        Cashback Quantity
                                    </th>
                                    <th className="px-8 py-6 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                        Total Cashback
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-emerald-50 bg-white">
                                {filteredData.map((item) => (
                                    <tr
                                        key={item.areaId}
                                        className="hover:bg-emerald-50 transition-colors duration-200"
                                    >
                                        <td className="px-8 py-6 font-medium text-gray-900">
                                            {item.areaName}
                                        </td>
                                        <td className="px-8 py-6 text-right text-lg font-semibold text-teal-700">
                                            {(item.totalQuantity ?? 0).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-right text-lg font-semibold text-emerald-700">
                                            ৳{(item.totalPurchase ?? 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                        </td>
                                        <td className="px-8 py-6 text-right text-lg font-semibold text-teal-700">
                                            {(item.cashbackQuantity ?? 0).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-right text-lg font-semibold text-amber-700">
                                            ৳{(item.totalCashback ?? 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty / No Active Areas State */}
                {!loading && filteredData.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-12 text-center text-gray-600 text-xl font-medium">
                        {data.length > 0
                            ? "No areas have activity (purchase/quantity/cashback > 0) for the selected date."
                            : "No data found for the selected date."}
                    </div>
                )}
            </div>
        </div>
    );
}