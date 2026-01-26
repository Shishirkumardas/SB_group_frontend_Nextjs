"use client";

import { JSX, useEffect, useState } from "react";
import { Loader2, AlertCircle, Truck, PackageCheck, ChevronDown } from "lucide-react";

interface OrderItem {
    productId: number;
    productName: string;
    category: string;
    imageUrl?: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
}

const ORDER_STATUSES = ["PLACED", "SHIPPED", "DELIVERED"];

const statusStyles: Record<string, { bg: string; text: string; icon: JSX.Element }> = {
    PLACED: {
        bg: "bg-amber-950/40 border border-amber-800/50",
        text: "text-amber-300",
        icon: <AlertCircle className="h-4 w-4" />,
    },
    SHIPPED: {
        bg: "bg-blue-950/40 border border-blue-800/50",
        text: "text-blue-300",
        icon: <Truck className="h-4 w-4" />,
    },
    DELIVERED: {
        bg: "bg-emerald-950/40 border border-emerald-700/50",
        text: "text-emerald-300",
        icon: <PackageCheck className="h-4 w-4" />,
    },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/admin/orders", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch orders");

            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, newStatus: string) => {
        if (!confirm(`Change status to ${newStatus}?`)) return;

        setUpdatingId(orderId);
        try {
            const res = await fetch(
                `http://localhost:8080/api/admin/orders/${orderId}/status?status=${newStatus}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Update failed");

            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );
        } catch {
            alert("Could not update status.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-950">
                <div className="text-center space-y-5">
                    <Loader2 className="h-16 w-16 animate-spin text-emerald-400 mx-auto" />
                    <p className="text-emerald-300 font-medium tracking-wide text-lg">
                        Loading orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950 text-emerald-100 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                {/* Header */}
                <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-emerald-100 tracking-tight">
                            Order Management
                        </h1>
                        <p className="mt-3 text-emerald-300/90 font-light text-lg">
                            {orders.length} order{orders.length !== 1 ? "s" : ""} •{" "}
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="bg-emerald-900/60 backdrop-blur-md shadow-lg rounded-full px-7 py-3.5 border border-emerald-700/50">
                        <span className="text-sm font-medium text-emerald-200">
                            {orders.filter((o) => o.status === "PLACED").length} pending
                        </span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-10 p-6 bg-red-950/60 border border-red-800/60 rounded-2xl flex items-center gap-4 text-red-300 shadow-xl">
                        <AlertCircle className="h-7 w-7 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Orders */}
                {orders.length === 0 ? (
                    <div className="bg-emerald-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-emerald-800/40">
                        <div className="mx-auto w-24 h-24 bg-emerald-950/50 rounded-full flex items-center justify-center mb-8 border border-emerald-700/30">
                            <PackageCheck className="h-12 w-12 text-emerald-500/70" />
                        </div>
                        <h3 className="text-3xl font-serif font-medium text-emerald-100 mb-4">
                            No orders yet
                        </h3>
                        <p className="text-emerald-300/80 max-w-lg mx-auto text-lg">
                            When customers place orders, they’ll appear here in real time.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-emerald-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-800/40 overflow-hidden hover:shadow-2xl hover:border-emerald-700/60 transition-all duration-300"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8 border-b border-emerald-800/50 gap-6">
                                    <div>
                                        <h3 className="text-2xl font-serif font-semibold text-emerald-100">
                                            Order #{order.id}
                                        </h3>
                                        <p className="text-sm text-emerald-400 mt-2">
                                            {new Date(order.orderDate).toLocaleString("en-US", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5 flex-wrap">
                                        <span
                                            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium ${statusStyles[order.status]?.bg} ${statusStyles[order.status]?.text}`}
                                        >
                                            {statusStyles[order.status]?.icon}
                                            {order.status}
                                        </span>

                                        <div className="text-right">
                                            <p className="text-sm text-emerald-400">Total</p>
                                            <p className="text-2xl font-bold text-emerald-50">
                                                ৳ {order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items + Status Update */}
                                <div className="p-6 sm:p-8">
                                    <div className="space-y-5">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.productId}
                                                className="flex items-center gap-5 bg-emerald-950/30 p-5 rounded-xl hover:bg-emerald-950/50 transition-all border border-emerald-800/30"
                                            >
                                                <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-emerald-950 flex-shrink-0 shadow-inner border border-emerald-800/40">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={`http://localhost:8080${item.imageUrl}`}
                                                            alt={item.productName}
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src =
                                                                    "/images/placeholder-fashion.jpg";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-emerald-600 text-xs font-medium">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-emerald-100 truncate text-lg">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-sm text-emerald-400 mt-1">
                                                        {item.category} • Qty: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="text-base font-semibold text-emerald-200 whitespace-nowrap">
                                                    ৳ {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status Update Controls */}
                                    <div className="mt-10 flex flex-col sm:flex-row justify-end items-center gap-6 border-t border-emerald-800/50 pt-8">
                                        <div className="text-base text-emerald-300">
                                            Current status:{" "}
                                            <span className="font-semibold text-emerald-100">{order.status}</span>
                                        </div>

                                        <div className="relative min-w-[180px]">
                                            <select
                                                value={order.status}
                                                disabled={updatingId === order.id}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="appearance-none bg-emerald-950 border border-emerald-700 rounded-full px-6 py-3.5 pr-12 text-sm font-medium text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner transition disabled:opacity-50 w-full"
                                            >
                                                {ORDER_STATUSES.map((status) => (
                                                    <option key={status} value={status} className="bg-emerald-950 text-emerald-100">
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400 pointer-events-none" />
                                        </div>

                                        {updatingId === order.id && (
                                            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}