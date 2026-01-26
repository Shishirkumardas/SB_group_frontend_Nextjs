"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";

// Reuse categories from your Navbar (all included)
const mainCategories = [
    {
        title: "NJBL Products",
        subcategories: [
            "Food Packages",
            "Electronics",
        ],
    },
    {
        title: "Sister Concern",
        subcategories: [
            "SB Medical College & Hospital",
            "SB Health & Education Society",
            "RM Apon Housing",
            "SB 3 Star Hotel",
            "SB Resort & Housing",
            "SB Developer",
            "SB Construction",
            "SB Pharmaceuticals"
        ],
    },
    {
        title: "Projects",
        subcategories: [
            "Shopping Mall Director",
            "Shopping Mall Share Holder",
            "Dealer",
            "Depo"
        ],
    },
    { title: "About Us", subcategories: [] }
];

export default function AddProductPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subCategory: "",
        brand: "SB GROUP",
    });

    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);

    const [extraImagesPreview, setExtraImagesPreview] = useState<string[]>([]);
    const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const currentCategory = mainCategories.find((c) => c.title === formData.category);
    const availableSubCategories = currentCategory?.subcategories || [];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "category") {
            setFormData((prev) => ({ ...prev, subCategory: "" }));
        }
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            setError("Main image must be less than 50MB");
            return;
        }

        setMainImageFile(file);
        setError("");

        const reader = new FileReader();
        reader.onloadend = () => setMainImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(
            (file) => file.type.startsWith("image/") && file.size <= 50 * 1024 * 1024
        );

        if (validFiles.length < files.length) {
            setError("Some files skipped (only images ≤ 50MB allowed)");
        }

        setExtraImageFiles((prev) => [...prev, ...validFiles]);

        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setExtraImagesPreview((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMainImage = () => {
        setMainImageFile(null);
        setMainImagePreview(null);
    };

    const removeExtraImage = (index: number) => {
        setExtraImageFiles((prev) => prev.filter((_, i) => i !== index));
        setExtraImagesPreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!formData.category) {
            setError("Please select a category");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("category", formData.category);
            data.append("subCategory", formData.subCategory || "");
            data.append("brand", formData.brand);

            if (mainImageFile) {
                data.append("image", mainImageFile);
            }

            extraImageFiles.forEach((file) => {
                data.append("images", file);
            });

            const res = await fetch("http://localhost:8080/api/admin/products", {
                method: "POST",
                body: data,
                credentials: "include",
            });

            if (!res.ok) {
                let errMsg = `Server error: ${res.status}`;
                try {
                    const errData = await res.json();
                    errMsg = errData.message || errMsg;
                } catch {}
                throw new Error(errMsg);
            }

            setSuccess("Product added successfully!");

            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                subCategory: "",
                brand: "SB Group",
            });
            setMainImageFile(null);
            setMainImagePreview(null);
            setExtraImageFiles([]);
            setExtraImagesPreview([]);
        } catch (err: any) {
            setError(err.message || "Failed to add product");
            console.error("Add product error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-emerald-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-800/40 p-8">
                <h1 className="text-4xl font-serif font-bold text-emerald-100 mb-10 text-center tracking-tight">
                    Add New Product
                </h1>

                {error && (
                    <div className="bg-red-950/60 border-l-4 border-red-700 text-red-300 p-5 mb-8 rounded-xl shadow-inner">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-950/60 border-l-4 border-emerald-600 text-emerald-200 p-5 mb-8 rounded-xl shadow-inner">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-y"
                        />
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                                Price (৳) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                required
                                min="1"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                                Stock *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                            required
                        >
                            <option value="">Select Category</option>
                            {mainCategories.map((cat) => (
                                <option key={cat.title} value={cat.title} className="bg-emerald-950 text-emerald-100">
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sub-category */}
                    {formData.category && availableSubCategories.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                                Sub-category *
                            </label>
                            <select
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                                required
                            >
                                <option value="">Select Sub-category</option>
                                {availableSubCategories.map((sub) => (
                                    <option key={sub} value={sub} className="bg-emerald-950 text-emerald-100">
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Brand *
                        </label>
                        <select
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                            required
                        >
                            <option value="SB Group" className="bg-emerald-950 text-emerald-100">SB Group</option>
                            <option value="NJBL" className="bg-emerald-950 text-emerald-100">NJBL</option>
                        </select>
                    </div>

                    {/* Main Image */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Main Product Image
                        </label>
                        <div className={`mt-2 flex justify-center px-6 pt-8 pb-10 border-2 border-dashed rounded-xl transition-all ${mainImagePreview ? "border-emerald-600 bg-emerald-950/40" : "border-emerald-700 bg-emerald-950/30 hover:border-emerald-500"}`}>
                            {mainImagePreview ? (
                                <div className="relative">
                                    <img
                                        src={mainImagePreview}
                                        alt="Preview"
                                        className="max-h-64 object-contain rounded-xl border border-emerald-700/50 shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeMainImage}
                                        className="absolute top-3 right-3 bg-red-900/80 hover:bg-red-800 text-white p-2 rounded-full shadow-lg transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 text-center">
                                    <Upload className="mx-auto h-14 w-14 text-emerald-500/70" />
                                    <div className="flex text-sm text-emerald-400">
                                        <label className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300">
                                            <span>Upload main image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleMainImageChange}
                                            />
                                        </label>
                                        <p className="pl-2">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-emerald-500">PNG, JPG, GIF up to 50MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Images */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Additional Images (optional - multiple allowed)
                        </label>
                        <div className="mt-2 flex justify-center px-6 pt-8 pb-10 border-2 border-dashed border-emerald-700 rounded-xl bg-emerald-950/30 hover:border-emerald-500 transition-all">
                            <div className="space-y-3 text-center">
                                <Upload className="mx-auto h-14 w-14 text-emerald-500/70" />
                                <label className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300">
                                    <span>Upload more images</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="sr-only"
                                        onChange={handleExtraImagesChange}
                                    />
                                </label>
                                <p className="text-xs text-emerald-500">PNG, JPG, GIF up to 50MB each</p>
                            </div>
                        </div>

                        {/* Preview thumbnails */}
                        {extraImagesPreview.length > 0 && (
                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                                {extraImagesPreview.map((preview, index) => (
                                    <div key={index} className="relative group rounded-xl overflow-hidden border border-emerald-800/50 shadow-md hover:shadow-xl transition-all">
                                        <img
                                            src={preview}
                                            alt={`Extra preview ${index + 1}`}
                                            className="h-32 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExtraImage(index)}
                                            className="absolute top-2 right-2 bg-red-900/80 hover:bg-red-800 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 px-8 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-medium text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all mt-10"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-6 w-6" />
                                Adding Product...
                            </>
                        ) : (
                            "Add Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}