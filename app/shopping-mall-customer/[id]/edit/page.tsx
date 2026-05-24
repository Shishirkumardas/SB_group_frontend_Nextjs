'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Customer {
    id: number | string;
    name: string;
    phone: string;
    purchaseAmount?: number;
    paidAmount?: number;
    dueAmount?: number;
    // Add more fields if your entity has them (address, email, notes, etc.)
    address?: string;
    notes?: string;
}

export default function EditCustomerPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [form, setForm] = useState<Customer>({
        id: '',
        name: '',
        phone: '',
        address: '',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCustomer();
    }, [customerId]);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/shoppingmall-master-data/masterData?id=${customerId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            setCustomer(data);
            setForm({
                id: data.id,
                name: data.name || '',
                phone: data.phone || '',
                address: data.address || '',
                notes: data.notes || '',
            });
        } catch (err) {
            console.error(err);
            alert("Failed to load customer");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`http://localhost:8080/api/shoppingmall-master-data/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert("✅ Customer updated successfully!");
                router.push(`/customers/${customerId}`);
            } else {
                alert("Failed to update customer");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating customer");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" size={60} /></div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold">Edit Customer</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <Label>Full Name</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Address (Optional)</Label>
                                <Textarea
                                    value={form.address || ''}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Notes / Remarks</Label>
                                <Textarea
                                    value={form.notes || ''}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button type="submit" className="flex-1 h-12" disabled={saving}>
                                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                    Save Changes
                                </Button>
                                <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => router.back()}>
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