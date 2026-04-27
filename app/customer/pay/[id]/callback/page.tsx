import { Suspense } from "react";
import PaymentCallbackContent from "@/components/PaymentCallbackContent"; // create this file
import { Loader2 } from "lucide-react";
export default function PaymentCallbackPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Verifying your payment, please wait...</p>
                </div>
            </div>
        }>
            <PaymentCallbackContent params={params} />
        </Suspense>
    );
}