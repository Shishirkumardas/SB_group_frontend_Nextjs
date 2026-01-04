"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "CUSTOMER" | null;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<Role>(null);
    const router = useRouter();

    useEffect(() => {
        const loadMe = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    method: "GET",
                    credentials: "include", // 🔥 IMPORTANT for cookies
                });

                if (!res.ok) {
                    setRole(null); // not logged in
                    return;
                }

                const data = await res.json();
                setRole(data.role); // set role from backend
            } catch (err) {
                console.error("Failed to fetch /me:", err);
                setRole(null);
            }
        };

        loadMe();
    }, []);

    const logout = async () => {
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include", // 🔥 important
        });
        // refresh to update Navbar
        window.location.reload()
        setRole(null);
        router.push("/login");
    };

    return (
        <nav className="bg-blue-900 text-white p-4 flex gap-6 items-center">
            {/* ADMIN LINKS */}
            {role === "ADMIN" && (
                <>
                    <Link href="/dashboard/summary">Dashboard</Link>
                    <Link href="/areas">Area</Link>
                    <Link href="/consumers">Consumers</Link>
                    <Link href="/purchases">Purchases</Link>
                    <Link href="/payments">Payments</Link>
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
