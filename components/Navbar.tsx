"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "CUSTOMER" | null;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<Role>(null);
    const router = useRouter();

    // Fetch logged-in user role
    useEffect(() => {
        fetch("http://localhost:8080/api/auth/me", {
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setRole(data?.role ?? null))
            .catch(() => setRole(null));
    }, []);

    const logout = async () => {
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setRole(null);
        router.push("/login");
    };

    return (
        <nav className="bg-blue-900 text-white p-4 flex gap-6 items-center">
            {/* ADMIN LINKS */}
            {role === "ADMIN" && (
                <>
                    <Link href="/admin/dashboard">Dashboard</Link>

                    <div className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="hover:underline"
                        >
                            Customer ▾
                        </button>

                        {open && (
                            <div
                                onMouseLeave={() => setOpen(false)}
                                className="absolute top-full left-0 bg-white text-black mt-2 rounded shadow w-48 z-50"
                            >
                                <Link
                                    href="/customer"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Customer Entry
                                </Link>
                                <Link
                                    href="/customer/search"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Find Customer
                                </Link>
                                <Link
                                    href="/customer/history"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Payment History
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href="/areas">Area</Link>
                    <Link href="/consumers">Consumers</Link>
                    <Link href="/purchases">Purchases</Link>
                    <Link href="/payments">Payments</Link>
                    <Link href="/summary">Overall Summary</Link>
                </>
            )}

            {/* CUSTOMER LINKS */}
            {role === "CUSTOMER" && (
                <>
                    <Link href="/customer">My Account</Link>
                    <Link href="/customer/history">My Payments</Link>
                </>
            )}

            {/* RIGHT SIDE */}
            <div className="ml-auto flex gap-4">
                {!role && (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}

                {role && (
                    <button
                        onClick={logout}
                        className="bg-red-600 px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
