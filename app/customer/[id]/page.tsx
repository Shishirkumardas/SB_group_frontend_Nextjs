"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerFormPage({
                                             params,
                                         }: {
    params: { id: string };
}) {
    const router = useRouter();

    const [form, setForm] = useState({
        customerName: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "BKASH",
    });

    const submit = async () => {
        await fetch(`http://localhost:8080/api/customer/${params.id}/form`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                amount: Number(form.amount),
            }),
        });

        router.push(`/customer/review/${params.id}`);
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">
                Customer Information
            </h1>

            <input
                placeholder="Name"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                }
            />

            <select
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, paymentMethod: e.target.value })
                }
            >
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="ROCKET">Rocket</option>
            </select>

            <input
                type="number"
                placeholder="Amount"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                }
            />

            <input
                type="date"
                className="border p-2 w-full mb-4"
                onChange={(e) =>
                    setForm({ ...form, paymentDate: e.target.value })
                }
            />

            <button
                onClick={submit}
                className="bg-black text-white px-4 py-2 w-full"
            >
                Continue
            </button>
        </div>
    );
}
