import { Navbar } from "./navbar";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Searchresult() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!query) return;

        fetch(`https://mv-enterprises-4.onrender.com/Search?q=${query}`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Search fetch failed:", err));
    }, [query]);

    const getImageUrl = (path) => {
        if (!path) return null;
        return path.startsWith('/') ? `https://mv-enterprises-4.onrender.com${path}` : `https://mv-enterprises-4.onrender.com/${path}`;
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A]">
            <Navbar />
            
            <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-20">
                
                <header className="flex flex-col items-center justify-center mb-15 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-black tracking-wide mb-6">
                        Results for "{query}"
                    </h1>

                    <div className="w-full max-w-5xl flex justify-between items-center border-t border-b border-gray-200 py-4 mt-8">
                        <span className="text-xs uppercase tracking-[0.15em] text-transparent select-none">
                            Spacer
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                            {products.length} {products.length === 1 ? 'Item' : 'Items'}
                        </span>
                        <button className="text-xs uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors">
                            Sort By
                        </button>
                    </div>
                </header>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-gray-500 uppercase tracking-widest text-sm mb-6">We couldn't find anything matching "{query}".</p>
                        <Link to="/" className="border-b border-black text-xs uppercase tracking-[0.2em] pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {products.map(product => {
                            const imageUrl = getImageUrl(product.images?.[0]);
                            const subcat = product.item_subcategory || 'category'; 
                            
                            return (
                                <div key={product.id} className="group flex flex-col cursor-pointer">
                                    <Link to={`/subcategory/${encodeURIComponent(subcat)}/product/${product.id}`} state={{ product }}>

                                        <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden mb-5 relative">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={product.item_name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs tracking-widest uppercase">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <h3 className="text-sm font-serif text-black mb-2 transition-colors duration-300 group-hover:text-gray-500">
                                                {product.item_name}
                                            </h3>
                                            
                                            <div className="flex items-center gap-3 text-xs tracking-widest">
                                                {product.item_oldprice && (
                                                    <span className="text-gray-400 line-through">
                                                        ₹{product.item_oldprice}
                                                    </span>
                                                )}
                                                <span className="text-black font-medium">
                                                    ₹{product.item_newprice}
                                                </span>
                                            </div>
                                        </div>

                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}