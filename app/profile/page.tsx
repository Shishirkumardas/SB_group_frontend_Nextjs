"use client";

import { useEffect, useState } from "react";
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
    const { userId, refreshAuth, isLoading: authLoading } = useAuth();

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

                // Fetch current user from /me
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

                // Fetch orders
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

            alert("প্রোফাইল সফলভাবে আপডেট হয়েছে! / Profile updated successfully!");
            await refreshAuth();
        } catch (err: any) {
            setError(err.message || "প্রোফাইল আপডেট করা যায়নি / Could not save profile");
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error || !userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md border border-emerald-100">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">প্রবেশাধিকার অস্বীকৃত / Access Denied</h2>
                    <p className="text-gray-700 mb-6">{error || "প্রোফাইল দেখতে লগইন করুন / Please log in to view your profile"}</p>
                    <Link href="/login" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition">
                        লগইন করুন / Log In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">
                            আমার অ্যাকাউন্ট / My Account
                        </h1>
                        <p className="text-lg text-emerald-700/80 mt-2">
                            আপনার প্রোফাইল এবং অর্ডার পরিচালনা করুন / Manage your profile and orders
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl transition font-medium shadow-sm"
                    >
                        <LogOut size={18} />
                        লগআউট / Logout
                    </button>
                </div>

                {error && (
                    <div className="mb-10 p-5 bg-red-50 border border-red-200 text-red-800 rounded-2xl shadow-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 sticky top-6">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                    <UserIcon size={48} className="text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-800">{user.name}</h2>
                                <p className="text-gray-600 mt-1">{user.email}</p>
                            </div>

                            <div className="space-y-5 text-gray-700">
                                <div className="flex items-center gap-4">
                                    <Phone size={20} className="text-emerald-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">ফোন / Phone</p>
                                        <p className="font-medium">{user.phone || "—"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin size={20} className="text-emerald-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">ঠিকানা / Address</p>
                                        <p className="font-medium">{user.address || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Edit Profile */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
                            <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                                <UserIcon size={24} className="text-emerald-600" />
                                ব্যক্তিগত তথ্য / Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        পুরো নাম / Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ফোন নম্বর / Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-5 py-3.5 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                        value={user.phone}
                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ডেলিভারি ঠিকানা / Delivery Address
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-5 py-3.5 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50 resize-none"
                                        value={user.address}
                                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mt-10">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            সংরক্ষণ করা হচ্ছে... / Saving...
                                        </>
                                    ) : (
                                        "পরিবর্তন সংরক্ষণ করুন / Save Changes"
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
                            <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                                <Package size={24} className="text-emerald-600" />
                                সাম্প্রতিক অর্ডার / Recent Orders
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16 text-gray-600">
                                    <Package className="h-16 w-16 mx-auto mb-6 opacity-40 text-emerald-600" />
                                    <p className="text-lg font-medium">কোনো অর্ডার পাওয়া যায়নি / No orders found.</p>
                                    <Link href="/jewellery" className="mt-4 inline-block text-emerald-600 hover:underline font-medium">
                                        কেনাকাটা শুরু করুন → / Start shopping →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.slice(0, 5).map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-emerald-100 rounded-2xl p-6 hover:border-emerald-300 transition-all bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-semibold text-lg text-emerald-800">
                                                        অর্ডার #{order.id}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {new Date(order.orderDate).toLocaleDateString("en-GB", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
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
                                            <p className="text-xl font-bold text-emerald-700">
                                                ৳ {order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}

                                    {orders.length > 5 && (
                                        <div className="text-center mt-8">
                                            <Link href="/orders" className="text-emerald-600 hover:text-emerald-800 font-medium underline">
                                                সব অর্ডার দেখুন → / View all orders →
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