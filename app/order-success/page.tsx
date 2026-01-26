"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
                <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-700 mb-6">
                    Thank you for your purchase. Your order has been received and is being processed.
                    You will receive a confirmation email shortly.
                </p>

                <Link
                    href="/sb-group-frontend/public"
                    className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition text-lg font-medium mb-4"
                >
                    Continue Shopping
                </Link>

                <Link
                    href="/orders"
                    className="block text-indigo-600 hover:underline text-sm mt-2"
                >
                    View My Orders
                </Link>
            </div>
        </div>
    );
}
