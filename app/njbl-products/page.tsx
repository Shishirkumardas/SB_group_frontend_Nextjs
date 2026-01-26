"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    material?: string;
    discount?: number;
    subCategory?: string;
}

export default function NJBLShareePage() {
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [selectedSubCategory, setSelectedSubCategory] = useState(
        searchParams.get("sub") || ""
    );

    const subCategories = [
        "All",
        "Food Packages",
        "Electronics"
        // add more as needed
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8080/api/products?category=NJBL Products", {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to load item");

                const data = await res.json();
                const productList = Array.isArray(data) ? data : data.products || [];
                setProducts(productList);
            } catch (err: any) {
                setError(err.message || "Could not load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const subFromUrl = searchParams.get("sub") || "";
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

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
    });

    const filteredProducts = selectedSubCategory && selectedSubCategory !== "All"
        ? sortedProducts.filter(p => p.subCategory === selectedSubCategory)
        : sortedProducts;

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero */}
            <section className="relative h-80 md:h-[500px] bg-[url('/shreyoshi-hero.jpg')] bg-cover bg-center flex items-center justify-center text-center">
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
                {/* Filters */}
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
                            {subCategories.map(sub => (
                                <option key={sub} value={sub} className="bg-emerald-950 text-emerald-100">
                                    {sub}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-5 py-3.5 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none shadow-inner min-w-[220px]"
                        >
                            <option value="newest" className="bg-emerald-950 text-emerald-100">Newest First</option>
                            <option value="price-low" className="bg-emerald-950 text-emerald-100">Price: Low to High</option>
                            <option value="price-high" className="bg-emerald-950 text-emerald-100">Price: High to Low</option>
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

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-16 w-16 text-emerald-400" />
                    </div>
                ) : error ? (
                    <p className="text-red-400 text-center text-2xl font-medium py-20">{error}</p>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-emerald-300 text-2xl font-medium">
                            No sarees found {selectedSubCategory ? `in "${selectedSubCategory}"` : ""}
                        </p>
                        <p className="text-emerald-400 mt-4">
                            Try changing the filter or check back later
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/njbl-products/${product.id}`}
                                className="group relative bg-emerald-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-emerald-800/50 hover:border-emerald-600/70 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-emerald-950">
                                    <img
                                        src={product.imageUrl ? `http://localhost:8080${product.imageUrl}` : "/images/placeholder-shreyoshi.jpg"}
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

                <div className="text-center mt-16">
                    <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-12 py-5 rounded-full font-medium text-xl transition shadow-xl disabled:opacity-50">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
}