// components/ExcelUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import PreviewTable from './PreviewTable';
import { toast } from 'sonner'; // or use your preferred toast library

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/master-data/excel';

type PreviewData = {
    name: string;
    phone: string | null;
    purchaseAmount: number;
    paidAmount: number;
    dueAmount: number;
    // ... add other fields you want to show in preview
};

export function ExcelUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<PreviewData[]>([]);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.xlsx')) {
            toast.error('Please upload an .xlsx file');
            return;
        }

        setFile(selectedFile);
        setError(null);
        handlePreview(selectedFile);
    };

    const handlePreview = async (selectedFile: File) => {
        setIsPreviewLoading(true);
        setPreviewData([]);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_BASE}/preview`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Preview failed');
            }

            const result = await response.json();
            setPreviewData(result.data || []);
            toast.success(`Found ${result.recordsCount} records in preview`);
        } catch (err: any) {
            setError(err.message || 'Failed to generate preview');
            toast.error('Preview failed');
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsImporting(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/import`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Import failed');
            }

            const result = await response.json();
            toast.success(result.message || `Imported ${result.importedCount} records successfully`);

            // Reset
            setFile(null);
            setPreviewData([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            setError(err.message || 'Import failed');
            toast.error('Import failed');
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Excel File</CardTitle>
                    <CardDescription>
                        Supported format: .xlsx • Max size: 10MB recommended
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="max-w-xs"
                            disabled={isPreviewLoading || isImporting}
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPreviewLoading || isImporting}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                        </Button>
                    </div>

                    {file && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            <span>{file.name}</span>
                            <span className="text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mt-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Preview & Import Actions */}
            {previewData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Preview ({previewData.length} records)</CardTitle>
                        <CardDescription>
                            Review the data before importing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <PreviewTable data={previewData} />

                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setPreviewData([]);
                                        setFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    disabled={isImporting}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    onClick={handleImport}
                                    disabled={isImporting}
                                >
                                    {isImporting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        'Confirm & Import'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}