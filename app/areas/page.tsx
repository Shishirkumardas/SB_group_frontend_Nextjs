"use client";

import { useEffect, useState } from "react";
import AreaForm from "@/components/AreaForm";

interface Area {
    id: number;
    name: string;
    purchaseAmount: number;
    paidAmount: number;
    dueAmount: number;
}

export default function AreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const API_URL = "http://localhost:8080/api/areas";

    const fetchAreas = async () => {
        const res = await fetch(API_URL);
        const data = await res.json();
        setAreas(data);
    };

    const deleteArea = async (id: number) => {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchAreas();
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    return (
        <div style={{padding: 30}}>
            <h1>📍 Areas</h1>

            <AreaForm onSuccess={fetchAreas}/>

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
                    <th style={{textAlign: "left", verticalAlign: "middle"}}>ID</th>
                    <th style={{textAlign: "left", verticalAlign: "middle"}}>Name</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Purchase</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Paid</th>
                    <th style={{textAlign: "right", verticalAlign: "middle"}}>Due</th>
                    <th style={{textAlign: "center", verticalAlign: "middle"}}>Action</th>
                </tr>
                </thead>
                <tbody>
                {areas.map((area) => (
                    <tr key={area.id}>
                        <td style={{textAlign: "left", verticalAlign: "middle"}}>{area.id}</td>
                        <td style={{textAlign: "left", verticalAlign: "middle"}}>{area.name}</td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{area.purchaseAmount}</td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{area.paidAmount}</td>
                        <td style={{textAlign: "right", verticalAlign: "middle"}}>{area.dueAmount}</td>
                        <td style={{textAlign: "center", verticalAlign: "middle"}}>
                            <button onClick={() => deleteArea(area.id)}>❌</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
