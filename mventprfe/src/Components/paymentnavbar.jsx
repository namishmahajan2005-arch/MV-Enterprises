import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi'; 
import { authFetch } from "../utils/authFetch";
import { GetValidAccessToken } from './auth';

export default function PaymentNavbar({ highlight }) {
    const heads = ["Bag", "Details", "Payment"];
    
    const activeIndex = heads.indexOf(highlight);

    const [username, setUsername] = useState(null);
    
    useEffect(() => {
        async function loadUser() {
            const token = await GetValidAccessToken();
            if (!token) return; 

            try {
                const res = await authFetch("http://127.0.0.1:8000/auth/me/");
                const data = await res.json();
                setUsername(data.username);
            } catch {
                setUsername(null);
            }
        }
        loadUser();
    }, []);

    return (
        <header className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                
                <div className="flex-1 flex justify-center md:justify-start w-full md:w-auto">
                    <Link to={'/'} className="text-2xl font-serif tracking-[0.2em] uppercase text-black">
                        LOGO
                    </Link>
                </div>

                <div className="flex items-center justify-center flex-1 w-full md:w-auto">
                    {heads.map((head, index) => {
                        const isActive = head === highlight;
                        const isCompleted = index < activeIndex;

                        return (
                            <React.Fragment key={index}>
                                <div className="flex items-center">
                                    <span className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-medium transition-colors duration-300 flex items-center ${
                                        isActive ? 'text-black' : isCompleted ? 'text-black/70' : 'text-gray-300'
                                    }`}>
                                        {head}
                                    </span>
                                </div>

                                {index !== heads.length - 1 && (
                                    <div className={`w-6 sm:w-12 h-[1px] mx-3 sm:mx-6 transition-colors duration-300 ${
                                        isCompleted ? 'bg-black/70' : 'bg-gray-200'
                                    }`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="flex-1 flex justify-center md:justify-end items-center text-[10px] sm:text-[11px] text-gray-500 tracking-widest uppercase mt-2 md:mt-0 w-full md:w-auto">
                    <FiLock className="mr-2 mb-[2px]" size={14} strokeWidth={1.5} />
                    Secure Checkout
                </div>

            </div>
        </header>
    );
}