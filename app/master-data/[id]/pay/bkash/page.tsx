"use client";

import { useParams, useSearchParams } from "next/navigation";

export default function BkashPaymentPage() {
    const { id } = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");

    const payWithBkash = async () => {
        const res = await fetch(
            `http://localhost:8080/api/bkash/pay?masterDataId=${id}&amount=${amount}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}` // if needed
                },
            }
        );

        if (!res.ok) {
            alert("Failed to initiate bKash payment");
            return;
        }

        const data = await res.json();

        // Redirect to bKash payment gateway
        window.location.href = data.bkashURL;
    };

    return (
        <div style={{ padding: 30 }}>
            <h1>🔐 bKash Payment</h1>

            <p>Amount: <strong>{amount}</strong> BDT</p>

            <button onClick={payWithBkash}>
                Pay with bKash
            </button>
        </div>
    );
}
