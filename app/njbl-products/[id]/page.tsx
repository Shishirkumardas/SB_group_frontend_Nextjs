"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

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

export default function ProductDetails() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const router = useRouter();
    const { userId, isLoading: authLoading, refreshAuth } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    // Zoom states
    const [showZoomLens, setShowZoomLens] = useState(false);
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });

    // const imageRef = useRef<HTMLDivElement | null>(null);

    const ZOOM_FACTOR = 2.5;
    const LENS_SIZE = 180; // px

    useEffect(() => {
        const init = async () => {
            await refreshAuth();

            if (!id) return;

            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8080/api/products/${id}`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to load product");

                const data = await res.json();
                setProduct(data);
            } catch (err: any) {
                setError(err.message || "Could not load product details");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [id, refreshAuth]);

    // ─── Zoom handlers ─────────────────────────────────────────────
    // At the top of your component
    const imageRef = useRef<HTMLDivElement>(null);   // ← use this one

// Your mouse move handler (make sure it has this guard)
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

    // ─── Cart logic ────────────────────────────────────────────────
    const addToCart = async () => {
        if (!userId) {
            router.push("/account");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: Number(id), quantity }),
            });

            if (!res.ok) throw new Error("Failed to add to cart");

            alert("Added to cart successfully!");
        } catch (err: any) {
            alert(err.message || "Could not add to cart");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }

    if (!product || error || !id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-600">{error || "Product not found"}</p>
                    <Link href="/" className="text-indigo-600 underline">
                        Go back
                    </Link>
                </div>
            </div>
        );
    }

    const allImages =
        product.images?.length
            ? product.images
            : product.imageUrl
                ? [product.imageUrl]
                : ["/images/placeholder-product.jpg"];

    const mainImage = allImages[selectedImageIndex];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
            {/* Image + zoom container */}
            <div className="space-y-6">
                <div
                    ref={imageRef}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowLightbox(true)}
                >
                    <img
                        src={`http://localhost:8080${mainImage}`}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "/images/placeholder-product.jpg";
                        }}
                    />

                    {showZoomLens && imageRef.current && (
                        <div
                            className="absolute border-2 border-indigo-500 rounded-lg pointer-events-none z-50 overflow-hidden shadow-xl"
                            style={{
                                width: LENS_SIZE,
                                height: LENS_SIZE,
                                left: lensPosition.x - LENS_SIZE / 2,
                                top: lensPosition.y - LENS_SIZE / 2,
                                backgroundImage: `ur[](http://localhost:8080${mainImage})`,
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
                                className={`h-20 w-20 border-2 rounded-lg overflow-hidden transition-all ${
                                    selectedImageIndex === i
                                        ? "border-indigo-600 shadow-md"
                                        : "border-gray-200 hover:border-gray-400"
                                }`}
                            >
                                <img
                                    src={`http://localhost:8080${img}`}
                                    alt={`Product thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product details */}
            <div className="space-y-6">
                <h1 className="text-4xl font-serif">{product.name}</h1>

                <p className="text-3xl font-bold">
                    ৳ {product.price.toLocaleString()}
                </p>

                {product.description && (
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                )}

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-5 py-2.5 border rounded hover:bg-gray-50"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="text-xl font-medium w-12 text-center">
            {quantity}
          </span>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-5 py-2.5 border rounded hover:bg-gray-50"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={addToCart}
                    className="bg-black text-white px-10 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
                >
                    <ShoppingCart size={20} />
                    Add to Cart
                </button>
            </div>

            {/* Lightbox */}
            {showLightbox && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={() => setShowLightbox(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10"
                        onClick={() => setShowLightbox(false)}
                        aria-label="Close lightbox"
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={`http://localhost:8080${mainImage}`}
                        alt={product.name}
                        className="max-h-[90vh] max-w-[95vw] object-contain"
                    />
                </div>
            )}
        </div>
    );
}