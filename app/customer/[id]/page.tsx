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
        phoneNumber: "",
        nid: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
    });

    useEffect(() => {
        fetch("http://localhost:8080/api/areas")
            .then(res => res.json())
            .then(setAreas);

        fetch("http://localhost:8080/api/customer/payment-methods")
            .then(res => res.json())
            .then(setMethods);
    }, []);

    const submit = async () => {
        // Send customer data
        const response = await fetch("http://localhost:8080/api/customer/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "sbgroup-super-secret-key-1234567890-sbgroup"
            },
            body: JSON.stringify({
                customerName: form.customerName,
                areaID: Number(form.areaID),
                phoneNumber: form.phoneNumber,
                nid: form.nid,
                amount: Number(form.amount),
                paymentDate: form.paymentDate,
                paymentMethod: form.paymentMethod,
            }),
        });

        if (response.ok) {
            // Assuming your backend returns the created customer ID in the response
            const data = await response.json();
            const customerId = data.id; // Adjust if your API returns a different structure

            // Immediately trigger payment
            await fetch(`http://localhost:8080/api/customer/pay/${customerId}`, {
                method: "POST",
            });

            // Navigate to success page
            router.push(`/customer/pay/${customerId}`);
        } else {
            // handle error
            alert("Failed to submit customer data");
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">
                Customer Information
            </h1>

            {/* Name */}
            <input
                placeholder="Customer Name"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                }
            />

            {/* Area */}
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

            {/* Phone Number */}
            <input
                placeholder="Phone Number"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                }
            />

            {/* NID */}
            <input
                placeholder="NID Number"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, nid: e.target.value })
                }
            />

            {/* Payment Date */}
            <input
                type="date"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, paymentDate: e.target.value })
                }
            />

            {/* Amount */}
            <input
                type="number"
                placeholder="Purchase Amount"
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                }
            />

            {/* Payment Method */}
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
