"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export default function GoogleTranslate() {
    useEffect(() => {
        const addScript = document.createElement("script");
        addScript.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        addScript.async = true;

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,bn",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                "google_translate_element"
            );
        };

        document.body.appendChild(addScript);
    }, []);

    return (
        <div className="flex justify-end">
            <div
                id="google_translate_element"
                className="bg-white rounded-lg px-2 py-1 text-black"
            />
        </div>
    );
}