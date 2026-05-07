// src/components/rewards/BarcodeScanner.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
    onScan: (result: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        // Prevent multiple scanners
        if (scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            "html5qr-code-reader",
            {
                fps: 15,
                qrbox: { width: 280, height: 280 },
                rememberLastUsedCamera: true,
            },
            false
        );

        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                // Optional: Stop scanning after successful scan
                // scanner.clear();
            },
            (error) => {
                // Ignore common "no code found" errors
                if (!error?.startsWith?.("QR code parse error")) {
                    console.warn("Scan error:", error);
                }
            }
        );

        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                if (scannerRef.current instanceof Html5QrcodeScanner) {
                    scannerRef.current.clear().catch(console.error);
                }
                scannerRef.current = null;
            }
        };
    }, [onScan]);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-6">📟 Scan Reward Card</h3>

            <div id="html5qr-code-reader" className="mx-auto" />

            <p className="text-center text-sm text-gray-500 mt-6">
                💡 Works with USB Barcode Scanner too (just focus on the page)
            </p>

            <button
                onClick={() => {
                    if (scannerRef.current) {
                        if (scannerRef.current instanceof Html5QrcodeScanner) {
                            scannerRef.current.clear();
                        }
                        setIsScanning(false);
                    }
                }}
                className="mt-4 text-sm text-red-600 hover:underline mx-auto block"
            >
                Stop Scanner
            </button>
        </div>
    );
}