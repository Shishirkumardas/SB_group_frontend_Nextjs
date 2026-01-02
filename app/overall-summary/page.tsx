"use client";

import { useEffect, useState } from "react";

interface Summary {
    totalPurchase: number;
    totalPaid: number;
    totalDue: number;
}

export default function SummaryPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/master-data/summary");
            if (!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`);
            }
            const data = await res.json();
            setSummary(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!summary) return <div>No data available</div>;

    return (
        <div style={{ padding: 30 }}>
            <h1>📊 Overall Summary</h1>
            <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
                <div style={{ padding: 20, border: "1px solid #ccc" }}>
                    <h3>Total Purchase</h3>
                    <p>{summary.totalPurchase}</p>
                </div>
                <div style={{ padding: 20, border: "1px solid #ccc" }}>
                    <h3>Total Paid</h3>
                    <p>{summary.totalPaid}</p>
                </div>
                <div style={{ padding: 20, border: "1px solid #ccc" }}>
                    <h3>Total Due</h3>
                    <p>{summary.totalDue}</p>
                </div>
            </div>
        </div>
    );
}