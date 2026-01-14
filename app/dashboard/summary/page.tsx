"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "@/lib/api";


interface DashboardData {
    totalPurchase: number;
    totalPaid: number;
    totalDue: number;
    paidPercent: number;
    totalCashbackPaid: number;
    totalConsumers: number;
    averagePurchase: number;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/dashboard/summary");
                setData(res.data);
            } catch (err) {
                console.error("Failed to load dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-emerald-700 text-2xl font-medium animate-pulse">Loading Dashboard...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-red-600 text-2xl font-medium">Failed to load data</div>
            </div>
        );
    }

    // Data for charts
    const summaryData = [
        { name: "Total Purchase", value: data.totalPurchase },
        { name: "Total Paid", value: data.totalPaid },
        { name: "Total Due", value: data.totalDue },
        { name: "Cashback Paid", value: data.totalCashbackPaid },
    ];

    const pieData = [
        { name: "Paid", value: data.totalPaid },
        { name: "Due", value: data.totalDue },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-4 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-lg text-emerald-700/80">
                        Real-time insights into purchases, payments & cashback
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Purchase"
                        value={`৳${data.totalPurchase.toLocaleString()}`}
                        icon="🛒"
                        color="emerald"
                    />
                    <StatCard
                        title="Total Paid"
                        value={`৳${data.totalPaid.toLocaleString()}`}
                        icon="💸"
                        color="teal"
                    />
                    <StatCard
                        title="Total Due"
                        value={`৳${data.totalDue.toLocaleString()}`}
                        icon="⚠️"
                        color="amber"
                    />
                    <StatCard
                        title="Paid %"
                        value={`${data.paidPercent.toFixed(1)}%`}
                        icon="📈"
                        color="green"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart - Overview */}
                    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6">
                        <h2 className="text-xl font-bold text-emerald-800 mb-6">Financial Overview</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={summaryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="value" fill="#10b981" name="Amount" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart - Paid vs Due */}
                    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6">
                        <h2 className="text-xl font-bold text-emerald-800 mb-6">Paid vs Due</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Extra Stats */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 text-center">
                        <p className="text-sm text-gray-600 mb-2">Total Consumers</p>
                        <p className="text-4xl font-bold text-emerald-700">{data.totalConsumers.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 text-center">
                        <p className="text-sm text-gray-600 mb-2">Cashback Paid</p>
                        <p className="text-4xl font-bold text-teal-700">
                            ৳{data.totalCashbackPaid.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 text-center">
                        <p className="text-sm text-gray-600 mb-2">Avg. Purchase</p>
                        <p className="text-4xl font-bold text-emerald-700">
                            ৳{data.averagePurchase.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
    const colorMap: Record<string, string> = {
        emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
        teal: "bg-teal-100 text-teal-800 border-teal-200",
        amber: "bg-amber-100 text-amber-800 border-amber-200",
        green: "bg-green-100 text-green-800 border-green-200",
    };

    return (
        <div className={`p-6 rounded-2xl shadow-lg border ${colorMap[color]} transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-80">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <span className="text-4xl opacity-70">{icon}</span>
            </div>
        </div>
    );
}