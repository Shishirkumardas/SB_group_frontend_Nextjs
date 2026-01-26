"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Package, MapPin, Phone, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
}

interface UserProfile {
    id: string | number;
    name: string;
    phone: string;
    address: string;
    email: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { userId, role, refreshAuth, isLoading: authLoading } = useAuth();

    const [user, setUser] = useState<UserProfile>({
        id: "",
        name: "Loading...",
        phone: "",
        address: "",
        email: "",
    });

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Fetch user data & orders when userId is available
    useEffect(() => {
        if (!userId) {
            router.replace("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch current user from /me (includes id, name, phone, address, email)
                const userRes = await fetch("http://localhost:8080/api/auth/profile", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!userRes.ok) {
                    throw new Error(`Failed to load profile: ${userRes.status}`);
                }

                const userData = await userRes.json();

                setUser({
                    id: userData.id,
                    name: userData.name || userData.fullName || "User",
                    phone: userData.phone || "",
                    address: userData.address || "",
                    email: userData.email || "",
                });

                // Optional: Fetch orders
                try {
                    const ordersRes = await fetch(
                        `http://localhost:8080/api/orders?userId=${userId}`,
                        {
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                    if (ordersRes.ok) {
                        const data = await ordersRes.json();
                        setOrders(Array.isArray(data) ? data : []);
                    }
                } catch (err) {
                    console.warn("orders fetch failed:", err);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load profile");
                console.error("Profile error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, router]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const payload = {
                id: user.id,
                name: user.name,
                phone: user.phone,
                address: user.address,
            };

            const res = await fetch("http://localhost:8080/api/users/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Update failed");
            }

            alert("Profile updated successfully!");
            await refreshAuth(); // refresh context after save
        } catch (err: any) {
            setError(err.message || "Could not save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            refreshAuth();
            router.push("/login");
        } catch (err) {
            console.error("Logout failed:", err);
            router.push("/login");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-black" />
            </div>
        );
    }

    if (error || !userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-10 bg-white rounded-xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-700 mb-6">{error || "Please log in to view your profile"}</p>
                    <Link href="/login" className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900">
                        Log In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-serif font-medium">My Account</h1>
                        <p className="text-gray-600 mt-1">Manage your profile and orders</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition font-medium"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <UserIcon size={36} className="text-gray-500" />
                                </div>
                                <h2 className="text-xl font-medium">{user.name}</h2>
                                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-gray-500" />
                                    <span>{user.phone || "—"}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-500 mt-0.5" />
                                    <span>{user.address || "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Edit Profile */}
                        <div className="bg-white rounded-2xl shadow-sm border p-7">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                                <UserIcon size={20} />
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black"
                                        value={user.phone}
                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600 mb-1.5">Delivery Address</label>
                                    <textarea
                                        rows={3}
                                        className="w-full border rounded-lg px-4 py-2.5 resize-none focus:ring-2 focus:ring-black focus:border-black"
                                        value={user.address}
                                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Recent orders */}
                        <div className="bg-white rounded-2xl shadow-sm border p-7">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                                <Package size={20} />
                                Recent Orders
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Package className="h-12 w-12 mx-auto mb-4 opacity-40" />
                                    <p>No orders found.</p>
                                    <Link href="/jewellery" className="text-black underline mt-2 inline-block">
                                        Start shopping →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {orders.slice(0, 5).map((order) => (
                                        <div
                                            key={order.id}
                                            className="border rounded-xl p-5 hover:border-gray-300 transition"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-medium">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        order.status === "DELIVERED"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : order.status === "SHIPPED"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="font-medium text-lg">
                                                ৳ {order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}

                                    {orders.length > 5 && (
                                        <div className="text-center mt-4">
                                            <Link href="/orders" className="text-black hover:underline">
                                                View all orders →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}