"use client";

import Link from "next/link";

export default function CustomerNavbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="text-lg font-bold">
                Customer Portal
            </div>

            <div className="space-x-4">
                <Link href="/customer/form/1" className="hover:underline">
                    Form
                </Link>
                <Link href="/customer/review/1" className="hover:underline">
                    Review
                </Link>
                <Link href="/customer/pay/1" className="hover:underline">
                    Pay
                </Link>
                <Link href="/customer/success/1" className="hover:underline">
                    Success
                </Link>
            </div>
        </nav>
    );
}
