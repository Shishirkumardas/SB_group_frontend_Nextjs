// components/FiltersClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    material?: string;
    discount?: number;
    subCategory?: string;
}

// ← Fixed: Added 'error' to the props interface
interface FiltersClientProps {
    products: Product[];
    error: string;
}

export default function FiltersClient({ products, error }: FiltersClientProps) {
    const searchParams = useSearchParams();

    const [selectedSubCategory, setSelectedSubCategory] = useState(
        searchParams.get("sub") || "All"
    );
    const [sortBy, setSortBy] = useState("newest");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const subCategories = ["All", "Food Packages", "Electronics"];

    useEffect(() => {
        const subFromUrl = searchParams.get("sub") || "All";
        setSelectedSubCategory(subFromUrl);
    }, [searchParams]);

    const handleSubCategoryChange = (value: string) => {
        setSelectedSubCategory(value);

        const params = new URLSearchParams(window.location.search);
        if (value && value !== "All") {
            params.set("sub", value);
        } else {
            params.delete("sub");
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl || window.location.pathname);
    };

    const displayedProducts = useMemo(() => {
        let result = [...products];

        if (selectedSubCategory !== "All") {
            result = result.filter((p) => p.subCategory === selectedSubCategory);
        }

        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, selectedSubCategory, sortBy]);

    if (error) {
        return (
            <p className="text-red-400 text-center text-2xl font-medium py-20">{error}</p>
        );
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="text-4xl font-serif font-bold text-emerald-100 tracking-tight">
                    NJBL Products
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                    <select
                        value={selectedSubCategory}
                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                        className="px-5 py-3.5 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-inner min-w-[180px]"
                    >
                        {subCategories.map((sub) => (
                            <option key={sub} value={sub} className="bg-emerald-950 text-emerald-100">
                                {sub}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-5 py-3.5 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-inner min-w-[220px]"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>

                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-300 hover:bg-emerald-900/70 transition shadow-inner"
                    >
                        <Filter size={18} />
                        Filters
                        {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            {displayedProducts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-emerald-300 text-2xl font-medium">
                        No products found {selectedSubCategory !== "All" ? `in "${selectedSubCategory}"` : ""}
                    </p>
                    <p className="text-emerald-400 mt-4">Try changing the filter</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/njbl-products/${product.id}`}
                            className="group relative bg-emerald-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-emerald-800/50 hover:border-emerald-600/70 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-emerald-950">
                                <img
                                    src={product.imageUrl ? `http://localhost:8080${product.imageUrl}` : "/images/placeholder-product.jpg"}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {product.discount && (
                                    <span className="absolute top-4 left-4 bg-red-900/90 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-red-800/50">
                    {product.discount}% OFF
                  </span>
                                )}
                            </div>
                            <div className="p-6">
                                {product.subCategory && (
                                    <p className="text-sm text-emerald-400 mb-2 font-medium">{product.subCategory}</p>
                                )}
                                <h3 className="font-serif text-xl font-medium text-emerald-100 mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-emerald-200 font-medium text-lg">
                                    ৳ {product.price.toLocaleString()}
                                </p>
                                {product.material && (
                                    <p className="text-sm text-emerald-400 mt-2 italic">{product.material}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}