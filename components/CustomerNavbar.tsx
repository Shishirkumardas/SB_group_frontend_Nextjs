"use client";

import Link from "next/link";

export default function CustomerNavbar() {
    return (
        <nav className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-900 text-white shadow-2xl border-b border-emerald-700/40 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand / Title */}
                <div className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 hover:text-emerald-300 transition-colors duration-300">
                    <span className="text-emerald-400">Customer</span> Portal
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/customer/profile"
                        className="text-emerald-100 hover:text-emerald-300 font-medium text-lg transition-all duration-300 hover:scale-105 hover:underline underline-offset-4"
                    >
                        Profile
                    </Link>
                    {/* Add more links here later if needed */}
                </div>
            </div>
        </nav>
    );
}