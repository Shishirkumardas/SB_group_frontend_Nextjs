'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Product {
    id?: number;
    barcode: string;
    name: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<Product>({
        barcode: '',
        name: '',
        price: 0,
        stock: 0,
        category: ''
    });

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/shoppingmall-products', {
                credentials: "include",   // ← This is the key (same as your working pages)
            });

            if (!res.ok) {
                if (res.status === 403) {
                    alert("Access Denied. Please login as Admin.");
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Fetch error:", err);
            alert("Failed to load products");
        }
    };

    // Save Product (Create / Update)
    const saveProduct = async () => {
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const url = editingProduct
                ? `http://localhost:8080/api/shoppingmall-products/${editingProduct.id}`
                : 'http://localhost:8080/api/shoppingmall-products';

            const res = await fetch(url, {
                method,
                credentials: "include",           // ← Important
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                if (res.status === 403) alert("Access Denied. Admin only.");
                else alert("Failed to save product");
                return;
            }

            setIsOpen(false);
            setEditingProduct(null);
            setForm({ barcode: '', name: '', price: 0, stock: 0, category: '' });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
    };

    // Delete Product
    const deleteProduct = async (id: number) => {
        if (!confirm("Delete this product?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/shoppingmall-products/${id}`, {
                method: 'DELETE',
                credentials: "include",           // ← Important
            });

            if (res.ok) {
                alert("Product deleted successfully");
                fetchProducts();
            } else if (res.status === 403) {
                alert("Access Denied. You need Admin privileges.");
            } else {
                alert("Failed to delete product");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting product");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Products Management</h1>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingProduct(null)}>
                                <Plus className="mr-2" /> Add New Product
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Barcode</Label>
                                    <Input
                                        value={form.barcode}
                                        onChange={(e) => setForm({...form, barcode: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <Label>Product Name</Label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm({...form, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Price (৳)</Label>
                                        <Input
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => setForm({...form, price: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            value={form.stock}
                                            onChange={(e) => setForm({...form, stock: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <Input
                                        value={form.category}
                                        onChange={(e) => setForm({...form, category: e.target.value})}
                                    />
                                </div>
                                <Button onClick={saveProduct} className="w-full">
                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Barcode</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-mono">{p.barcode}</TableCell>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>৳{p.price}</TableCell>
                                        <TableCell>{p.stock}</TableCell>
                                        <TableCell>{p.category}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingProduct(p);
                                                    setForm(p);
                                                    setIsOpen(true);
                                                }}
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteProduct(p.id!)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}