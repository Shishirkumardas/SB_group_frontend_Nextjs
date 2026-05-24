'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Barcode } from 'lucide-react';
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

    const [form, setForm] = useState<Product>({
        barcode: '', name: '', price: 0, stock: 0, category: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('http://localhost:8080/api/shoppingmall-products');
        const data = await res.json();
        setProducts(data);
    };

    const saveProduct = async () => {
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct
            ? `http://localhost:8080/api/shoppingmall-products/${editingProduct.id}`
            : 'http://localhost:8080/api/shoppingmall-products';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        setIsOpen(false);
        setEditingProduct(null);
        setForm({ barcode: '', name: '', price: 0, stock: 0, category: '' });
        fetchProducts();
    };

    const deleteProduct = async (id: number) => {
        if (confirm("Delete this product?")) {
            await fetch(`http://localhost:8080/api/shoppingmall-products/${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

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
                                    <Input value={form.barcode} onChange={(e) => setForm({...form, barcode: e.target.value})} />
                                </div>
                                <div>
                                    <Label>Product Name</Label>
                                    <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Price (৳)</Label>
                                        <Input type="number" value={form.price} onChange={(e) => setForm({...form, price: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <Label>Stock</Label>
                                        <Input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
                                </div>
                                <Button onClick={saveProduct} className="w-full">Save Product</Button>
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
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => { setEditingProduct(p); setForm(p); setIsOpen(true); }}>
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="destructive" size="sm" className="ml-2" onClick={() => deleteProduct(p.id!)}>
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