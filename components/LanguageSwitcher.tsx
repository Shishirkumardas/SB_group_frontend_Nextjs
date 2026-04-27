"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export default function LanguageSwitcher() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,bn",
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };

        document.body.appendChild(script);
    }, []);

    const changeLanguage = (lang: string) => {
        const select = document.querySelector(
            ".goog-te-combo"
        ) as HTMLSelectElement;

        if (!select) return;

        select.value = lang;
        select.dispatchEvent(new Event("change"));
    };

    return (
        <>
            {/* Hidden Google widget */}
            <div id="google_translate_element" className="hidden"></div>

            {/* Custom Language Switcher */}
            <div className="flex items-center bg-emerald-900/60 border border-emerald-700 rounded-full overflow-hidden shadow-md backdrop-blur">
                <button
                    onClick={() => changeLanguage("en")}
                    className="px-3 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-700 transition"
                >
                    English
                </button>

                <div className="h-4 w-px bg-emerald-700"></div>

                <button
                    onClick={() => changeLanguage("bn")}
                    className="px-3 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-700 transition"
                >
                    বাংলা
                </button>
            </div>
        </>
    );
}