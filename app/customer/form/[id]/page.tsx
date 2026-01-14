"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerFormPage() {
    const router = useRouter();

    const [areas, setAreas] = useState<any[]>([]);
    const [methods, setMethods] = useState<string[]>([]);

    const [form, setForm] = useState({
        customerName: "",
        areaID: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
    });

    useEffect(() => {
        fetch("http://localhost:8080/api/public/areas")
            .then(res => res.json())
            .then(setAreas);

        fetch("http://localhost:8080/api/public/meta/payment-methods")
            .then(res => res.json())
            .then(setMethods);
    }, []);

    const submit = async () => {
        await fetch("http://localhost:8080/api/customer/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerName: form.customerName,
                areaID: Number(form.areaID),
                amount: Number(form.amount),
                paymentDate: form.paymentDate,
                paymentMethod: form.paymentMethod,
            }),
        });

        router.push("/customer/success");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-lg">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-8 py-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Customer Information
                        </h1>
                        <p className="mt-2 text-emerald-100/90">
                            Please fill in the details below
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Name
                            </label>
                            <input
                                placeholder="Enter customer name"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                                value={form.customerName}
                                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                            />
                        </div>

                        {/* Select Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Area
                            </label>
                            <select
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-white"
                                value={form.areaID}
                                onChange={(e) => setForm({ ...form, areaID: e.target.value })}
                            >
                                <option value="">Choose an area</option>
                                {areas.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                                value={form.paymentDate}
                                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                            />
                        </div>

                        {/* Purchase Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purchase Amount
                            </label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <select
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm bg-white"
                                value={form.paymentMethod}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                            >
                                <option value="">Select method</option>
                                {methods.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={submit}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Submit Customer Information
                        </button>
                    </div>
                </div>

                {/* Optional footer note */}
                <p className="mt-8 text-center text-sm text-emerald-700/70">
                    All information is securely processed • Thank you!
                </p>
            </div>
        </div>
    );
}