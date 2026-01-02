// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "SB Group",
    description: "SB Group Web App",
    applicationName: "SB Group",
    // specify language if needed
    otherMetadata: {
        lang: "en",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}