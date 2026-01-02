"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CashbackPaymentPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!id || !amount || !date) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:8080/api/cashback/${id}/pay`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: Number(amount),
                        paymentDate: date,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Payment failed");
            }

            router.push(`/cashback/${id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to save payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <h1>➕ Cashback Payment</h1>

            <div style={{ marginBottom: 10 }}>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <input
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
            </div>

            <button onClick={submit} disabled={loading}>
                {loading ? "Saving..." : "Save Payment"}
            </button>
        </div>
    );
}
