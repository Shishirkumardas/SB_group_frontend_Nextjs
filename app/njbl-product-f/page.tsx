// app/njbl-products/page.tsx
// This is a Server Component — no client hooks here

import { Suspense } from "react";
import FiltersClient from "@/components/FiltersClient"; // ← adjust this path to match your folder structure

// Product type & hardcoded data (safe in server component)
interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    material?: string;
    discount?: number;
    subCategory?: string;
}

const HARDCODED_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Food Package 1",
        price: 1030,
        imageUrl: "/images/products/package1.jpg",
        subCategory: "Food Packages",
        discount: 100,
    },
    {
        id: 2,
        name: "Food Package 2",
        price: 1030,
        imageUrl: "/images/products/package2.jpg",
        subCategory: "Food Packages",
        discount: 100,
    },
    {
        id: 3,
        name: "Food Package 3",
        price: 1030,
        imageUrl: "/images/products/package3.jpg",
        subCategory: "Food Packages",
        discount: 100,

    },
    {
        id: 4,
        name: "Food Package 4",
        price: 1030,
        imageUrl: "/images/products/package4.jpg",
        subCategory: "Electronics",
        discount: 100,
    },
    {
        id: 5,
        name: "Gas Stove",
        price: 4900,
        imageUrl: "/images/products/gas-stove.jpg",
        subCategory: "Electronics",
        discount: 61,
    },
    {
        id: 6,
        name: "Rice cooker",
        price: 3500,
        imageUrl: "/images/products/rice-cooker.jpg",
        subCategory: "Electronics",
        discount: 57,
    },
    {
        id: 7,
        name: "Pressure Cooker",
        price: 2000,
        imageUrl: "/images/products/pressure-cooker.jpg",
        subCategory: "Electronics",
        discount: 50,
    },
    {
        id: 8,
        name: "Frypan",
        price: 1500,
        imageUrl: "/images/products/frypan.jpg",
        subCategory: "Food Packages",
        discount: 66.67,
    },
    {
        id: 9,
        name: "Electric Cooker",
        price: 6000,
        imageUrl: "/images/products/electic cooker.jpg",
        subCategory: "Food Packages",
        discount: 50,
    },
    {
        id: 10,
        name: "Electric Cooker",
        price: 10000,
        imageUrl: "/images/products/Electric cooker_brand.jpg",
        subCategory: "Food Packages",
        discount: 50,
    },
    {
        id: 11,
        name: "LED TV 43 inch",
        price: 32000,
        imageUrl: "/images/products/led_tv.jpg",
        subCategory: "Food Packages",
        discount: 62.5,
    },
    // You can add more products here...
];

export default function NJBLShareePage() {
    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero – pure static */}
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
                        <div
                            className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 animate-pulse">
                            <div className="h-10 w-48 bg-emerald-800/50 rounded-xl"/>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="h-12 w-48 bg-emerald-800/50 rounded-xl"/>
                                <div className="h-12 w-56 bg-emerald-800/50 rounded-xl"/>
                                <div className="h-12 w-32 bg-emerald-800/50 rounded-xl"/>
                            </div>
                        </div>
                    }
                >
                    <FiltersClient products={HARDCODED_PRODUCTS}/>
                </Suspense>
            </div>
        </div>
    );
}