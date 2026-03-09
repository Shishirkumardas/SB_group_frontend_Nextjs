"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShoppingCart, X } from "lucide-react";
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
        name: "Premium Organic Food Package – Family",
        price: 2850,
        images: ["/images/products/food-package-family.jpg", "/images/products/food-package-family-2.jpg"],
        subCategory: "Food Packages",
        discount: 15,
        description:
            "Complete monthly grocery solution for a family of 4–5 persons. Includes premium rice, dal, oil, spices and more.",
    },
    {
        id: 4,
        name: "Smart LED TV 43″ – NJBL Vision",
        price: 32800,
        imageUrl: "/images/products/led-tv-43.jpg",
        subCategory: "Electronics",
        description:
            "43-inch Full HD Smart LED TV with Android OS, voice control, Netflix, YouTube, and many more apps pre-installed.",
    },
    {
        id: 5,
        name: "Bluetooth Soundbar with Subwoofer",
        price: 7800,
        imageUrl: "/images/products/soundbar.jpg",
        subCategory: "Electronics",
        discount: 12,
        description: "2.1 channel soundbar with powerful wireless subwoofer. Perfect for movies and music.",
    },
    // Add the rest of your products here (same objects as in the list page)
    // ... copy-paste others and enhance with description / multiple images if desired
];

export default function ProductDetails() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const router = useRouter();
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

    const addToCart = () => {
        // Temporary fake cart logic
        alert(`Added ${quantity} × ${product?.name} to cart!\n(This is demo – no real cart yet)`);
        // If you still have auth/cart → keep your original logic
    };

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

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
            {/* Image + zoom */}
            <div className="space-y-6">
                <div
                    ref={imageRef}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowLightbox(true)}
                >
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/images/placeholder-product.jpg")}
                    />

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

                {allImages.length > 1 && (
                    <div className="flex gap-3 flex-wrap">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImageIndex(i)}
                                className={`h-20 w-20 border-2 rounded-lg overflow-hidden transition-all ${
                                    selectedImageIndex === i
                                        ? "border-emerald-500 shadow-md"
                                        : "border-emerald-800 hover:border-emerald-600"
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="space-y-6">
                <h1 className="text-4xl font-serif text-emerald-50">{product.name}</h1>

                <p className="text-4xl font-bold text-emerald-200">
                    ৳ {product.price.toLocaleString()}
                    {product.discount && (
                        <span className="ml-4 text-2xl text-red-400">-{product.discount}%</span>
                    )}
                </p>

                {product.subCategory && (
                    <p className="text-emerald-400 font-medium">{product.subCategory}</p>
                )}

                {product.description && (
                    <p className="text-emerald-300 leading-relaxed text-lg">{product.description}</p>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-6 py-3 border border-emerald-700 rounded-lg hover:bg-emerald-900 text-emerald-200 text-xl"
                    >
                        −
                    </button>
                    <span className="text-2xl font-medium w-14 text-center text-emerald-100">
            {quantity}
          </span>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-6 py-3 border border-emerald-700 rounded-lg hover:bg-emerald-900 text-emerald-200 text-xl"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={addToCart}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-10 py-5 rounded-xl font-medium text-xl transition flex items-center gap-3 shadow-lg w-full md:w-auto justify-center"
                >
                    <ShoppingCart size={22} />
                    Add to Cart
                </button>

                <div className="pt-6 text-sm text-emerald-400/80">
                    <p>✓ Cash on Delivery available</p>
                    <p>✓ 7 days replacement policy</p>
                </div>
            </div>

            {/* Lightbox */}
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