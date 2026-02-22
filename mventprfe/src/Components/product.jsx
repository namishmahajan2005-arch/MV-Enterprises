import React, { useState } from 'react';
import { Navbar } from './navbar';
import { useLocation } from "react-router-dom";
import { FiPlus, FiMinus, FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Thinner, premium icons

export default function Product() {
    const location = useLocation();
    const product = location.state?.product;

    const [mainImageIndex, setMainImageIndex] = useState(0);

    const getCart = () => JSON.parse(localStorage.getItem("cart")) || {};
    const saveCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const [qty, setQty] = useState(() => {
        const cart = getCart();
        return cart[product?.id] || 0;
    });

    const onAddtoCart = (productname) => {
        if (!productname) return;
        let cart = getCart();
        const productKey = productname.id;
        let newqty = (cart[productKey] || 0) + 1;
        cart[productKey] = newqty;
        saveCart(cart);
        setQty(newqty);
    };

    const onPlusCart = (productname) => {
        if (!productname) return;
        let cart = getCart();
        const productKey = productname.id;
        let newqty = (cart[productKey] || 0) + 1;
        cart[productKey] = newqty;
        saveCart(cart);
        setQty(newqty);
    };

    const onMinusCart = (productname) => {
        if (!productname) return;
        let cart = getCart();
        const productKey = productname.id;
        let newqty = (cart[productKey] || 0) - 1;
        if (newqty <= 0) {
            delete cart[productKey];
            newqty = 0;
        } else {
            cart[productKey] = newqty;
        }
        saveCart(cart);
        setQty(newqty);
    };

    const nextImage = () => {
        if (product?.images) {
            setMainImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };
    const prevImage = () => {
        if (product?.images) {
            setMainImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Product not found.</p>
                </div>
            </div>
        );
    }

    const getImageUrl = (path) => `http://127.0.0.1:8000${path}`;

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    <div className="lg:sticky lg:top-0 w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-6">
                        
                        <div className="hidden md:flex flex-col gap-4 w-24">
                            {product.images?.map((image, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setMainImageIndex(index)}
                                    className={`relative aspect-[3/4] overflow-hidden transition-all duration-300 ${mainImageIndex === index ? 'ring-1 ring-black opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={getImageUrl(image)} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-gray-100 group">
                            {product.images?.length > 0 ? (
                                <img 
                                    src={getImageUrl(product.images[mainImageIndex])} 
                                    alt={product.item_name} 
                                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                                    key={mainImageIndex} 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                            )}
                            
                            {product.images?.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-black">
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-black">
                                        <FiChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {product.images?.length > 1 && (
                            <div className=" flex md:hidden justify-center gap-2 mt-4">
                                {product.images.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setMainImageIndex(idx)}
                                        className={`h-[2px] transition-all duration-300 ${mainImageIndex === idx ? 'w-8 bg-black' : 'w-4 bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col">
                        <div className="">
                            
                            <h4 className="text-2xl lg:text-4xl font-serif text-black mb-4">{product.item_name}</h4>
                            <div className="flex items-center gap-4 mb-8">
                                {product.item_oldprice && (
                                    <span className="text-lg font-light tracking-wide text-gray-400 line-through">
                                        ₹{product.item_oldprice}
                                    </span>
                                )}
                                <span className="text-xl font-medium tracking-wide text-gray-900">
                                    ₹{product.item_newprice} INR
                                </span>
                            </div>

                            <div 
                                className="text-sm font-light leading-relaxed text-gray-600 mb-10 prose prose-sm prose-gray"
                                dangerouslySetInnerHTML={{ __html: product.item_description }} 
                            />

                            <div className="mb-8">
                                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">Quantity</p>
                                <div className="flex items-center border border-gray-300 w-32 h-12">
                                    <button onClick={() => onMinusCart(product)} className="w-10 h-full flex justify-center items-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">
                                        <FiMinus size={14} />
                                    </button>
                                    <span className="flex-1 text-center text-sm font-medium">{qty}</span>
                                    <button onClick={() => onPlusCart(product)} className="w-10 h-full flex justify-center items-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">
                                        <FiPlus size={14} />
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={() => onAddtoCart(product)} 
                                className="w-full bg-black text-white uppercase tracking-[0.2em] text-xs py-5 hover:bg-gray-800 transition-colors duration-300 mb-10"
                            >
                                {qty > 0 ? 'Add Another to Bag' : 'Add to Bag'}
                            </button>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}