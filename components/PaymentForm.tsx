"use client";

import { useState } from "react";

export default function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [area, setArea] = useState("");

    const submit = async () => {
        await fetch("http://localhost:8080/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Number(amount),
                status,
                area,
            }),
        });

        setAmount("");
        setArea("");
        onSuccess();
    };

    return (
        <div>
            <h3>Add Payment</h3>
            <input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
            </select>
            <button onClick={submit}>➕ Add</button>
        </div>
    );
}
