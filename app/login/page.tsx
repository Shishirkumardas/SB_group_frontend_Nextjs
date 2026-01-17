"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { refreshAuth } = useAuth(); // ✅ Get refreshAuth from context
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // 🔥 important for cookie
                body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                setError(err.error || "Invalid email or password");
                return;
            }

            const data = await res.json();

            // 🔥 Refresh auth context so Navbar updates immediately
            await refreshAuth();

            // Redirect based on role
            if (data.role === "ADMIN") {
                router.push("/dashboard/summary");
            } else {
                router.push("/customer");
            }

            router.refresh();
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-10 py-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="mt-3 text-emerald-100/90 text-lg">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 md:p-12 space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-gray-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={login}
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        {/* Signup Link */}
                        <div className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Trust note */}
                <p className="mt-8 text-center text-sm text-emerald-700/70">
                    Secure login • Your data is protected
                </p>
            </div>
        </div>
    );
}
