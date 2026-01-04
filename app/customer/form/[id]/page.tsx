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
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Customer Information</h1>

            <input
                placeholder="Customer Name"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                }
            />

            <select
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, areaID: e.target.value })
                }
            >
                <option value="">Select Area</option>
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.name}
                    </option>
                ))}
            </select>

            <input
                type="date"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, paymentDate: e.target.value })
                }
            />

            <input
                type="number"
                placeholder="Purchase Amount"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                }
            />

            <select
                className="border p-2 w-full mb-4"
                onChange={(e) =>
                    setForm({ ...form, paymentMethod: e.target.value })
                }
            >
                <option value="">Payment Method</option>
                {methods.map((m) => (
                    <option key={m} value={m}>
                        {m}
                    </option>
                ))}
            </select>

            <button
                onClick={submit}
                className="bg-black text-white px-4 py-2 w-full"
            >
                Submit
            </button>
        </div>
    );
}
