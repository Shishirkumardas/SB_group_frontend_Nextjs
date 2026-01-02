"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Payment {
    paymentDate: string;
    amount: number;
}

interface CashbackData {
    cashbackStatus: string;
    expectedMonthlyCashbackAmount: number;
    missedCashbackAmount: number;
    missedCashbackCount: number;
    nextDueDate: string;
}

export default function CashbackDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<CashbackData | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAll = async () => {
            try {
                const cashbackRes = await fetch(
                    `http://localhost:8080/api/cashback/${id}`
                );
                if (!cashbackRes.ok) throw new Error("Cashback fetch failed");
                const cashbackJson = await cashbackRes.json();
                setData(cashbackJson);

                const paymentsRes = await fetch(
                    `http://localhost:8080/api/cashback/${id}/payments`
                );
                if (!paymentsRes.ok) throw new Error("Payments fetch failed");
                const paymentsJson = await paymentsRes.json();
                setPayments(Array.isArray(paymentsJson) ? paymentsJson : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Error loading cashback data.</p>;

    const formatDate = (d?: string) =>
        d ? new Date(d).toLocaleDateString("en-GB") : "-";

    return (
        <div style={{ padding: 30 }}>
            <h1>💰 Cashback Details</h1>

            <p><b>Status:</b> {data.cashbackStatus}</p>
            <p><b>Monthly Cashback:</b> {data.expectedMonthlyCashbackAmount}</p>
            <p><b>Missed Amount:</b> {data.missedCashbackAmount}</p>
            <p><b>Missed Months:</b> {data.missedCashbackCount}</p>
            <p><b>Next Due Date:</b> {formatDate(data.nextDueDate)}</p>

            <h3>Payment History</h3>
            <table border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {payments.length > 0 ? (
                    payments.map((p, i) => (
                        <tr key={i}>
                            <td>{formatDate(p.paymentDate)}</td>
                            <td>{p.amount}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center" }}>
                            No payments found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <br />

            <button onClick={() => router.push(`/cashback/${id}/pay`)}>
                ➕ Add Cashback Payment
            </button>
        </div>
    );
}
