'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next 13 App Router
import MasterDataForm from "@/components/MasterDataForm";

interface Area {
    id: number;
    name: string;
}

interface MasterData {
    id: number;
    name: string;
    area: Area;
    paymentMethod: string;
    phone: number;
    date: string;
    purchaseAmount: number;
    paidAmount: number;
    dueAmount: number;
    cashBackAmount: number;
}

export default function MasterDataPage() {
    const [data, setData] = useState<MasterData[]>([]);
    const API_URL = "http://localhost:8080/api/master-data";
    const router = useRouter();

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Failed to fetch data");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteItem = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete item");
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper function to parse and format date strings robustly
    const parseAndFormatDate = (dateString: string | undefined): string => {
        if (!dateString) return "-";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Try fixing common formats, e.g., slashes instead of dashes
            const fixedDateString = dateString.replace(/\//g, "-");
            const fixedDate = new Date(fixedDateString);
            if (!isNaN(fixedDate.getTime())) {
                return fixedDate.toLocaleDateString("en-GB");
            }
            // Could add more parsing strategies here if needed
            console.warn("Invalid date:", dateString);
            return "-";
        }
        return date.toLocaleDateString("en-GB");
    };

    // Use the helper function for rendering dates
    const renderDate = (dateString: string | undefined) => {
        return parseAndFormatDate(dateString);
    };

    return (
        <div style={{ padding: 30 }}>
            <h1>📋 Master Data</h1>

            <MasterDataForm onSuccess={fetchData} />

            <table
                border={1}
                cellPadding={8}
                style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Area</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Purchase</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Cashback</th>
                    <th>Action</th>
                    <th>Call</th>
                </tr>
                </thead>
                <tbody>
                {data.map((d) => (
                    <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.name}</td>
                        <td>{d.area?.name || "-"}</td>
                        <td>{d.paymentMethod}</td>
                        <td>{renderDate(d.date)}</td>
                        <td style={{textAlign: "right"}}>{d.purchaseAmount}</td>
                        <td style={{textAlign: "right"}}>{d.paidAmount}</td>
                        <td style={{textAlign: "right"}}>{d.dueAmount}</td>
                        <td style={{textAlign: "right"}}>{d.cashBackAmount}</td>
                        <td>
                            <button onClick={() => router.push(`/cashback/${d.id}`)}>
                                💰 Cashback Details
                            </button>
                        </td>
                        <td style={{textAlign: "center"}}>
                            {/*<button onClick={() => deleteItem(d.id)}>❌</button>*/}
                            {/*<button onClick={() => window.location.href = `tel:${d.phone}`}>*/}
                            <button
                                onClick={() =>
                                    fetch(`http://localhost:8080/api/calls/call?phone=${encodeURIComponent(d.phone)}`, {
                                        method: "POST",
                                    })
                                }
                            >
                                📞 Call
                            </button>

                        </td>
                        <td>
                            <button
                                onClick={() => router.push(`/master-data/${d.id}/pay`)}
                            >
                                💳 Payment
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}