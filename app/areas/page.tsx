"use client";

import { useEffect, useState } from "react";
import AreaForm from "@/components/AreaForm";

interface Area {
    id: number;
    name: string;
    purchaseAmount: string;
    paidAmount: string;
    dueAmount: string;
    CashbackAmount:string;
    PackageQuantity: string;
}

export default function AreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const API_URL = "http://localhost:8080/api/areas";

    const fetchAreas = async () => {
        try {
            const res = await fetch(API_URL, {
                credentials: "include", // REQUIRED for auth cookie
            });

            if (!res.ok) throw new Error("Failed to fetch areas");

            const data = await res.json();
            setAreas(data);
        } catch (err) {
            console.error("Error fetching areas:", err);
        }
    };

    const deleteArea = async (id: number) => {
        if (!confirm(`Are you sure you want to delete area #${id}?`)) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete area");

            fetchAreas();
        } catch (err) {
            console.error("Error deleting area:", err);
            alert("Failed to delete area");
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-3 tracking-tight">
                        📍 Areas Management
                    </h1>
                    <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">
                        View, add, and manage all your areas in one place
                    </p>
                </div>

                {/* Form Section */}
                <div className="mb-12">
                    <AreaForm onSuccess={fetchAreas} />
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[1200px] w-full divide-y divide-emerald-100">
                            <thead className="bg-gradient-to-r from-emerald-700 to-teal-700">
                            <tr>
                                <th className="w-20 px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="w-64 px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="w-48 px-6 py-5 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                    Package Quantity
                                </th>
                                <th className="w-48 px-6 py-5 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                    Purchase Amount
                                </th>
                                <th className="w-48 px-6 py-5 text-right text-sm font-semibold text-white uppercase tracking-wider">
                                    Cashback Amount
                                </th>
                                {/*<th className="w-48 px-6 py-5 text-right text-sm font-semibold text-white uppercase tracking-wider">*/}
                                {/*    Due Amount*/}
                                {/*</th>*/}
                                <th className="w-40 px-6 py-5 text-center text-sm font-semibold text-white uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-emerald-50">
                            {areas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500 text-lg font-medium">
                                        No areas found
                                    </td>
                                </tr>
                            ) : (
                                areas.map((area) => (
                                    <tr
                                        key={area.id}
                                        className="hover:bg-emerald-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {area.id}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-800">
                                            {area.name}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-right font-medium text-emerald-700">
                                            {Number(area.PackageQuantity).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-right font-medium text-emerald-700">
                                            {Number(area.purchaseAmount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-right font-medium text-emerald-700">
                                            {Number(area.CashbackAmount).toLocaleString()}
                                        </td>
                                        {/*<td className="px-6 py-5 whitespace-nowrap text-sm text-right font-medium text-amber-700">*/}
                                        {/*    {Number(area.dueAmount).toLocaleString()}*/}
                                        {/*</td>*/}
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => deleteArea(area.id)}
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-red-700 hover:to-rose-700 transition-all shadow-sm hover:shadow-md"
                                            >
                                                ❌ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}