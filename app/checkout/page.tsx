"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { userId } = useAuth();

    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "bKash" | "Card">("COD");

    const [shippingName, setShippingName] = useState("");
    const [shippingPhone, setShippingPhone] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");

    useEffect(() => {
        if (!userId) {
            router.push("/account");
            return;
        }

        const savedData = localStorage.getItem("checkoutData"); // ✅ use correct key
        if (!savedData) {
            router.push("/cart");
            return;
        }

        const data = JSON.parse(savedData);

        setCheckoutData({
            cartItems: data.cartItems || [],
            subtotal: data.subtotal || 0,
            shippingEstimate: data.shippingEstimate || 0,
            total: data.total || 0,
            user: {
                name: data.name || "",
                phone: data.phone || "",
                address: data.address || "",
            },
        });

        // Pre-fill shipping info
        setShippingName(data.name || "");
        setShippingPhone(data.phone || "");
        setShippingAddress(data.address || "");

        setLoading(false);
    }, [userId, router]);


    const handleConfirmOrder = async () => {
        if (!shippingAddress.trim()) {
            setError("Please enter a shipping address");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`http://localhost:8082/api/orders/create?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(shippingAddress), // send only address string
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create order");
            }

            localStorage.removeItem("checkoutShipping");

            alert("Order placed successfully!");
            router.push("/order-success");
        } catch (err: any) {
            setError(err.message || "Checkout failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }

    if (!checkoutData || !checkoutData.cartItems) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">No checkout data found. Please go back to cart.</p>
            </div>
        );
    }

    const { cartItems, subtotal, shippingEstimate, total } = checkoutData;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="text-indigo-600 hover:underline flex items-center gap-2">
                        <ArrowLeft size={20} /> Back to Cart
                    </Link>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-xl font-medium mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {cartItems.length === 0 ? (
                                    <p className="text-gray-500">Your cart is empty.</p>
                                ) : (
                                    cartItems.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 border-b pb-4">
                                            <img
                                                src={item.product.imageUrl ? `http://localhost:8082${item.product.imageUrl}` : "/placeholder.jpg"}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-gray-600">
                                                    ৳ {item.price.toLocaleString()} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-medium">
                                                ৳ {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-4 text-right">
                                <Link href="/cart" className="text-indigo-600 hover:underline">
                                    Edit Order →
                                </Link>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Cash on Delivery", value: "COD" },
                                    { label: "bKash", value: "bKash" },
                                    { label: "Card", value: "Card" },
                                ].map(method => (
                                    <label key={method.value} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.value}
                                            checked={paymentMethod === method.value}
                                            onChange={() => setPaymentMethod(method.value as any)}
                                            className="h-5 w-5 text-black"
                                        />
                                        <span>{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary + Shipping */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6">
                            <h2 className="text-xl font-medium mb-6">Summary & Shipping</h2>

                            {/* Shipping Info */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={shippingName}
                                        onChange={e => setShippingName(e.target.value)}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={shippingPhone}
                                        onChange={e => setShippingPhone(e.target.value)}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Shipping Address</label>
                                    <textarea
                                        rows={3}
                                        value={shippingAddress}
                                        onChange={e => setShippingAddress(e.target.value)}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-black resize-none"
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>৳ {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>৳ {shippingEstimate.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>৳ {total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmOrder}
                                disabled={submitting}
                                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-900 transition disabled:opacity-50"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Confirming...
                                    </span>
                                ) : (
                                    "Confirm Order"
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                Secure checkout • Cash on Delivery available
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
