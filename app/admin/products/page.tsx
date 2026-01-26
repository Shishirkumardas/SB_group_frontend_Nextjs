"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Loader2, Edit, Search, AlertCircle } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:8080/api/products", {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to load products");

                const data = await res.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                setError("Could not load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            String(p.id).includes(term)
        );

        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const deleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to permanently delete this product?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Delete failed");

            setProducts(prev => prev.filter(p => p.id !== id));
            setFilteredProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("Failed to delete product. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-950">
                <div className="text-center space-y-5">
                    <Loader2 className="h-14 w-14 animate-spin text-emerald-400 mx-auto" />
                    <p className="text-emerald-300 font-medium text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-emerald-100 tracking-tight">
                            Manage Products
                        </h1>
                        <p className="mt-2 text-emerald-300/90">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                        <input
                            type="text"
                            placeholder="Search by name, category, ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 bg-emerald-950 border border-emerald-700 rounded-full text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 p-5 bg-red-950/60 border-l-4 border-red-700 text-red-300 rounded-xl flex items-center gap-4 shadow-inner">
                        <AlertCircle className="h-6 w-6 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Products Table / Cards */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-emerald-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-16 text-center border border-emerald-800/40">
                        <div className="mx-auto w-20 h-20 bg-emerald-950/50 rounded-full flex items-center justify-center mb-6 border border-emerald-700/30">
                            <AlertCircle className="h-10 w-10 text-emerald-500/70" />
                        </div>
                        <h3 className="text-2xl font-serif font-medium text-emerald-100 mb-3">
                            No products found
                        </h3>
                        <p className="text-emerald-300/80 max-w-md mx-auto">
                            {searchTerm ? "Try adjusting your search" : "No products in the catalog yet"}
                        </p>
                    </div>
                ) : (
                    <div className="bg-emerald-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-800/40 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-emerald-800/50">
                                <thead className="bg-emerald-950/60">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-5 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-5 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-5 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-5 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-5 text-right text-xs font-medium text-emerald-300 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-800/40">
                                {filteredProducts.map(product => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-emerald-950/50 transition-colors"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="h-14 w-14 rounded-lg overflow-hidden bg-emerald-950 border border-emerald-800/50 shadow-inner">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={`http://localhost:8080${product.imageUrl}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={e => {
                                                            (e.target as HTMLImageElement).src = "/images/placeholder-product.jpg";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-emerald-600 text-xs font-medium">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-emerald-100">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-emerald-400 mt-1">
                                                ID: {product.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-emerald-300">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-emerald-100">
                                            ৳ {product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${
                                                    product.stock > 10
                                                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700/50"
                                                        : product.stock > 0
                                                            ? "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                                                            : "bg-red-950/60 text-red-300 border border-red-800/50"
                                                }`}>
                                                    {product.stock} in stock
                                                </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-5">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                    title="Edit product"
                                                >
                                                    <Edit size={20} />
                                                </Link>

                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className={`text-red-400 hover:text-red-300 transition-colors ${
                                                        deletingId === product.id ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                                    title="Delete product"
                                                >
                                                    {deletingId === product.id ? (
                                                        <Loader2 className="animate-spin" size={20} />
                                                    ) : (
                                                        <Trash2 size={20} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}