"use client";

import { useEffect, useState } from "react";

interface Payment {
    date: string;
    paidAmount: number;
}

export default function PaymentPage() {
    const [payments, setPayments] = useState<Payment[]>([]);

    const fetchPayments = async () => {
        const res = await fetch("http://localhost:8080/api/master-data/payments");
        const data = await res.json();
        setPayments(data);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div style={{padding: 30}}>
            <h1>💵 Payments</h1>
            <table
                border={1}
                cellPadding={8}
                style={{
                    marginTop: 20,
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                <tr>
                    <th style={{padding: '30px 30px', textAlign: "left", verticalAlign: "middle"}}>Date</th>
                    <th style={{padding: '30px 50px', textAlign: "right", verticalAlign: "middle"}}>Paid Amount</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((p, idx) => (
                    <tr key={idx}>
                        <td style={{padding: '20px', textAlign: "left", verticalAlign: "middle"}}>
                            {new Date(p.date).toLocaleDateString()}
                        </td>
                        <td style={{padding: '30px', textAlign: "right", verticalAlign: "middle"}}>{p.paidAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
