"use client";

import { useRef, useState } from "react";
import axios, { AxiosProgressEvent } from "axios";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function ExcelUploadPage() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [selectedFileName, setSelectedFileName] = useState<string>("");

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".xlsx")) {
            setMessage("Only .xlsx files are allowed");
            return;
        }

        setSelectedFileName(file.name);
        setMessage("");
        setProgress(0);
    };

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            setMessage("Please select an Excel file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        setProgress(0);
        setMessage("");

        try {
            const token = localStorage.getItem("jwtToken"); // Get JWT from localStorage (adjust key if different)

            await axios.post(`${API_ROOT}/file-upload/excel/import`, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "", // Send JWT if available
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percent);
                    }
                },
            });

            setMessage("✅ Excel imported successfully!");
            setProgress(100);

            // Reset
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setSelectedFileName("");
        } catch (error: any) {
            console.error("Upload failed:", error);

            let errorMsg = "❌ Upload failed";
            if (error.response?.data?.message) {
                errorMsg += `: ${error.response.data.message}`;
            } else if (error.message) {
                errorMsg += `: ${error.message}`;
            }

            setMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Excel Import (Master Data & Cashback)
                </h1>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* File Input (hidden) */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Select File Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors
              ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {isLoading ? "Processing..." : "Select Excel File"}
                    </button>

                    {/* Selected File Info */}
                    {selectedFileName && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 font-medium">Selected file:</p>
                            <p className="text-gray-900 mt-1 break-all">{selectedFileName}</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    {selectedFileName && (
                        <button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-medium transition-colors
                ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                        >
                            {isLoading ? "Uploading..." : "Start Import"}
                        </button>
                    )}

                    {/* Progress Bar */}
                    {isLoading && progress > 0 && (
                        <div className="mt-6">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                {progress}% uploaded
                            </p>
                        </div>
                    )}

                    {/* Status Message */}
                    {message && (
                        <div
                            className={`mt-6 p-4 rounded-lg text-center ${
                                message.includes("✅")
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Supported format: .xlsx • Please use the correct template
                </p>
            </div>
        </div>
    );
}