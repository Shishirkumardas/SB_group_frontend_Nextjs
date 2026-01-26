"use client";

import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";

export default function CustomerPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);


    const handleNewCustomer = () => {
        const id = crypto.randomUUID();
        router.push(`/customer/${id}`);
    };
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full text-center">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-10 md:p-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-6 tracking-tight">
                        Welcome to Customer Portal
                    </h1>

                    <p className="text-lg md:text-xl text-emerald-700/80 mb-12 max-w-2xl mx-auto">
                        Start a new customer entry or manage existing records
                    </p>

                    <button
                        onClick={handleNewCustomer}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-5 rounded-xl font-semibold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        New Customer Entry
                        <span className="text-2xl">➕</span>
                    </button>

                    {/* Optional subtle footer note */}
                    <p className="mt-12 text-sm text-emerald-700/60">
                        Secure & Fast • Your data is protected
                    </p>
                </div>
            </div>
        </div>
    );
}