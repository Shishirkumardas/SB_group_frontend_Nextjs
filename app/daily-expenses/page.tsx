'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next 13 App Router
import DailyExpenseForm from "@/components/DailyExpenseForm";

// interface Area {
//     id: number;
//     name: string;
// }

interface DailyExpense {
    id: number;
    date: string; // ISO string
    name: string;
    expenseHead: string;
    expenseAmount: number;
    cashIn: number;
    cashOut: number;
    runningBalance: number;
    remarks: string;
}
interface Summary {
    openingBalance: number;
    closingBalance: number;
    totalDeposit: number;
    totalExpense: number;
    totalPaid: number;
}

export default function DailyExpensePage() {
    const [data, setData] = useState<DailyExpense[]>([]);
    const API_URL = "http://localhost:8080/api/daily-expenses";

    const [summary, setSummary] = useState<Summary>({
        openingBalance: 0,
        closingBalance: 0,
        totalDeposit: 0,
        totalExpense: 0,
        totalPaid: 0
    });
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<DailyExpense>>({});

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
    const fetchSummary = async () => {
        try {
            const res = await fetch(`${API_URL}/summary`);
            if (!res.ok) throw new Error("Failed to fetch summary");
            const json = await res.json();
            setSummary(json);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteItem = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete item");
            fetchData();
            fetchSummary();
        } catch (err) {
            console.error(err);
        }
    };
    const updateItem = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "PUT" });
            if (!res.ok) throw new Error("Failed to Update item");
            fetchData();
            fetchSummary();
        } catch (err) {
            console.error(err);
        }
    };
    const saveEdit = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!res.ok) throw new Error("Failed to update");
            setEditRowId(null);
            fetchData();
            fetchSummary();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        fetchSummary();
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
            <h1>📋 Daily-expenses </h1>
            {/* Display summary at the top */}
            <div style={{ marginBottom: 20, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}>
                <h3>💰 Summary</h3>
                <p>Opening Balance: {summary.openingBalance}</p>
                <p>Closing Balance: {summary.closingBalance}</p>
                <p>Total Deposit: {summary.totalDeposit}</p>
                <p>Total Expense: {summary.totalExpense}</p>
                <p>Total Paid: {summary.totalPaid}</p>
            </div>

            <DailyExpenseForm onSuccess={() => { fetchData(); fetchSummary(); }} />

            <table
                border={1}
                cellPadding={8}
                style={{marginTop: 20, width: "100%", borderCollapse: "collapse"}}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Expense Head</th>
                    <th>Expense Amount</th>
                    <th>Cash In</th>
                    <th>Cash Out</th>
                    <th>Running Balance</th>
                    <th>Remarks</th>
                </tr>
                </thead>
                <tbody>
                {data.map((exp) => {
                    const isEditing = editRowId === exp.id;

                    return (
                        <tr key={exp.id}>
                            <td>{exp.id}</td>

                            <td>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={editData.date || ""}
                                        onChange={e => setEditData({...editData, date: e.target.value})}
                                    />
                                ) : (
                                    new Date(exp.date).toLocaleDateString("en-GB")
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <input
                                        value={editData.name || ""}
                                        onChange={e => setEditData({...editData, name: e.target.value})}
                                    />
                                ) : (
                                    exp.name
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <input
                                        value={editData.expenseHead || ""}
                                        onChange={e => setEditData({...editData, expenseHead: e.target.value})}
                                    />
                                ) : (
                                    exp.expenseHead
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editData.expenseAmount ?? ""}
                                        onChange={e =>
                                            setEditData({...editData, expenseAmount: Number(e.target.value)})
                                        }
                                    />
                                ) : (
                                    exp.expenseAmount
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editData.cashIn ?? ""}
                                        onChange={e =>
                                            setEditData({...editData, cashIn: Number(e.target.value)})
                                        }
                                    />
                                ) : (
                                    exp.cashIn
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editData.cashOut ?? ""}
                                        onChange={e =>
                                            setEditData({...editData, cashOut: Number(e.target.value)})
                                        }
                                    />
                                ) : (
                                    exp.cashOut
                                )}
                            </td>

                            {/*<td>{exp.cashIn}</td>*/}
                            {/*<td>{exp.cashOut}</td>*/}
                            <td>{exp.runningBalance}</td>

                            <td>
                                {isEditing ? (
                                    <input
                                        value={editData.remarks || ""}
                                        onChange={e => setEditData({...editData, remarks: e.target.value})}
                                    />
                                ) : (
                                    exp.remarks
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <>
                                        <button onClick={() => saveEdit(exp.id)}>Save</button>
                                        <button onClick={() => setEditRowId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            style={{color: "green"}}
                                            onClick={() => {
                                                setEditRowId(exp.id);
                                                setEditData({
                                                    name: exp.name,
                                                    expenseHead: exp.expenseHead,
                                                    expenseAmount: exp.expenseAmount,
                                                    date: exp.date,
                                                    remarks: exp.remarks,
                                                    cashIn: exp.cashIn,
                                                    cashOut: exp.cashOut,
                                                });
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            style={{color: "red", marginLeft: 8}}
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this expense?")) {
                                                    deleteItem(exp.id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}