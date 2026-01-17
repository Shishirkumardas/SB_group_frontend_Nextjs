"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MasterDataForm from "@/components/MasterDataForm";

interface Area {
    id: number;
    name: string;
}

interface MasterData {
    id: number;
    name: string;
    area: Area;
    nid: number;
    phone: number | string;
    paymentMethod: string;
    date: string;
    purchaseAmount: number;
    paidAmount: number;
    dueAmount: number;
    cashBackAmount: number;
}

export default function MasterDataPage() {
    const [data, setData] = useState<MasterData[]>([]);
    const [filteredData, setFilteredData] = useState<MasterData[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(""); // empty = all dates
    const [loading, setLoading] = useState<boolean>(false); // ← FIXED: Added this!
    const API_URL = "http://localhost:8080/api/master-data";
    const router = useRouter();
    const [mounted, setMounted] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch data");
            const json = await res.json();
            setData(json);
            setFilteredData(json); // initially show all
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: number) => {
        if (!confirm("Are you sure you want to delete this record?")) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete item");
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);


    // Fetch all data once on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Filter data when selectedDate or data changes
    useEffect(() => {
        if (!selectedDate) {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) => {
                const itemDate = item.date.split("T")[0]; // YYYY-MM-DD
                return itemDate === selectedDate;
            });
            setFilteredData(filtered);
        }
    }, [selectedDate, data]);

    const parseAndFormatDate = (dateString: string | undefined): string => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "—"
            : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-3 tracking-tight">
                        📋 Master Data
                    </h1>
                    <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">
                        Manage and track all your master records in one place
                    </p>
                </div>

                {/* Filter + Form Section */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 mb-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Date Filter */}
                        <div className="flex items-center gap-4">
                            <label className="font-medium text-gray-700 whitespace-nowrap">
                                Filter by Date:
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-emerald-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate("")}
                                    className="text-sm text-emerald-600 hover:text-emerald-800 underline"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>

                        {/* Master Data Form */}
                        <div className="w-full md:w-auto">
                            <MasterDataForm onSuccess={fetchData} />
                        </div>
                    </div>
                </div>

                {/* Wide Table Container */}
                <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[1400px] w-full divide-y divide-emerald-100">
                            <thead className="bg-gradient-to-r from-emerald-700 to-teal-700">
                            <tr>
                                <th className="w-16 px-4 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="w-48 px-4 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="w-36 px-4 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Area
                                </th>
                                <th className="w-32 px-4 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    NID
                                </th>
                                <th className="w-40 px-4 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="w-44 px-4 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="w-36 px-4 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="w-40 px-4 py-5 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                    Purchase
                                </th>
                                <th className="w-40 px-4 py-5 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                    Cashback Due
                                </th>
                                <th className="w-80 px-4 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-emerald-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-16 text-center text-gray-500 text-lg font-medium animate-pulse">
                                        Loading records...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-16 text-center text-gray-500 text-lg font-medium">
                                        No records found {selectedDate ? `for ${selectedDate}` : ""}
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((d) => {
                                    const phoneStr = String(d.phone ?? "");

                                    return (
                                        <tr
                                            key={d.id}
                                            className="hover:bg-emerald-50 transition-colors duration-200"
                                        >
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {d.id}
                                            </td>
                                            <td className="px-4 py-5 text-sm text-gray-800">
                                                {d.name}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-center text-gray-700">
                                                {d.area?.name || "—"}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-center text-gray-700">
                                                {d.nid || "—"}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-center text-gray-700">
                                                {phoneStr || "—"}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-center text-gray-700">
                                                {d.paymentMethod || "—"}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-center text-gray-700">
                                                {parseAndFormatDate(d.date)}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-right font-medium text-emerald-700">
                                                {Number(d.purchaseAmount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-sm text-right font-medium text-amber-700">
                                                {Number(d.dueAmount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-center flex items-center justify-center gap-3 flex-wrap">
                                                {/* Cashback Details Button */}
                                                <button
                                                    onClick={() => router.push(`/cashback/${d.id}`)}
                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
                                                >
                                                    💰 Cashback Details
                                                </button>

                                                {/* Call Button */}
                                                {phoneStr && (
                                                    <button
                                                        onClick={() =>
                                                            fetch(
                                                                `http://localhost:8080/api/calls/call?phone=${encodeURIComponent(phoneStr)}`,
                                                                {
                                                                    method: "POST",
                                                                    credentials: "include",
                                                                }
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
                                                    >
                                                        📞 Call
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}