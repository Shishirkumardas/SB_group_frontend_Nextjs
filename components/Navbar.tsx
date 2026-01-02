'use client';
import Link from "next/link";
import React from 'react';

export default function Navbar() {
    const [open, setOpen] = React.useState(false);
    return (
        <nav className="bg-blue-900 text-white p-4 flex gap-6">
            <Link href="/">Dashboard</Link>
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="hover:underline"
                >
                    Customer ▾
                </button>

                {open && (
                    <div className="absolute top-full left-0 bg-white text-black mt-2 rounded shadow w-48 z-50">
                        <Link
                            href="/customer"
                            className="block px-4 py-2 hover:bg-gray-100"
                        >
                            Customer Entry Form
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
            <Link href="/master-data">Master Data</Link>
            <Link href="/areas">Area</Link>
            <Link href="/consumers">Consumers</Link>
            <Link href="/purchases">Purchases</Link>
            <Link href="/payments">Payments</Link>
            <Link href="/summary">Overall Summary</Link>
        </nav>
    );
}
