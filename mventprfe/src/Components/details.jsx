import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PaymentNavbar from './paymentnavbar';
import { authFetch } from '../utils/authFetch';
import { FiCreditCard, FiSmartphone, FiBox, FiGlobe, FiLock } from 'react-icons/fi';
import upi from "../assets/upi-icon.webp"
import card from "../assets/card-icon.jpg"
import netbanking from "../assets/netbanking-icon.png"
import cod from "../assets/cod-icon.png"

export function Details() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pin, setPin] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cart = location.state?.cartitem || {};
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null); 

    useEffect(() => {
        fetch("https://mv-enterprises-4.onrender.com/")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to load products", err));
    }, []);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await authFetch("https://mv-enterprises-4.onrender.com/api/me/");
                if (!res.ok) return;
                const data = await res.json();
                setUser(data);
            } catch {
                setUser(null);
            }
        }
        loadUser();
    }, []);

    const price = useMemo(() => {
        if (!cart || products.length === 0) return 0;
        return Object.entries(cart).reduce((sum, [itemId, qty]) => {
            const product = products.find(p => p.id === Number(itemId));
            if (!product) return sum;
            return sum + Number(product.item_newprice) * qty;
        }, 0);
    }, [cart, products]);

    const cartModified = useMemo(() => {
        if (!cart || products.length === 0) return [];
        return Object.entries(cart).map(([itemId, qty]) => {
            const product = products.find(p => p.id === Number(itemId));
            if (!product) return null;
            return { product: product, quantity: qty };
        }).filter(Boolean);
    }, [cart, products]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !mobile || !address1 || !city || !state || !pin || !paymentMethod) {
            alert("Please complete all required fields to continue.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await authFetch("https://mv-enterprises-4.onrender.com/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartModified,
                    price: price,
                    name, email, mobile, address1, address2, state, city, pin,
                    payment_method: paymentMethod
                }),
            });

            if (res.ok) {
                localStorage.setItem("cart", JSON.stringify({}));
                window.dispatchEvent(new Event("cartUpdated"));
                alert("Your Order placed successfully"); 
                navigate("/", { state: { orderSuccess: true } }); 
            } else {
                alert("We were unable to process your order. Please try again.");
                navigate("/checkout");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageUrl = (path) => path.startsWith('/') ? `https://mv-enterprises-4.onrender.com${path}` : `https://mv-enterprises-4.onrender.com/${path}`;

    if (Object.keys(cart).length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] font-sans text-[#1A1A1A]">
                <p className="mb-4 tracking-widest uppercase text-sm text-gray-500">Your session has expired.</p>
                <Link to="/" className="border-b border-black text-xs uppercase tracking-[0.2em] pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
            <PaymentNavbar highlight={'Details'} />

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                <div className="flex flex-col-reverse lg:flex-row gap-16 lg:gap-24">

                    <div className="w-full lg:w-[60%] flex flex-col">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-12">

                            <section>
                                <h2 className="text-2xl font-serif text-black mb-8">Shipping Information</h2>
                                <div className="flex flex-col gap-6">
                                    <div className="relative group">
                                        <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="Full Name" />
                                        <label htmlFor="name" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">Full Name *</label>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="relative group w-1/2">
                                            <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="Email" />
                                            <label htmlFor="email" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">Email *</label>
                                        </div>
                                        <div className="relative group w-1/2">
                                            <input type="tel" id="mobile" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="Phone" />
                                            <label htmlFor="mobile" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">Phone Number *</label>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <input type="text" id="address1" required value={address1} onChange={(e) => setAddress1(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="Address" />
                                        <label htmlFor="address1" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">Street Address *</label>
                                    </div>
                                    <div className="relative group">
                                        <input type="text" id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="Apartment, suite, etc." />
                                        <label htmlFor="address2" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">Apartment, suite, etc. (optional)</label>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="relative group w-1/3">
                                            <input type="text" id="city" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="City" />
                                            <label htmlFor="city" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">City *</label>
                                        </div>
                                        <div className="relative group w-1/3">
                                            <input type="text" id="state" required value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="State" />
                                            <label htmlFor="state" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">State *</label>
                                        </div>
                                        <div className="relative group w-1/3">
                                            <input type="text" id="pin" required value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors peer placeholder-transparent" placeholder="PIN" />
                                            <label htmlFor="pin" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:tracking-wider peer-valid:text-black">PIN Code *</label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-8 border-t border-gray-200 pt-12">
                                    <FiLock className="text-gray-500" />
                                    <h2 className="text-2xl font-serif text-black">Payment Method</h2>
                                </div>

                                <div className=''>
                                    {[
                                        { id: 'card', label: 'Credit / Debit Card', icon: card },
                                        { id: 'upi', label: 'UPI / QR', icon: upi },
                                        { id: 'netbanking', label: 'Net Banking', icon: netbanking },
                                        { id: 'cod', label: 'Cash on Delivery', icon: cod },
                                    ].map((method) => (
                                        <label key={method.id} className={`cursor-pointer border flex h-15 p-6 'border-black bg-black/5 shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value={method.id} 
                                                className="hidden" 
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className='flex items-center'>
                                              <img src={method.icon} className="h-9 w-9 flex items-center text-black mr-15" />
                                              <span className={`text-[11px] tracking-widest uppercase font-medium ${paymentMethod === method.id ? 'text-black' : 'text-gray-500'}`}>
                                                  {method.label}
                                              </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-black text-white uppercase tracking-[0.2em] text-xs py-5 mt-4 hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Processing...' : `Pay ₹${price.toFixed(2)}`}
                            </button>
                        </form>
                    </div>

                    <div className="w-full lg:w-[40%]">
                        <div className="sticky top-40 bg-white p-8 border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
                            <h2 className="text-xs tracking-[0.2em] uppercase font-medium border-b border-gray-200 pb-4 mb-6 text-black">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                                {cartModified.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                                            <img src={getImageUrl(item.product.images[0])} alt={item.product.item_name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-sm font-serif text-black">{item.product.item_name}</span>
                                            <span className="text-xs text-gray-500 tracking-wider uppercase mt-1">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="text-sm font-medium">₹{(item.product.item_newprice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 text-sm font-light text-gray-600 border-t border-gray-200 pt-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="uppercase text-[10px] tracking-wider text-black">Complimentary</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-black pt-4">
                                <span className="text-xs tracking-[0.2em] uppercase font-medium text-black">Total to Pay</span>
                                <span className="text-xl font-serif text-black">₹{price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}