"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        imageUrl: string;
    };
}

interface User {
    id: string;
    name?: string;
    phone?: string;
    address?: string;
}

export default function CartPage() {
    const { userId, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [useDifferentAddress, setUseDifferentAddress] = useState(false);
    const [shippingName, setShippingName] = useState("");
    const [shippingPhone, setShippingPhone] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");

    useEffect(() => {
        if (!userId) {
            setError("Please log in to view your cart");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                const userRes = await fetch("http://localhost:8080/api/auth/profile", {
                    credentials: "include",
                });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                    setShippingName(userData.name || "");
                    setShippingPhone(userData.phone || "");
                    setShippingAddress(userData.address || "");
                }

                const cartRes = await fetch("http://localhost:8080/api/cart", {
                    credentials: "include",
                });
                if (!cartRes.ok) throw new Error("Failed to load cart");

                const cartData = await cartRes.json();
                setCartItems(cartData || []);
            } catch (err: any) {
                setError(err.message || "Could not load your cart");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const finalShippingAddress = useDifferentAddress
        ? shippingAddress.trim()
        : (user?.address?.trim() || "");

    const isInsideDhaka = finalShippingAddress.toLowerCase().includes("dhaka");
    const shippingEstimate = isInsideDhaka ? 60 : 130;
    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const total = subtotal + shippingEstimate;

    const updateQuantity = async (itemId: number, delta: number) => {
        const item = cartItems.find(i => i.id === itemId);
        if (!item) return;

        const newQty = Math.max(1, item.quantity + delta);

        try {
            const res = await fetch("http://localhost:8080/api/cart/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId, quantity: newQty }),
            });

            if (res.ok) {
                setCartItems(prev =>
                    prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i)
                );
            } else {
                alert("Failed to update quantity");
            }
        } catch (err) {
            alert("Could not update quantity");
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/cart/remove/${itemId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setCartItems(prev => prev.filter(i => i.id !== itemId));
            } else {
                alert("Failed to remove item");
            }
        } catch (err) {
            alert("Could not remove item");
        }
    };

    const proceedToCheckout = () => {
        if (!userId) {
            router.push("/login");
            return;
        }

        if (useDifferentAddress && !shippingAddress.trim()) {
            setError("Please provide a shipping address");
            return;
        }

        if (!useDifferentAddress && !user?.address?.trim()) {
            setError("No saved address found. Please add an address in your profile.");
            return;
        }

        const checkoutData = {
            cartItems,
            subtotal,
            shippingEstimate,
            total,
            name: useDifferentAddress ? shippingName : user?.name || "",
            phone: useDifferentAddress ? shippingPhone : user?.phone || "",
            address: useDifferentAddress ? shippingAddress : user?.address || "",
            useDifferent: useDifferentAddress,
        };

        localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
        router.push("/checkout");
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-950">
                <div className="text-center space-y-5">
                    <Loader2 className="h-14 w-14 animate-spin text-emerald-400 mx-auto" />
                    <p className="text-emerald-300 font-medium text-lg">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-950 px-4">
                <div className="text-center max-w-md">
                    <ShoppingBag className="h-20 w-20 mx-auto text-emerald-600/70 mb-6" />
                    <h2 className="mt-6 text-2xl font-medium text-emerald-100">{error}</h2>
                    <Link
                        href="/login"
                        className="mt-8 inline-block bg-emerald-700 hover:bg-emerald-600 text-white px-10 py-4 rounded-full transition text-lg font-medium shadow-lg"
                    >
                        Log in to view cart
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-serif font-bold text-emerald-100 mb-12 text-center md:text-left tracking-tight">
                    Your Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-emerald-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-emerald-800/40">
                        <ShoppingBag className="h-24 w-24 mx-auto text-emerald-500/60 mb-8" />
                        <h2 className="text-3xl font-serif font-medium text-emerald-100 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-emerald-300/80 mb-10 max-w-md mx-auto text-lg">
                            Looks like you haven't added anything yet.
                        </p>
                        <Link
                            href="/jewellery"
                            className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-5 rounded-full transition text-xl font-medium shadow-xl"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map(item => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row gap-6 bg-emerald-900/40 backdrop-blur-md p-6 rounded-2xl border border-emerald-800/40 hover:border-emerald-700/60 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-full sm:w-40 h-48 bg-emerald-950 rounded-xl overflow-hidden flex-shrink-0 border border-emerald-800/50 shadow-inner">
                                        <img
                                            src={item.product.imageUrl ? `http://localhost:8080${item.product.imageUrl}` : "/images/placeholder-product.jpg"}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <Link
                                            href={`/jewellery/${item.product.id}`}
                                            className="text-xl font-medium text-emerald-100 hover:text-emerald-300 transition line-clamp-2"
                                        >
                                            {item.product.name}
                                        </Link>

                                        <p className="text-emerald-300 font-medium mt-3 text-lg">
                                            ৳ {item.price.toLocaleString()}
                                        </p>

                                        <div className="flex items-center gap-8 mt-8">
                                            <div className="flex items-center border border-emerald-700 rounded-full bg-emerald-950/60">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-5 py-3 hover:bg-emerald-900/50 disabled:opacity-40 text-emerald-300"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="px-8 py-3 font-medium min-w-[4rem] text-center text-emerald-100 text-lg">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-5 py-3 hover:bg-emerald-900/50 text-emerald-300"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-300 flex items-center gap-2 text-base transition"
                                            >
                                                <Trash2 size={20} />
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right font-medium text-xl min-w-[140px] self-center text-emerald-100">
                                        ৳ {(item.quantity * item.price).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary + Shipping Address Option */}
                        <div className="lg:col-span-1">
                            <div className="bg-emerald-900/40 backdrop-blur-md rounded-2xl border border-emerald-800/40 p-8 sticky top-6 shadow-xl">
                                <h2 className="text-2xl font-serif font-medium text-emerald-100 mb-8">Order Summary</h2>

                                {/* Shipping Address Option */}
                                <div className="mb-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useDifferentAddress}
                                            onChange={() => setUseDifferentAddress(!useDifferentAddress)}
                                            className="h-5 w-5 rounded border-emerald-600 text-emerald-600 focus:ring-emerald-500 bg-emerald-950"
                                        />
                                        <span className="text-emerald-300 font-medium text-base">
                                            Use a different shipping address
                                        </span>
                                    </label>

                                    {useDifferentAddress && (
                                        <div className="mt-6 space-y-6">
                                            <div>
                                                <label className="block text-sm text-emerald-400 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={shippingName}
                                                    onChange={e => setShippingName(e.target.value)}
                                                    className="w-full p-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="Enter full name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-emerald-400 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={shippingPhone}
                                                    onChange={e => setShippingPhone(e.target.value)}
                                                    className="w-full p-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="Enter phone number"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-emerald-400 mb-2">Shipping Address</label>
                                                <textarea
                                                    rows={4}
                                                    value={shippingAddress}
                                                    onChange={e => setShippingAddress(e.target.value)}
                                                    className="w-full p-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-y"
                                                    placeholder="House, Road, Area, City"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between text-emerald-300 text-base">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="text-emerald-100">৳ {subtotal.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between text-emerald-300 text-base">
                                        <span>Shipping Fee</span>
                                        <span className={isInsideDhaka ? "text-emerald-400" : "text-amber-400"}>
                                            ৳ {shippingEstimate.toLocaleString()}
                                            {isInsideDhaka ? " (Inside Dhaka)" : " (Outside Dhaka)"}
                                        </span>
                                    </div>

                                    <div className="border-t border-emerald-800/50 pt-5 mt-3">
                                        <div className="flex justify-between text-xl font-medium text-emerald-50">
                                            <span>Total</span>
                                            <span>৳ {total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={proceedToCheckout}
                                    disabled={cartItems.length === 0 || (useDifferentAddress && !shippingAddress.trim())}
                                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-5 rounded-full text-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="text-center text-sm text-emerald-400/80 mt-5">
                                    Taxes and final shipping calculated at checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}