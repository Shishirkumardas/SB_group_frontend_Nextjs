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

const HARDCODED_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Premium Organic Food Package – Family",
        price: 2850,
        imageUrl: "/images/products/food-package-family.jpg",
        subCategory: "Food Packages",
        discount: 15,
    },
    {
        id: 2,
        name: "Deluxe Rice & Dal Combo (10 kg)",
        price: 1650,
        imageUrl: "/images/products/rice-dal-combo.jpg",
        subCategory: "Food Packages",
    },
    {
        id: 3,
        name: "Cooking Oil 5L + Spices Gift Pack",
        price: 920,
        imageUrl: "/images/products/oil-spices-pack.jpg",
        subCategory: "Food Packages",
        discount: 8,
    },
    {
        id: 4,
        name: "Smart LED TV 43″ – NJBL Vision",
        price: 32800,
        imageUrl: "/images/products/led-tv-43.jpg",
        subCategory: "Electronics",
    },
    {
        id: 5,
        name: "Bluetooth Soundbar with Subwoofer",
        price: 7800,
        imageUrl: "/images/products/soundbar.jpg",
        subCategory: "Electronics",
        discount: 12,
    },
    {
        id: 6,
        name: "Ceiling Fan – Energy Saving 3 Blade",
        price: 3850,
        imageUrl: "/images/products/ceiling-fan.jpg",
        subCategory: "Electronics",
    },
    {
        id: 7,
        name: "Instant Water Heater 3kW",
        price: 4900,
        imageUrl: "/images/products/water-heater.jpg",
        subCategory: "Electronics",
    },
    {
        id: 8,
        name: "Monthly Grocery Essentials Box",
        price: 4200,
        imageUrl: "/images/products/monthly-grocery-box.jpg",
        subCategory: "Food Packages",
        discount: 10,
    },
    // You can add 10–30 more items here...
];

export default function NJBLShareePage() {
    const searchParams = useSearchParams();

    const [products] = useState<Product[]>(HARDCODED_PRODUCTS);
    const [sortBy, setSortBy] = useState("newest");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [selectedSubCategory, setSelectedSubCategory] = useState(
        searchParams.get("sub") || "All"
    );

    const subCategories = [
        "All",
        "Food Packages",
        "Electronics",
        // add more categories if you add them to products
    ];

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

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        // "newest" → just keep original order (or you can add createdAt if needed)
        return 0;
    });

    const filteredProducts =
        selectedSubCategory && selectedSubCategory !== "All"
            ? sortedProducts.filter((p) => p.subCategory === selectedSubCategory)
            : sortedProducts;

    return (
        <div className="min-h-screen bg-emerald-950">
            {/* Hero */}
            <section
                className="relative h-80 md:h-[500px] bg-cover bg-center flex items-center justify-center text-center"
                style={{
                    backgroundImage: `url('/images/njbl-hero.jpg')`,
                }}
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

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-emerald-300 text-2xl font-medium">
                            No products found {selectedSubCategory !== "All" ? `in "${selectedSubCategory}"` : ""}
                        </p>
                        <p className="text-emerald-400 mt-4">Try changing the filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/njbl-product-f/${product.id}`}
                                className="group relative bg-emerald-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-emerald-800/50 hover:border-emerald-600/70 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-emerald-950">
                                    <img
                                        src={product.imageUrl || "/images/placeholder-product.jpg"}
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
                    <button
                        disabled
                        className="bg-emerald-800 text-white/70 px-12 py-5 rounded-full font-medium text-xl shadow-xl cursor-not-allowed"
                    >
                        All products loaded
                    </button>
                </div>
            </div>
        </div>
    );
}