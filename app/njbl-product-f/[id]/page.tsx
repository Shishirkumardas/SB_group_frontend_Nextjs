"use client";

import { useEffect, useState, useRef } from "react";
import { useParams} from "next/navigation";
import Link from "next/link";
import { X} from "lucide-react";
import {Loader2} from "lucide-react";
// import { useAuth } from "@/components/AuthContext";   // ← comment out if not needed

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    images?: string[];
    material?: string;
    description?: string;
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
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 2,
        name: "Food Package 2",
        price: 1030,
        imageUrl: "/images/products/package2.jpg",
        subCategory: "Food Packages",
        discount: 100,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 3,
        name: "Food Package 3",
        price: 1030,
        imageUrl: "/images/products/package3.jpg",
        subCategory: "Food Packages",
        discount: 100,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",

    },
    {
        id: 4,
        name: "Food Package 4",
        price: 1030,
        imageUrl: "/images/products/package4.jpg",
        subCategory: "Electronics",
        discount: 100,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 5,
        name: "Gas Stove",
        price: 4900,
        imageUrl: "/images/products/gas-stove.jpg",
        subCategory: "Electronics",
        discount: 61,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 6,
        name: "Rice cooker",
        price: 3500,
        imageUrl: "/images/products/rice-cooker.jpg",
        subCategory: "Electronics",
        discount: 57,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 7,
        name: "Pressure Cooker",
        price: 2000,
        imageUrl: "/images/products/pressure-cooker.jpg",
        subCategory: "Electronics",
        discount: 50,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 8,
        name: "Frypan",
        price: 1500,
        imageUrl: "/images/products/frypan.jpg",
        subCategory: "Food Packages",
        discount: 66.67,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 9,
        name: "Electric Cooker",
        price: 6000,
        imageUrl: "/images/products/electic cooker.jpg",
        subCategory: "Food Packages",
        discount: 50,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 10,
        name: "Electric Cooker",
        price: 10000,
        imageUrl: "/images/products/Electric cooker_brand.jpg",
        subCategory: "Food Packages",
        discount: 50,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    {
        id: 11,
        name: "LED TV 43 inch",
        price: 32000,
        imageUrl: "/images/products/led_tv.jpg",
        subCategory: "Food Packages",
        discount: 62.5,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    // Add the rest of your products here (same objects as in the list page)
    // ... copy-paste others and enhance with description / multiple images if desired
];

export default function ProductDetails() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    // const { userId, isLoading: authLoading, refreshAuth } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    const [showZoomLens, setShowZoomLens] = useState(false);
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });

    const imageRef = useRef<HTMLDivElement>(null);
    const ZOOM_FACTOR = 2.5;
    const LENS_SIZE = 180;

    useEffect(() => {
        setLoading(true);

        // Simulate "API" delay (optional – remove if you want instant)
        const timer = setTimeout(() => {
            const found = HARDCODED_PRODUCTS.find((p) => p.id === Number(id));
            setProduct(found || null);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [id]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(LENS_SIZE / 2, Math.min(rect.width - LENS_SIZE / 2, x));
        y = Math.max(LENS_SIZE / 2, Math.min(rect.height - LENS_SIZE / 2, y));

        setLensPosition({ x, y });
        setShowZoomLens(true);
    };

    const handleMouseLeave = () => {
        setShowZoomLens(false);
    };

    // const addToCart = () => {
    //     // Temporary fake cart logic
    //     alert(`Added ${quantity} × ${product?.name} to cart!\n(This is demo – no real cart yet)`);
    //     // If you still have auth/cart → keep your original logic
    // };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h2 className="text-3xl text-red-400">Product not found</h2>
                    <Link href="/njbl-products" className="text-emerald-400 underline hover:text-emerald-300">
                        ← Back to all products
                    </Link>
                </div>
            </div>
        );
    }

    const allImages = product.images?.length
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
            : ["/images/placeholder-product.jpg"];

    const mainImage = allImages[selectedImageIndex];
    const getBengaliDescription = (product: Product) => {
        const cashback = product.discount ?? 0;

        if (product.name.includes("Food Package")) {
            return `এই ফুড প্যাকেজটি আপনার পরিবারের দৈনন্দিন প্রয়োজনীয় খাদ্যসামগ্রী সরবরাহের জন্য প্রস্তুত করা হয়েছে। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই প্যাকেজ ক্রয়ের মাধ্যমে আপনি সর্বোচ্চ ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পেতে পারেন। 
ক্যাশব্যাকটি কোম্পানির নির্ধারিত নীতিমালা অনুযায়ী ধাপে ধাপে প্রদান করা হবে।`;
        }

        if (product.name.includes("Gas Stove")) {
            return `উচ্চমানের গ্যাস স্টোভ যা নিরাপদ এবং দীর্ঘস্থায়ী ব্যবহারের জন্য উপযোগী। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই পণ্য ক্রয়ের মাধ্যমে আপনি সর্বোচ্চ ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পেতে পারেন।`;
        }

        if (product.name.includes("Rice cooker")) {
            return `উচ্চমানের রাইস কুকার যা দ্রুত এবং সহজে ভাত রান্না করতে সাহায্য করে। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই পণ্য ক্রয়ের মাধ্যমে আপনি ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পাবেন।`;
        }

        if (product.name.includes("Pressure Cooker")) {
            return `প্রিমিয়াম মানের প্রেসার কুকার যা দ্রুত রান্না করতে সাহায্য করে এবং গ্যাস সাশ্রয়ী। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই পণ্য ক্রয়ের মাধ্যমে ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পাওয়া যাবে।`;
        }

        if (product.name.includes("Frypan")) {
            return `নন-স্টিক ফ্রাইপ্যান যা স্বাস্থ্যকর রান্নার জন্য উপযোগী এবং পরিষ্কার করা সহজ। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই পণ্য ক্রয়ের মাধ্যমে আপনি ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পেতে পারেন।`;
        }

        if (product.name.includes("Electric Cooker")) {
            return `উচ্চক্ষমতার ইলেকট্রিক কুকার যা দ্রুত ও নিরাপদ রান্নার জন্য উপযুক্ত। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই পণ্য ক্রয়ের মাধ্যমে সর্বোচ্চ ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পাওয়া যাবে।`;
        }

        if (product.name.includes("LED TV")) {
            return `৪৩ ইঞ্চি এলইডি টিভি যা উন্নতমানের ছবি ও শব্দ প্রদান করে। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

এই পণ্য ক্রয়ের মাধ্যমে আপনি ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পেতে পারেন।`;
        }

        return `এই পণ্যটি উন্নত মানের এবং দৈনন্দিন ব্যবহারের জন্য উপযোগী। 
পণ্যের মূল্য: ৳ ${product.price.toLocaleString()}।

ক্রয়ের মাধ্যমে সর্বোচ্চ ${cashback}% পর্যন্ত ক্যাশব্যাক সুবিধা পাওয়া যাবে।`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900 py-16 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 bg-emerald-900/20 backdrop-blur-xl border border-emerald-800 rounded-3xl p-10 shadow-2xl">

                {/* IMAGE SECTION */}
                <div className="space-y-6">
                    <div
                        ref={imageRef}
                        className="relative aspect-square rounded-3xl overflow-hidden bg-black border border-emerald-800 cursor-zoom-in shadow-xl"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => setShowLightbox(true)}
                    >

                        <img
                            src={mainImage}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition duration-500"
                            onError={(e) => (e.currentTarget.src = "/images/placeholder-product.jpg")}
                        />

                        {/* Discount badge */}
                        {product.discount && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                                -{product.discount}% Cashback
                            </div>
                        )}

                        {showZoomLens && (
                            <div
                                className="absolute border-2 border-emerald-400 rounded-lg pointer-events-none z-50 overflow-hidden shadow-2xl"
                                style={{
                                    width: LENS_SIZE,
                                    height: LENS_SIZE,
                                    left: lensPosition.x - LENS_SIZE / 2,
                                    top: lensPosition.y - LENS_SIZE / 2,
                                    backgroundImage: `url(${mainImage})`,
                                    backgroundSize: `${ZOOM_FACTOR * 100}%`,
                                    backgroundPosition: `${
                                        -((lensPosition.x - LENS_SIZE / 2) * ZOOM_FACTOR)
                                    }px ${-((lensPosition.y - LENS_SIZE / 2) * ZOOM_FACTOR)}px`,
                                }}
                            />
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-3 flex-wrap">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImageIndex(i)}
                                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition ${
                                        selectedImageIndex === i
                                            ? "border-emerald-400 scale-105"
                                            : "border-emerald-800 hover:border-emerald-500"
                                    }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="space-y-6">

                    {/* Category */}
                    {product.subCategory && (
                        <span className="inline-block bg-emerald-700/30 text-emerald-300 px-4 py-1 rounded-full text-sm font-medium">
{product.subCategory}
</span>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <p className="text-4xl font-bold text-emerald-400">
                            ৳ {product.price.toLocaleString()}
                        </p>

                        {product.discount && (
                            <span className="text-xl text-red-400 font-semibold">
-{product.discount}%
</span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-line">
                        {getBengaliDescription(product)}
                    </p>

                    {/* Quantity selector */}
                    <div className="flex items-center gap-4 pt-4">

                        <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xl transition"
                        >
                            −
                        </button>

                        <span className="text-2xl font-bold text-white w-12 text-center">
{quantity}
</span>

                        <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xl transition"
                        >
                            +
                        </button>

                    </div>

                    {/* Cashback highlight */}
                    <div className="bg-emerald-900/40 border border-emerald-700 rounded-xl p-4 text-emerald-200 text-sm">
                        ✓ এই পণ্য ক্রয়ের মাধ্যমে আপনি সর্বোচ্চ{" "}
                        <span className="font-bold text-emerald-300">
{product.discount ?? 0}%
</span>{" "}
                        ক্যাশব্যাক সুবিধা পেতে পারেন।
                    </div>

                    {/* CTA Button */}
                    {/*<button*/}
                    {/*    onClick={addToCart}*/}
                    {/*    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-900"*/}
                    {/*>*/}
                    {/*    <ShoppingCart size={22} />*/}
                    {/*    Add to Cart*/}
                    {/*</button>*/}

                </div>
            </div>

            {/* LIGHTBOX */}
            {showLightbox && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={() => setShowLightbox(false)}
                >

                    <button
                        className="absolute top-8 right-8 text-white p-3 rounded-full hover:bg-white/10"
                        onClick={() => setShowLightbox(false)}
                    >
                        <X size={40} />
                    </button>

                    <img
                        src={mainImage}
                        alt={product.name}
                        className="max-h-[92vh] max-w-[96vw] object-contain"
                    />

                </div>
            )}
        </div>
    );
}