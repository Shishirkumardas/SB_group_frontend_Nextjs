"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
}

export default function OrdersPage() {
    const router = useRouter();
    const { userId, isLoading: authLoading } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            router.replace("/account");
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `http://localhost:8082/api/orders?userId=${userId}`,
                    { credentials: "include", cache: "no-store" }
                );

                if (!res.ok) throw new Error(`Failed to load orders: ${res.status}`);

                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("orders fetch failed:", err);
                setError(err.message || "Could not load your orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-black" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Orders</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <Link
                        href="/sb-group-frontend/public"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-serif font-medium mb-8 text-center sm:text-left">
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                        <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                        <h2 className="text-2xl font-medium mb-3">No orders yet</h2>
                        <p className="text-gray-600 mb-8">
                            When you place an order, it will appear here.
                        </p>
                        <Link
                            href="/sb-group-frontend/public"
                            className="inline-block bg-black text-white px-10 py-4 rounded-full hover:bg-gray-900 transition text-lg font-medium"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                    <div>
                                        <p className="font-medium text-lg">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(order.orderDate).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                                            order.status === "DELIVERED"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "PENDING" || order.status === "PROCESSING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : order.status === "SHIPPED"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center border-t pt-4 mt-2">
                                    <p className="text-lg font-medium">
                                        ৳ {order.totalAmount.toLocaleString()}
                                    </p>

                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-black hover:underline text-sm font-medium flex items-center gap-1.5"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}