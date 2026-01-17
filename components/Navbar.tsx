"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { role, isLoading, refreshAuth, setRole } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false); // ✅ track client mount

    useEffect(() => {
        setMounted(true); // ✅ mark as mounted on client side
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            setRole(null);
            router.push("/login");
            refreshAuth(); // refresh auth state
        }
    };

    // ✅ Don't render anything until client-side
    if (!mounted) return null;

    if (isLoading)
        return (
            <nav className="p-4 bg-emerald-900 text-white text-center">
                Loading...
            </nav>
        );

    const isAuthenticated = role !== null;

    return (
        <nav className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl md:text-3xl font-bold flex items-center gap-2 hover:text-emerald-300 transition-colors"
                >
                    <span className="text-emerald-400">SB</span> Group
                </Link>

                <div className="flex items-center gap-10">
                    {role === "ADMIN" && (
                        <div className="flex items-center gap-6">
                            <Link href="/master-data" className="nav-link">
                                Master Data
                            </Link>
                            <Link href="/areas" className="nav-link">
                                Areas
                            </Link>
                            <Link href="/purchases" className="nav-link">
                                Purchases
                            </Link>
                            <Link href="/dashboard/summary" className="nav-link">
                                Dashboard
                            </Link>
                            <Link href="/area-daily-summary" className="nav-link">
                                Daily Summary
                            </Link>
                        </div>
                    )}
                    {role === "CUSTOMER" && (
                        <Link href="/customer" className="nav-link">
                            My Account
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-rose-600 to-red-700 px-5 py-2.5 rounded-lg font-medium hover:shadow-lg"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-emerald-200 hover:text-white font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 rounded-lg font-medium hover:shadow-lg"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
        .nav-link {
          @apply text-emerald-100 hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105 hover:underline underline-offset-4;
        }
      `}</style>
        </nav>
    );
}
