"use client";

import { useEffect, useState } from "react";
import AreaForm from "@/components/AreaForm";

interface Area {
    id: number;
    name: string;
    purchaseAmount: string;
    paidAmount: string;
    dueAmount: string;
}

export default function AreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const API_URL = "http://localhost:8080/api/areas";

    const fetchAreas = async () => {
        try {
            const res = await fetch(API_URL, {
                credentials: "include", // ✅ REQUIRED
            });

            if (!res.ok) throw new Error("Failed to fetch areas");

            const data = await res.json();
            setAreas(data);
        } catch (err) {
            console.error("Error fetching areas:", err);
        }
    };

    const deleteArea = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include", // ✅ REQUIRED
            });

            if (!res.ok) throw new Error("Failed to delete area");

            fetchAreas();
        } catch (err) {
            console.error("Error deleting area:", err);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    return (
        <div style={{ padding: 30 }}>
            <h1>📍 Areas</h1>

            <AreaForm onSuccess={fetchAreas} />

            <table
                border={1}
                cellPadding={10}
                style={{
                    marginTop: 20,
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Purchase</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {areas.map((area) => (
                    <tr key={area.id}>
                        <td>{area.id}</td>
                        <td>{area.name}</td>
                        <td style={{ textAlign: "right" }}>{area.purchaseAmount}</td>
                        <td style={{ textAlign: "right" }}>{area.paidAmount}</td>
                        <td style={{ textAlign: "right" }}>{area.dueAmount}</td>
                        <td style={{ textAlign: "center" }}>
                            <button onClick={() => deleteArea(area.id)}>❌</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
