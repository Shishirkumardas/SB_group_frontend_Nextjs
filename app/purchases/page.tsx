"use client";

import { useEffect, useState } from "react";

interface Purchase {
    date: string;
    purchaseAmount: number;
}

export default function PurchasePage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    const fetchPurchases = async () => {
        const res = await fetch("http://localhost:8080/api/master-data/purchases");
        const data = await res.json();
        setPurchases(data);
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <div style={{padding: 30}}>
            <h1>🛒 Purchases</h1>
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
                    <th style={{textAlign: "left", verticalAlign: "middle"}}>Date</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Purchase Amount</th>
                </tr>
                </thead>
                <tbody>
                {purchases.map((p, idx) => (
                    <tr key={idx}>
                        <td style={{textAlign: "left", verticalAlign: "middle"}}>
                            {new Date(p.date).toLocaleDateString()}
                        </td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{p.purchaseAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
