'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Trash2,
    Search,
    ShoppingCart,
    CreditCard,
    UserCheck
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

interface CartItem {
    barcode: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

interface BillingResponse {
    billNumber: string;
    totalAmount: number;
    isMember: boolean;
    customerName?: string;
    message: string;
}

export default function POSBilling() {

    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerPhone, setCustomerPhone] = useState('');
    const [customer, setCustomer] = useState<any>(null);

    const [searchType, setSearchType] = useState('barcode');
    const [searchInput, setSearchInput] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isLoading, setIsLoading] = useState(false);

    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        searchRef.current?.focus();
    }, []);

    // ===============================
    // PRODUCT SEARCH
    // ===============================
    const handleProductSearch = async () => {
        if (!searchInput.trim()) return;

        let url = '';
        if (searchType === 'barcode') {
            url = `http://localhost:8080/api/pos/product/barcode?barcode=${searchInput}`;
        } else if (searchType === 'id') {
            url = `http://localhost:8080/api/pos/product/id?id=${searchInput}`;
        } else if (searchType === 'name') {
            url = `http://localhost:8080/api/pos/product/name?name=${searchInput}`;
        }

        try {
            const res = await fetch(url, {
                credentials: "include",
            });

            if (res.ok) {
                const product = await res.json();
                addToCart(product);
            } else if (res.status === 403) {
                alert("Access Denied. Please login first.");
            } else {
                alert('❌ Product not found!');
            }
        } catch (e) {
            console.error(e);
            alert('❌ Server connection error');
        }

        setSearchInput('');
        searchRef.current?.focus();
    };

    // ===============================
    // ADD TO CART
    // ===============================
    const addToCart = (product: any) => {
        const existingIndex = cart.findIndex(item => item.barcode === product.barcode);

        if (existingIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingIndex].quantity += 1;
            updatedCart[existingIndex].total =
                updatedCart[existingIndex].price * updatedCart[existingIndex].quantity;
            setCart(updatedCart);
        } else {
            setCart([
                ...cart,
                {
                    barcode: product.barcode,
                    name: product.name,
                    price: Number(product.price),
                    quantity: 1,
                    total: Number(product.price)
                }
            ]);
        }
    };

    // ===============================
    // REMOVE ITEM
    // ===============================
    const removeItem = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    // ===============================
    // UPDATE QUANTITY
    // ===============================
    const updateQuantity = (index: number, amount: number) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += amount;

        if (updatedCart[index].quantity <= 0) {
            removeItem(index);
            return;
        }

        updatedCart[index].total =
            updatedCart[index].price * updatedCart[index].quantity;
        setCart(updatedCart);
    };

    // ===============================
    // GRAND TOTAL
    // ===============================
    const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

    // ===============================
    // CHECK MEMBERSHIP
    // ===============================
    const checkMembership = async () => {
        if (!customerPhone || customerPhone.length < 10) {
            setCustomer(null);
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/pos/customer/search?phone=${customerPhone}`,
                { credentials: "include" }
            );

            if (res.ok) {
                const data = await res.json();
                setCustomer(data);
            } else {
                setCustomer(null);
            }
        } catch (e) {
            console.error(e);
            setCustomer(null);
        }
    };

    // ===============================
    // PRINT RECEIPT
    // ===============================
    const printReceipt = (bill: BillingResponse) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>${bill.billNumber}</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    .receipt {
                        max-width: 400px;
                        margin: auto;
                        border: 2px dashed #166534;
                        padding: 20px;
                    }
                    .center { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    td, th { padding: 8px; border-bottom: 1px solid #ccc; }
                    .total { font-size: 22px; font-weight: bold; color: #166534; }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <h2 class="center">SB GROUP POS</h2>
                    <p class="center">Shopping Mall Billing System</p>
                    <hr/>
                    <p><strong>Bill:</strong> ${bill.billNumber}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Customer:</strong> ${bill.customerName || 'Walk-in Customer'}</p>
                    <hr/>
                    <table>
                        <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
                        ${cart.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>৳${item.total}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <hr/>
                    <p class="total">Grand Total: ৳${bill.totalAmount}</p>
                    <p>Payment Method: ${paymentMethod}</p>
                    ${bill.isMember ? '<p style="color:green;">★ Loyalty Member ★</p>' : ''}
                    <hr/>
                    <p class="center">Thank You For Shopping</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    // ===============================
    // COMPLETE SALE
    // ===============================
    const completeSale = async () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }

        setIsLoading(true);

        const payload = {
            customerPhone: customerPhone || null,
            items: cart.map(item => ({
                barcode: item.barcode,
                quantity: item.quantity
            })),
            discountAmount: 0,
            paymentMethod,
            trxId: 'POS-' + Date.now()
        };

        try {
            const res = await fetch('http://localhost:8080/api/pos/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const bill: BillingResponse = await res.json();
                alert('✅ Sale Completed Successfully');
                printReceipt(bill);

                // Reset form
                setCart([]);
                setCustomerPhone('');
                setCustomer(null);
            } else if (res.status === 403) {
                alert("Access Denied. Please login as authorized staff.");
            } else {
                alert('❌ Failed to complete sale');
            }
        } catch (e) {
            console.error(e);
            alert('❌ Network Error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold text-green-800 mb-2">
                        🛒 SB GROUP POS SYSTEM
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Smart Shopping Mall Billing Solution
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* SEARCH SECTION */}
                        <Card className="border-green-200 shadow-xl">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="h-14 border-2 border-green-600 rounded-xl px-4 font-semibold"
                                    >
                                        <option value="barcode">Barcode</option>
                                        <option value="id">Product ID</option>
                                        <option value="name">Product Name</option>
                                    </select>

                                    <Input
                                        ref={searchRef}
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleProductSearch()}
                                        placeholder="Search Product..."
                                        className="md:col-span-2 h-14 border-2 border-green-600 text-lg"
                                    />

                                    <Button
                                        onClick={handleProductSearch}
                                        className="h-14 bg-green-700 hover:bg-green-800 text-lg"
                                    >
                                        <Search className="mr-2" />
                                        Add Product
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CART */}
                        <Card className="border-green-200 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
                                    <ShoppingCart />
                                    Cart Items ({cart.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-semibold">{item.name}</TableCell>
                                                <TableCell className="text-right">৳{item.price}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => updateQuantity(i, -1)}>-</Button>
                                                        <span className="font-bold">{item.quantity}</span>
                                                        <Button size="sm" variant="outline" onClick={() => updateQuantity(i, 1)}>+</Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-green-700">৳{item.total}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {cart.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                                    No products added yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SIDE - SUMMARY */}
                    <div>
                        <Card className="border-green-200 shadow-xl sticky top-6">
                            <CardContent className="p-6 space-y-6">
                                {/* CUSTOMER */}
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">Customer Phone</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            onBlur={checkMembership}
                                        />
                                        <Button onClick={checkMembership} className="bg-green-700 hover:bg-green-800">
                                            Check
                                        </Button>
                                    </div>
                                    {customer && (
                                        <div className="mt-4 bg-green-100 border border-green-300 rounded-xl p-3">
                                            <p className="text-green-800 font-semibold flex items-center gap-2">
                                                <UserCheck size={18} />
                                                {customer.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* TOTAL & PAYMENT */}
                                <div className="border-t pt-6">
                                    <div className="text-6xl font-extrabold text-green-700 mb-8">
                                        ৳{grandTotal}
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-sm text-gray-600 mb-2 block">Payment Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full h-14 border-2 border-green-600 rounded-xl px-4"
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="BKASH">bKash</option>
                                            <option value="CARD">Card</option>
                                        </select>
                                    </div>

                                    <Button
                                        onClick={completeSale}
                                        disabled={cart.length === 0 || isLoading}
                                        className="w-full h-16 text-xl bg-green-700 hover:bg-green-800"
                                    >
                                        <CreditCard className="mr-3" />
                                        {isLoading ? 'Processing...' : 'Complete Sale'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}