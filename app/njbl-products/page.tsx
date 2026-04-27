// app/njbl-products/page.tsx
// Server Component – fetches data, renders layout, delegates client logic to FiltersClient

import { Suspense } from "react";
import FiltersClient from "@/components/ProductFilters"; // adjust path if needed

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    material?: string;
    discount?: number;
    subCategory?: string;
}

export default async function NJBLShareePage() {
    let products: Product[] = [];
    let error = "";

    try {
        const res = await fetch("http://localhost:8080/api/products?category=NJBL Products", {
            credentials: "include",
            cache: "no-store", // or "force-cache" if you want static caching
        });

        if (!res.ok) {
            throw new Error("Failed to load products");
        }

        const data = await res.json();
        products = Array.isArray(data) ? data : data.products || [];
    } catch (err: any) {
        error = err.message || "Could not load products. Please try again later.";
    }

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero */}
            <section
                className="relative h-80 md:h-[500px] bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: `url('/images/njbl-hero.jpg')` }}
            >
                <div className="absolute inset-0 bg-black/65" />
                <div className="relative z-10 px-6 max-w-5xl">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-wider mb-6 text-emerald-50 drop-shadow-lg">
                        New Journey Bangladesh Limited
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl font-light text-emerald-200 drop-shadow-md">
                        Quality Product, Economic sustainability
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Client-side filters + product grid */}
                <Suspense
                    fallback={
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
                            <span className="ml-4 text-emerald-300 text-xl">Loading products...</span>
                        </div>
                    }
                >
                    <FiltersClient products={products} error={error} />
                </Suspense>
            </div>
        </div>
    );
}