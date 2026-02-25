import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './navbar';
import { useLocation } from "react-router-dom";
import { FiPlus, FiMinus, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import ReviewCard from './reviewcard';
import { authFetch } from '../utils/authFetch';

export default function Product() {
    const location = useLocation();
    const product = location.state?.product;

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > 50) { 
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    };

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

    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await authFetch(`https://mv-enterprises-4.onrender.com/products/${product.id}/addreviews/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: rating, comment: reviewText })
            });

            if (response.ok) {
                const newReview = await response.json();
                setReviews((prevReviews) => [...prevReviews, newReview]);
                setReviewText("");
                setRating(5);
            } else {
                console.error("Failed to post review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmitting(false);
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

    const getImageUrl = (path) => `https://mv-enterprises-4.onrender.com${path}`;

    const [reviews,setReviews]=useState([]);

    useEffect(()=>{
        fetch(`https://mv-enterprises-4.onrender.com/products/${product.id}/reviews/`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console.log("Failed to load Reviews",err))
    },[product]);
    console.log(reviews);

    const [canreview,setCanreview]=useState(false);
    useEffect(()=>{
        authFetch(`https://mv-enterprises-4.onrender.com/products/${product.id}/canreview/`)
        .then(res => res.json())
        .then(data => setCanreview(data.can_review))
        .catch(err => setCanreview(false))
    },[product]);


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

                        <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-gray-100 group" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
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
                        <div>
                            
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

                        <div>
                            <h2 className="text-xl font-semibold mt-6 mb-6">Customer Reviews</h2>

                            {reviews.length === 0 && (
                                <p className="text-gray-500 text-sm mb-6">No reviews yet.</p>
                            )}

                            <div className="space-y-4 mb-8">
                                {reviews.map(review => (
                                    <ReviewCard key={review.review_no || review.id} review={review} />
                                ))}
                            </div>

                            {canreview ? (
                                <div className="border-t border-gray-200 pt-8 mt-8">
                                    <h3 className="text-lg font-serif mb-6">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-5">
                                            <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-3">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className={`text-2xl leading-none focus:outline-none transition-colors ${
                                                            star <= rating ? 'text-black' : 'text-gray-200 hover:text-gray-400'
                                                        }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="reviewText" className="block text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                                                Your Review
                                            </label>
                                            <textarea
                                                id="reviewText"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                required
                                                rows="4"
                                                className="w-full border border-gray-300 bg-transparent p-4 text-sm focus:outline-none focus:border-black transition-colors resize-none placeholder-gray-300"
                                                placeholder="Share your thoughts about this product..."
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="bg-black text-white uppercase tracking-[0.2em] text-xs py-4 px-8 hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Posting...' : 'Post Review'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 mt-4 italic">
                                    Only customers who purchased this product can write a review.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}