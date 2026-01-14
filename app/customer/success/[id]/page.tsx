"use client";

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden text-center p-12">
                <div className="text-8xl mb-8 animate-bounce">✅</div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-6 tracking-tight">
                    Payment Completed Successfully
                </h1>

                <p className="text-xl text-emerald-700/90 mb-10">
                    Thank you! Your payment has been processed securely.
                </p>

                <div className="space-y-6">
                    <p className="text-lg text-gray-700">
                        The customer record has been updated.
                    </p>

                    <Link
                        href="/customer"
                        className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Back to Customer Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}