'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_BASE = 'http://localhost:8080';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [form, setForm] = useState({
        barcode: '',
        name: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        category: ''
    });
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    });

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/shoppingMall-products/${id}`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setForm(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/shoppingMall-products/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert('✅ Product Updated Successfully');
                router.push('/products');
            } else {
                alert('Failed to update');
            }
        } catch (e) {
            alert('Server Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl text-green-800">Edit Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Same form fields as Add page */}
                            <div>
                                <Label>Barcode</Label>
                                <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Product Name</Label>
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (৳)</Label>
                                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                                </div>
                                <div>
                                    <Label>Discount Price (৳)</Label>
                                    <Input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Stock</Label>
                                    <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1 bg-green-700 hover:bg-green-800" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Product'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push('/products')}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}