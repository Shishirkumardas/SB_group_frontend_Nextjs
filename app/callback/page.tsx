"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function PaymentCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "success" | "failed" | "cancelled">("loading");
    const [message, setMessage] = useState("Verifying your payment...");
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [trxId, setTrxId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | null>(null);

    useEffect(() => {
        const paymentID = searchParams.get("paymentID");
        const callbackStatus = searchParams.get("status")?.toLowerCase();

        if (!paymentID || !callbackStatus) {
            setStatus("failed");
            setMessage("Invalid callback parameters. Please contact support.");
            return;
        }

        setPaymentId(paymentID);

        if (callbackStatus === "success") {
            handleExecutePayment(paymentID);
        } else if (callbackStatus === "failure") {
            setStatus("failed");
            setMessage("Payment failed. Please try again.");
        } else if (callbackStatus === "cancel") {
            setStatus("cancelled");
            setMessage("Payment was cancelled.");
        } else {
            setStatus("failed");
            setMessage(`Unknown status: ${callbackStatus}`);
        }
    }, [searchParams]);

    const handleExecutePayment = async (paymentID: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/bkash/callback?paymentID=${paymentID}&status=success`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            // Handle success or "already completed" as success
            if (res.ok && data?.transactionStatus === "Completed") {
                setStatus("success");
                setMessage("Payment successful! Thank you for your purchase.");
                setTrxId(data.trxId || null);
                setAmount(data.amount || null);
                // setTimeout(() => {
                //     router.push("/dashboard"); // or /orders, /profile, etc.
                // }, 3000);
            } else if (data?.externalCode === "2062" || data?.errorMessageEn?.includes("already been completed")) {
                // Treat "already completed" as success
                setStatus("success");
                setMessage("Payment was already completed successfully!");
                setTrxId(data.trxId || null);
                setAmount(data.amount || null);
                // setTimeout(() => {
                //     router.push("/dashboard");
                // }, 3000);
            } else {
                setStatus("failed");
                setMessage(data?.errorMessageEn || data?.statusMessage || "Payment verification failed. Please contact support.");
            }
        } catch (error) {
            console.error("Execute callback error:", error);
            setStatus("failed");
            setMessage("Something went wrong during verification.");
        }
    };

    const getIcon = () => {
        switch (status) {
            case "success":
                return <CheckCircle2 className="h-20 w-20 text-green-500" />;
            case "failed":
                return <XCircle className="h-20 w-20 text-red-500" />;
            case "cancelled":
                return <AlertCircle className="h-20 w-20 text-amber-500" />;
            default:
                return <Loader2 className="h-20 w-20 animate-spin text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">{getIcon()}</div>

                <h1 className="text-2xl font-bold mb-4">
                    {status === "loading" && "Processing Payment..."}
                    {status === "success" && "Payment Successful!"}
                    {status === "failed" && "Payment Failed"}
                    {status === "cancelled" && "Payment Cancelled"}
                </h1>

                <p className="text-gray-600 mb-8">{message}</p>

                {status === "success" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-8 text-left">
                        <p className="text-green-800 font-medium mb-2">Transaction Details:</p>
                        <p className="text-sm text-gray-700">
                            <strong>Amount:</strong> ৳{amount || "—"}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Transaction ID:</strong> {trxId || "—"}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Payment ID:</strong> {paymentId || "—"}
                        </p>
                    </div>
                )}

                {paymentId && status !== "success" && (
                    <p className="text-sm text-gray-500 mb-6">
                        Payment ID: <span className="font-mono">{paymentId}</span>
                    </p>
                )}

                {status !== "loading" && (
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                    >
                        Go to Dashboard
                    </button>
                )}
            </div>
        </div>
    );
}