"use client";

import { useEffect, useState } from "react";
import AreaForm from "@/components/AreaForm";

type Role = "ADMIN" | "CUSTOMER" | null;

interface Area {
    id: number;
    name: string;
    purchaseAmount: string;
    paidAmount: string;
    dueAmount: string;
}

const API_URL = "http://localhost:8080/api/areas";

function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.split("; ").find(row => row.startsWith("token="));
    return match ? match.split("=")[1] : null;
}

export default function AreasPage() {
    const [role, setRole] = useState<Role>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAreas = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(API_URL, {
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) {
                if (res.status === 403) {
                    setError("Access denied. Admin privileges required.");
                } else {
                    setError(`Failed to load areas (${res.status})`);
                }
                return;
            }

            const data = await res.json();
            setAreas(data);
        } catch (err) {
            console.error("Error fetching areas:", err);
            setError("Failed to load areas. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    const loadUserRole = async () => {
        const token = getTokenFromCookie();
        if (!token) {
            setRole(null);
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/auth/me", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                setRole(null);
                return;
            }

            const data = await res.json();
            setRole(data.role);
        } catch (err) {
            console.error("Failed to fetch /me:", err);
            setRole(null);
        }
    };
    const isAdmin = role === "ADMIN";

    useEffect(() => {
        loadUserRole();
        if(isAdmin){
        fetchAreas();}
    }, []);



    const deleteArea = async (id: number, name?: string) => {
        const displayName = name ? `"${name}"` : `area #${id}`;
        if (!confirm(`Are you sure you want to delete ${displayName}? This action cannot be undone.`)) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
            if (!res.ok) {
                let msg = "Failed to delete area";
                switch (res.status) {
                    case 401:
                    case 403:
                        msg = "You don't have permission to delete areas. Admin access required.";
                        break;
                    case 404:
                        msg = "Area not found.";
                        break;
                    case 409:
                        msg = "Cannot delete: this area is in use.";
                        break;
                    default:
                        msg = `Delete failed (${res.status})`;
                }
                throw new Error(msg);
            }
            await fetchAreas();
        } catch (err: any) {
            console.error("Delete error:", err);
            alert(err.message || "Failed to delete area. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "1.5rem" }}>📍 Areas Management</h1>

            {isAdmin && (
                <AreaForm
                    onSuccess={() => {
                        fetchAreas();
                    }}
                />
            )}

            {loading && <p>Loading areas...</p>}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            {!loading && !error && (
                <table style={{ marginTop: "2rem", width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <thead style={{ background: "#f4f4f9" }}>
                    <tr>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>ID</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Purchase</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Paid</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Due</th>
                        {isAdmin && <th style={{ padding: "12px", border: "1px solid #ddd" }}>Action</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {areas.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", padding: "2rem" }}>
                                No areas found
                            </td>
                        </tr>
                    ) : (
                        areas.map((area) => (
                            <tr key={area.id}>
                                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{area.id}</td>
                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{area.name}</td>
                                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right" }}>{area.purchaseAmount}</td>
                                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right" }}>{area.paidAmount}</td>
                                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right" }}>{area.dueAmount}</td>
                                {isAdmin && (
                                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                                        <button
                                            onClick={() => deleteArea(area.id, area.name)}
                                            style={{
                                                background: "#e74c3c",
                                                color: "white",
                                                border: "none",
                                                padding: "6px 12px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
