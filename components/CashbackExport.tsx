"use client";

import { useState } from "react";
import { Loader2, FileSpreadsheet, AlertCircle, Download } from "lucide-react";

export default function AdminCashbackExportPage() {
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const downloadExcel = async () => {
        if (!date) {
            setError("Please select a due date");
            setSuccess(false);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch(
                `http://localhost:8080/api/file-upload/excel/export?date=${date}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Authentication failed. Please log in again.");
                }
                const errText = await res.text().catch(() => "Unknown error");
                throw new Error(`Export failed: ${res.status} - ${errText}`);
            }

            // Optional: read real filename from server header
            let filename = `cashback_${date}.xlsx`;
            const disposition = res.headers.get("Content-Disposition");
            if (disposition && disposition.includes("filename=")) {
                const match = disposition.match(/filename="?(.+)"?/);
                if (match?.[1]) if (match) {
                    filename = match[1];
                }
            }

            const blob = await res.blob();

            // Modern & clean way (no window.URL)
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);           // ← fixed here

            setSuccess(true);
        } catch (err: any) {
            console.error("Export error:", err);
            setError(err.message || "Failed to download Excel. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-emerald-900/40 backdrop-blur-sm border border-emerald-800/50 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-serif font-bold text-emerald-100 mb-6 flex items-center gap-3">
                    <FileSpreadsheet className="text-emerald-400" size={28} />
                    Cashback Excel Export
                </h2>

                {error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-950/70 text-red-300 border border-red-800/60 p-4 rounded-xl">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-3 bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 p-4 rounded-xl">
                        <Download size={20} />
                        <span className="text-sm">File downloaded successfully!</span>
                    </div>
                )}

                <label className="block text-sm text-emerald-300 mb-2 font-medium">
                    Select Due Date
                </label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        setError("");
                        setSuccess(false);
                    }}
                    className="w-full bg-emerald-950 border border-emerald-700 rounded-lg px-4 py-3 text-emerald-100
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none mb-6
                     [color-scheme:dark]"
                />

                <button
                    onClick={downloadExcel}
                    disabled={loading || !date}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-700 to-emerald-600
                     hover:from-emerald-600 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white py-3.5 rounded-xl font-medium shadow-lg transition-all duration-200"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download size={20} />
                            Download Excel
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}