"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        api.get("/dashboard/summary").then(res => setData(res.data));
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="grid grid-cols-4 gap-4">
            <StatCard title="Total Purchase" value={`৳${data.total_purchase}`} />
            <StatCard title="Total Paid" value={`৳${data.total_paid}`} />
            <StatCard title="Total Due" value={`৳${data.total_due}`} />
            <StatCard title="Paid %" value={`${data.paid_percent}%`} />
        </div>
    );
}
