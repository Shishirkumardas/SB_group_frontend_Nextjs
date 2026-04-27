"use client";

export default function PdfViewer({ pdfUrl }: { pdfUrl: string }) {
    return (
        <div className="w-full mb-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border">
                <iframe
                    src={pdfUrl}
                    className="w-full h-[600px]"
                    title="PDF Viewer"
                />
            </div>

            <div className="mt-3 text-right">
                <a
                    href={pdfUrl}
                    target="_blank"
                    className="text-emerald-700 font-medium hover:underline"
                >
                    Open Full PDF
                </a>
            </div>
        </div>
    );
}