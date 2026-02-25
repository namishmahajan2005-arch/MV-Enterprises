import React, { useState } from 'react';
import { Navbar } from './navbar';
import { authFetch } from '../utils/authFetch';

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [query, setQuery] = useState("");

    const handleSubmit =async (e) => {
        e.preventDefault();
        if(!name || !email || !phone || !query){
            alert("All fields are required");
        }

        const res=await authFetch("https://mv-enterprises-4.onrender.com/contact/",{
            method:"GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                query: query,
            }),
        });

        if(res.ok){
            alert("Thank you for Contacting Us. We will get back to you as soon as possible.");
            navigate('/')
        }else{
            alert("Unable tp process your query")
        }
            
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                
                <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
                    <h1 className="text-4xl lg:text-5xl font-serif mb-6">Get in Touch</h1>
                    <p className="text-sm font-light leading-relaxed text-gray-600">
                        For inquiries regarding online orders, styling advice, or our bespoke services, 
                        our Client Advisors are available to assist you.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    <div className="w-full lg:w-3/5">
                        <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-200 pb-4 mb-8">
                            Send an Inquiry
                        </h2>

                        {status === "success" ? (
                            <div className="h-64 flex flex-col justify-center items-center text-center bg-white border border-gray-200 p-8">
                                <h3 className="text-xl font-serif mb-2">Thank You</h3>
                                <p className="text-sm text-gray-500">
                                    Your message has been received. A Client Advisor will be in touch shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="query" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="query"
                                        required
                                        rows="5"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full border border-gray-300 bg-transparent p-4 text-sm focus:outline-none focus:border-black transition-colors resize-none mt-2"
                                    />
                                </div>

                                <button type="submit" className="w-full md:w-auto bg-black text-white uppercase tracking-[0.2em] text-xs py-5 px-12 mt-4 hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400">Submit</button>
                            </form>
                        )}
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col gap-10">
                        
                        <div>
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-200 pb-4 mb-6">
                                Client Services
                            </h2>
                            <ul className="space-y-4 text-sm font-light text-gray-600">
                                <li className="flex justify-between">
                                    <span>Phone</span>
                                    <span className="text-black">+1 (800) 123-4567</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Email</span>
                                    <span className="text-black">clientservice@maison.com</span>
                                </li>
                                <li className="pt-2 text-xs text-gray-400 leading-relaxed">
                                    Available Monday through Friday,<br />
                                    9:00 AM to 8:00 PM (EST).
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-200 pb-4 mb-6">
                                Flagship Boutique
                            </h2>
                            <address className="not-italic text-sm font-light text-gray-600 leading-relaxed">
                                <p className="font-medium text-black mb-1">Maison Galerie</p>
                                <p>124 Avenue Montaigne</p>
                                <p>75008 Paris, France</p>
                                <p className="mt-4 text-xs text-gray-400">Open Mon-Sat, 10am - 7pm</p>
                            </address>
                        </div>

                        <div>
                            <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 border-b border-gray-200 pb-4 mb-6">
                                Press & Wholesale
                            </h2>
                            <p className="text-sm font-light text-gray-600 leading-relaxed">
                                For PR inquiries or wholesale partnerships, please contact our corporate office at <a href="mailto:press@maison.com" className="text-black border-b border-black pb-[1px] hover:text-gray-500 hover:border-gray-500 transition-colors">press@maison.com</a>.
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}