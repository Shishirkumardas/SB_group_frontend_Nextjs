"use client";

import { useRouter } from "next/navigation";

export default function PayPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    const pay = async () => {
        await fetch(`http://localhost:8080/api/customer/${params.id}/pay`, {
            method: "POST",
            credentials: "include",
        });

        router.push(`/customer/success/${params.id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-10 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Confirm Payment
                    </h1>
                    <p className="mt-3 text-emerald-100/90 text-lg">
                        You're about to complete the payment for this customer
                    </p>
                </div>

                {/* Content */}
                <div className="p-10 text-center space-y-8">
                    <div className="text-6xl animate-bounce">💳</div>

                    <p className="text-xl text-gray-700 font-medium">
                        Are you ready to process this payment?
                    </p>

                    <button
                        onClick={pay}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Pay Now
                    </button>

                    <p className="text-sm text-emerald-700/70">
                        This action cannot be undone after confirmation
                    </p>
                </div>
            </div>
        </div>
    );
}