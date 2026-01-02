"use client";

import { useEffect, useState } from "react";

interface Consumer {
    name: string;
    area: string;
    purchaseAmount: number;
    paidAmount: number;
    dueAmount: number;
}

export default function ConsumerPage() {
    const [consumers, setConsumers] = useState<Consumer[]>([]);

    const fetchConsumers = async () => {
        const res = await fetch("http://localhost:8080/api/master-data/consumers");
        const data = await res.json();
        setConsumers(data);
    };

    useEffect(() => {
        fetchConsumers();
    }, []);

    return (
        <div style={{padding: 30}}>
            <h1>👥 Consumers</h1>
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
                    <th style={{textAlign: "left", verticalAlign: "middle"}}>Name</th>
                    <th style={{textAlign: "left", verticalAlign: "middle"}}>Area</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Purchase</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Paid</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Due</th>
                </tr>
                </thead>
                <tbody>
                {consumers.map((c, idx) => (
                    <tr key={idx}>
                        <td style={{textAlign: "left", verticalAlign: "middle"}}>{c.name}</td>
                        <td style={{textAlign: "left", verticalAlign: "middle"}}>{c.area}</td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{c.purchaseAmount}</td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{c.paidAmount}</td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{c.dueAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
