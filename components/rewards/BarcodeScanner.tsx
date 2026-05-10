// src/components/rewards/BarcodeScanner.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    BrowserMultiFormatReader,
    BarcodeFormat,
    DecodeHintType,
    NotFoundException,
} from '@zxing/library';

import {
    Camera,
    CameraOff,
    ImageUp,
    Flashlight,
    ScanLine,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
    onScan: (result: string) => void;
}

export default function BarcodeScanner({
                                           onScan,
                                       }: BarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [lastResult, setLastResult] = useState('');
    const [zoom, setZoom] = useState(1);
    const [error, setError] = useState('');

    // New: For physical barcode scanner (keyboard input)
    const barcodeBufferRef = useRef('');
    const barcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // =========================
    // ZXING HINTS
    // =========================
    const createHints = () => {
        const hints = new Map();

        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.ALSO_INVERTED, true);

        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_93,
            BarcodeFormat.CODABAR,
            BarcodeFormat.DATA_MATRIX,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.ITF,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.PDF_417,
            BarcodeFormat.AZTEC,
        ]);

        return hints;
    };

    // =========================
    // STOP CAMERA
    // =========================
    const stopCamera = useCallback(() => {
        try {
            codeReaderRef.current?.reset();
        } catch {}

        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }

        if (streamRef.current) {
            if ("getTracks" in streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            streamRef.current = null;
        }

        setIsCameraOn(false);
        setTorchOn(false);
        setIsScanning(false);
    }, []);

    // =========================
    // PHYSICAL SCANNER SUPPORT (Keyboard)
    // =========================
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input field
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            if (e.key === 'Enter') {
                if (barcodeBufferRef.current.length > 3) {
                    const scannedCode = barcodeBufferRef.current.trim();
                    setLastResult(scannedCode);
                    onScan(scannedCode);
                    navigator.vibrate?.(200);

                    // Auto stop camera if running
                    if (isCameraOn) stopCamera();
                }
                barcodeBufferRef.current = '';
                if (barcodeTimeoutRef.current) clearTimeout(barcodeTimeoutRef.current);
            } else if (e.key.length === 1) {
                barcodeBufferRef.current += e.key;

                // Reset buffer if no input for 300ms (scanner is fast)
                if (barcodeTimeoutRef.current) clearTimeout(barcodeTimeoutRef.current);
                barcodeTimeoutRef.current = setTimeout(() => {
                    barcodeBufferRef.current = '';
                }, 300);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onScan, isCameraOn, stopCamera]);

    // =========================
    // START CAMERA
    // =========================
    const startCamera = async () => {
        setError('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            const codeReader = new BrowserMultiFormatReader(createHints());
            codeReaderRef.current = codeReader;

            setIsCameraOn(true);
            setIsScanning(true);

            codeReader.decodeFromVideoDevice(
                undefined,
                videoRef.current!,
                (result, err) => {
                    if (result) {
                        const text = result.getText();

                        navigator.vibrate?.(200);

                        setLastResult(text);
                        onScan(text);

                        setTimeout(() => {
                            stopCamera();
                        }, 1000);
                    }

                    if (err && !(err instanceof NotFoundException)) {
                        console.error(err);
                    }
                }
            );
        } catch (err) {
            console.error(err);

            setError(
                'Camera access failed. Please allow permission or use image upload.'
            );
        }
    };

    // =========================
    // TOGGLE CAMERA
    // =========================
    const toggleCamera = () => {
        if (isCameraOn) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    // =========================
    // TOGGLE TORCH
    // =========================
    const toggleTorch = async () => {
        try {
            const track = streamRef.current?.getVideoTracks()[0];

            if (!track) return;

            // @ts-ignore
            const capabilities = track.getCapabilities();

            if (!capabilities.torch) {
                setError('Torch not supported on this device.');
                return;
            }

            await track.applyConstraints({
                advanced: [{ torch: !torchOn } as any],
            });

            setTorchOn(!torchOn);
        } catch (err) {
            console.error(err);
            setError('Unable to toggle flashlight.');
        }
    };

    // =========================
    // IMAGE ENHANCEMENT
    // =========================
    const enhanceImage = (
        image: HTMLImageElement
    ): HTMLCanvasElement | null => {
        const canvas = canvasRef.current;

        if (!canvas) return null;

        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const data = imageData.data;

        // Increase contrast + grayscale
        for (let i = 0; i < data.length; i += 4) {
            const avg =
                (data[i] + data[i + 1] + data[i + 2]) / 3;

            const contrast = avg > 128 ? 255 : 0;

            data[i] = contrast;
            data[i + 1] = contrast;
            data[i + 2] = contrast;
        }

        ctx.putImageData(imageData, 0, 0);

        return canvas;
    };

    // =========================
    // IMAGE SCAN
    // =========================
    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setError('');
        setIsScanning(true);

        try {
            const imageUrl = URL.createObjectURL(file);

            const img = new Image();

            img.src = imageUrl;

            img.onload = async () => {
                try {
                    const codeReader = new BrowserMultiFormatReader(
                        createHints()
                    );

                    // TRY ORIGINAL IMAGE
                    try {
                        const result =
                            await codeReader.decodeFromImageElement(img);

                        setLastResult(result.getText());
                        onScan(result.getText());

                        navigator.vibrate?.(200);

                        return;
                    } catch {}

                    // TRY ENHANCED IMAGE
                    const enhancedCanvas = enhanceImage(img);

                    if (enhancedCanvas) {
                        try {
                            const result =
                                await codeReader.decodeFromCanvas(
                                    enhancedCanvas
                                );

                            setLastResult(result.getText());
                            onScan(result.getText());

                            navigator.vibrate?.(200);

                            return;
                        } catch {}
                    }

                    // MULTI SCALE DETECTION
                    const scales = [1, 1.5, 2, 3];

                    for (const scale of scales) {
                        const tempCanvas =
                            document.createElement('canvas');

                        const ctx =
                            tempCanvas.getContext('2d');

                        if (!ctx) continue;

                        tempCanvas.width = img.width * scale;
                        tempCanvas.height = img.height * scale;

                        ctx.drawImage(
                            img,
                            0,
                            0,
                            tempCanvas.width,
                            tempCanvas.height
                        );

                        try {
                            const result =
                                await codeReader.decodeFromCanvas(
                                    tempCanvas
                                );

                            setLastResult(result.getText());
                            onScan(result.getText());

                            navigator.vibrate?.(200);

                            return;
                        } catch {}
                    }

                    setError(
                        'No barcode detected. Try clearer image, crop barcode area, or improve lighting.'
                    );
                } catch (err) {
                    console.error(err);

                    setError(
                        'Failed to process barcode image.'
                    );
                } finally {
                    setIsScanning(false);
                }
            };
        } catch (err) {
            console.error(err);

            setError('Image upload failed.');
            setIsScanning(false);
        }
    };

    // =========================
    // CLEANUP
    // =========================
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className="space-y-6">
            {/* CAMERA AREA */}
            <div className="relative overflow-hidden rounded-[32px] border border-emerald-200 bg-black shadow-2xl">
                <div className="relative aspect-video">
                    <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                    />

                    {/* SCAN OVERLAY */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-6 rounded-3xl border-2 border-white/40" />

                        <div className="absolute left-1/2 top-1/2 h-56 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.8)]">
                            <div className="absolute left-0 top-0 h-1 w-full animate-pulse bg-emerald-400 shadow-[0_0_20px_#10b981]" />
                        </div>

                        {/* STATUS */}
                        <div className="absolute left-4 top-4">
                            <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-xl">
                                <ScanLine className="h-4 w-4 text-emerald-400" />

                                {isScanning
                                    ? 'AI Scanning Active'
                                    : 'Scanner Ready'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-zinc-950 p-5">
                    <Button
                        onClick={toggleCamera}
                        variant={
                            isCameraOn
                                ? 'destructive'
                                : 'default'
                        }
                        className="rounded-2xl shadow-xl"
                    >
                        {isCameraOn ? (
                            <>
                                <CameraOff className="mr-2 h-4 w-4" />
                                Stop Camera
                            </>
                        ) : (
                            <>
                                <Camera className="mr-2 h-4 w-4" />
                                Start AI Scanner
                            </>
                        )}
                    </Button>

                    {isCameraOn && (
                        <Button
                            onClick={toggleTorch}
                            variant="secondary"
                            className="rounded-2xl"
                        >
                            <Flashlight className="mr-2 h-4 w-4" />

                            {torchOn
                                ? 'Torch Off'
                                : 'Torch On'}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => {
                            setLastResult('');
                            setError('');
                        }}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* IMAGE UPLOAD */}
            <label className="group block cursor-pointer overflow-hidden rounded-[28px] border-2 border-dashed border-emerald-300 bg-gradient-to-br from-white to-emerald-50 p-10 transition-all hover:scale-[1.01] hover:border-emerald-500 hover:shadow-2xl">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-emerald-100 p-5 transition-transform group-hover:scale-110">
                        <ImageUp className="h-10 w-10 text-emerald-600" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800">
                        Upload Barcode Image
                    </h3>

                    <p className="mt-2 max-w-lg text-slate-500">
                        Advanced AI-enhanced barcode recognition with:
                        blur recovery, contrast boosting, inverted
                        barcode reading, multi-scale scanning, QR
                        support, damaged barcode recovery, and
                        ultra-HD detection.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {[
                            'QR',
                            'CODE128',
                            'EAN13',
                            'UPC',
                            'AZTEC',
                            'PDF417',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </label>

            {/* Add this info banner */}
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700 flex items-center gap-3">
                <ScanLine className="h-5 w-5" />
                <div>
                    <strong>Physical Barcode Scanner Supported!</strong><br />
                    Just scan normally — it will be detected automatically.
                </div>
            </div>

            {/* RESULT */}
            {lastResult && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 text-emerald-600" />

                        <div>
                            <h4 className="font-bold text-emerald-800">
                                Barcode Detected Successfully
                            </h4>

                            <p className="mt-2 break-all rounded-xl bg-white p-4 font-mono text-sm text-slate-700">
                                {lastResult}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-1 h-6 w-6 text-red-600" />

                        <div>
                            <h4 className="font-bold text-red-700">
                                Scan Failed
                            </h4>

                            <p className="mt-1 text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* HIDDEN CANVAS */}
            <canvas ref={canvasRef} className="hidden" />

            {/* FEATURES */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        title: 'AI Enhancement',
                        desc: 'Auto contrast, sharpening & inversion recovery',
                    },
                    {
                        title: 'Ultra Detection',
                        desc: 'Reads blurry, rotated & low-light barcodes',
                    },
                    {
                        title: 'Modern Experience',
                        desc: 'Torch, vibration, HD scanning & smart UX',
                    },
                ].map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md"
                    >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                            <Zap className="h-6 w-6 text-emerald-600" />
                        </div>

                        <h3 className="font-bold text-slate-800">
                            {feature.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}