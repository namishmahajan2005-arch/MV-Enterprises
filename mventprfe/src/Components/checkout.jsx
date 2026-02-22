import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PaymentNavbar from './paymentnavbar';
import { FiPlus, FiMinus, FiX, FiArrowRight } from "react-icons/fi";
import { GetValidAccessToken } from './auth';

export default function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem('cart')) || {};
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://mv-enterprises-4.onrender.com/")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to load products", err));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cart]);

    const cartCount = useMemo(() => {
        return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    }, [cart]);

    const totalCart = useMemo(() => {
        return Object.entries(cart).reduce((total, [itemId, itemqty]) => {
            const item = products.find(i => i.id === Number(itemId));
            if (item) {
                return total + (item.item_newprice * itemqty);
            }
            return total;
        }, 0);
    }, [cart, products]);

    const onaddCart = (prodname) => {
        setCart(prev => ({
            ...prev,
            [prodname.id]: (prev[prodname.id] || 0) + 1
        }));
    };

    const onremoveCart = (prodname) => {
        setCart(prev => {
            const updated = { ...prev };
            updated[prodname.id] -= 1;
            if (updated[prodname.id] <= 0) {
                delete updated[prodname.id];
            }
            return updated;
        });
    };

    const onClearItem = (prodname) => {
        setCart(prev => {
            const updated = { ...prev };
            delete updated[prodname.id];
            return updated;
        });
    };

    const getImageUrl = (path) => path.startsWith('/') ? `https://mv-enterprises-4.onrender.com${path}` : `https://mv-enterprises-4.onrender.com/${path}`;

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
            <PaymentNavbar highlight={'Bag'} />

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    <div className="w-full lg:w-[60%] flex flex-col">
                        <div className="flex justify-between items-end border-b border-black pb-4 mb-8">
                            <h4 className="text-3xl font-serif text-black">Your Bag</h4>
                            <span className="text-xs tracking-widest uppercase text-gray-500 font-medium">
                                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>

                        {cartCount === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-500 uppercase tracking-widest text-sm mb-6">Your bag is currently empty.</p>
                                <Link to="/" className="border-b border-black text-xs uppercase tracking-[0.2em] pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-10">
                                {Object.entries(cart).map(([prodid, quantity]) => {
                                    const product = products.find(p => p.id === Number(prodid));
                                    if (!product) return null;

                                    return (
                                        <div key={prodid} className="flex gap-6 md:gap-8 group">

                                            <div className="w-32 md:w-40 aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img 
                                                    src={getImageUrl(product.images[0])} 
                                                    alt={product.item_name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>

                                            <div className="flex flex-col flex-1 justify-between py-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-serif text-black mb-1">{product.item_name}</h3>
                                                        <p className="text-xs tracking-wider text-gray-500 uppercase mb-4">
                                                            Item #{product.id}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => onClearItem(product)}
                                                        className="text-gray-400 hover:text-black transition-colors p-1"
                                                        aria-label="Remove completely"
                                                    >
                                                        <FiX size={18} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center border border-gray-300 w-24 h-10">
                                                        <button onClick={() => onremoveCart(product)} className="w-8 h-full flex justify-center items-center text-gray-500 hover:text-black transition-colors">
                                                            <FiMinus size={12} />
                                                        </button>
                                                        <span className="flex-1 text-center text-xs font-medium">{quantity}</span>
                                                        <button onClick={() => onaddCart(product)} className="w-8 h-full flex justify-center items-center text-gray-500 hover:text-black transition-colors">
                                                            <FiPlus size={12} />
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1">
                                                        {product.item_oldprice && (
                                                            <span className="text-xs text-gray-400 line-through">
                                                                ₹{product.item_oldprice}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-medium tracking-wide text-black">
                                                            ₹{product.item_newprice}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[40%]">
                        <div className="sticky top-40 bg-white p-8 md:p-10 border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
                            <h2 className="text-xs tracking-[0.2em] uppercase font-medium border-b border-gray-200 pb-4 mb-6 text-black">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-4 text-sm font-light text-gray-600 mb-8">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalCart.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="uppercase text-xs tracking-wider text-black">Complimentary</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-gray-200 pt-6 mb-8">
                                <span className="text-xs tracking-[0.2em] uppercase font-medium text-black">Total</span>
                                <span className="text-2xl font-serif text-black">₹{totalCart.toFixed(2)}</span>
                            </div>

                            <button 
                                disabled={cartCount === 0}
                                onClick={async () => {
                                    const token = await GetValidAccessToken();
                                    if (!token) {
                                        navigate("/login", { state: { from: "/checkout" } });
                                        return;
                                    }
                                    navigate("/checkout/order", { state: { cartitem: cart } });
                                }}
                                className="w-full flex items-center justify-center gap-3 bg-black text-white uppercase tracking-[0.2em] text-xs py-5 hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed group"
                            >
                                Proceed to Details
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </button>

                            <div className="mt-8 text-center text-[10px] tracking-widest uppercase text-gray-400 leading-relaxed">
                                <p>Taxes calculated at checkout.</p>
                                <p className="mt-2">Secure encrypted payment.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}