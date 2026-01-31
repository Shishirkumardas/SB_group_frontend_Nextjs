"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { Upload, Loader2, CheckCircle, AlertCircle, File } from "lucide-react";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function ExcelUploadPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".xlsx")) {
            setMessage({ text: "Only .xlsx files are allowed", type: "error" });
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setMessage(null);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ text: "Please select a file first", type: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setIsUploading(true);
        setProgress(0);
        setMessage(null);

        try {
            const token = localStorage.getItem("jwtToken");

            await axios.post(`${API_ROOT}/file-upload/excel/import`, formData, {
                headers: token
                    ? { Authorization: `Bearer ${token}` } // only send Auth header
                    : undefined,
                withCredentials: true, // keep this if you use cookies/sessions
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                },
            });

            setMessage({ text: "✅ Excel file imported successfully!", type: "success" });
            setProgress(100);

            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSelectedFile(null);
        } catch (error: any) {
            console.error("Upload error:", error);

            let errorMsg = "❌ Upload failed";
            if (error.response?.data?.message) {
                errorMsg += `: ${error.response.data.message}`;
            } else if (error.message) {
                errorMsg += `: ${error.message}`;
            }

            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg bg-emerald-900/40 backdrop-blur-md border border-emerald-800/50 rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-serif font-bold text-emerald-100 text-center mb-8">
                    Excel Import (Master Data & Cashback)
                </h1>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-medium text-white transition-all
            ${isUploading ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-600"}`}
                >
                    <Upload size={20} />
                    {isUploading ? "Processing..." : "Choose Excel File (.xlsx)"}
                </button>

                {selectedFile && (
                    <div className="mt-6 p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/50">
                        <div className="flex items-center gap-3">
                            <File size={20} className="text-emerald-400" />
                            <span className="text-emerald-100 font-medium truncate">
                {selectedFile.name}
              </span>
                        </div>
                        <p className="text-sm text-emerald-300 mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                )}

                {selectedFile && (
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={`mt-6 w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-medium text-white transition-all shadow-lg
              ${isUploading ? "bg-gray-600 cursor-not-allowed" : "bg-green-700 hover:bg-green-600"}`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Start Import
                            </>
                        )}
                    </button>
                )}

                {isUploading && progress > 0 && (
                    <div className="mt-6">
                        <div className="w-full bg-emerald-950 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-emerald-300 mt-2">
                            {progress}% uploaded
                        </p>
                    </div>
                )}

                {message && (
                    <div
                        className={`mt-6 p-4 rounded-xl text-center flex items-center justify-center gap-3 border
              ${message.type === "success"
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/60"
                            : "bg-red-950/70 text-red-300 border-red-800/60"}`}
                    >
                        {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <p className="text-center text-sm text-emerald-400/80 mt-8">
                    Only .xlsx files supported • Use the official template
                </p>
            </div>
        </div>
    );
}