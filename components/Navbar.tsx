"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "CUSTOMER" | null;

function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;

    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

    return match ? match.split("=")[1] : null;
}

export default function Navbar() {
    const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const loadMe = async () => {
            const token = getTokenFromCookie();

            if (!token) {
                setRole(null);
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (res.ok) {
                    const data = await res.json();
                    if (["ADMIN", "CUSTOMER"].includes(data.role)) {
                        setRole(data.role);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadMe();
    }, [reload]);

    const logout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Logout failed:", e);
        }

        setRole(null);
        setReload((prev) => prev + 1);
        router.push("/login");
        router.refresh();
    };

    if (isLoading) {
        return (
            <nav className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
                <div className="container mx-auto px-6 py-5 flex justify-center">
                    <span className="text-lg font-medium animate-pulse">Loading...</span>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white shadow-2xl border-b border-emerald-700/40 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand / Logo */}
                <Link
                    href="/"
                    className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 hover:text-emerald-300 transition-colors duration-300"
                >
                    <span className="text-emerald-400">SB</span> Group
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-10">
                    {/*{role === "ADMIN" && (*/}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                href="/master-data"
                                className="text-emerald-100 hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105 hover:underline underline-offset-4"
                            >
                                Master Data
                            </Link>
                            <Link
                                href="/areas"
                                className="text-emerald-100 hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105 hover:underline underline-offset-4"
                            >
                                Areas
                            </Link>
                            <Link
                                href="/purchases"
                                className="text-emerald-100 hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105 hover:underline underline-offset-4"
                            >
                                Purchases
                            </Link>
                            <Link
                                href="/dashboard/summary"
                                className="text-emerald-100 hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105 hover:underline underline-offset-4"
                            >
                                Dashboard
                            </Link>
                        </div>
                    {/*)}*/}

                    {role === "CUSTOMER" && (
                        <Link
                            href="/customer"
                            className="text-emerald-100 hover:text-emerald-300 font-medium transition-all duration-300 hover:scale-105 hover:underline underline-offset-4"
                        >
                            My Account
                        </Link>
                    )}
                </div>

                {/* Right Side - Auth Actions */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={logout}
                        className="bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Logout
                    </button>
                    {/*{role ? (*/}
                    {/*    <button*/}
                    {/*        onClick={logout}*/}
                    {/*        className="bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"*/}
                    {/*    >*/}
                    {/*        Logout*/}
                    {/*    </button>*/}
                    {/*) : (*/}
                    {/*    <div className="flex items-center gap-5">*/}
                    {/*        <Link*/}
                    {/*            href="/login"*/}
                    {/*            className="text-emerald-200 hover:text-white font-medium transition-colors duration-300 hover:underline underline-offset-4"*/}
                    {/*        >*/}
                    {/*            Login*/}
                    {/*        </Link>*/}
                    {/*        <Link*/}
                    {/*            href="/signup"*/}
                    {/*            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"*/}
                    {/*        >*/}
                    {/*            Sign Up*/}
                    {/*        </Link>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
        </nav>
    );
}