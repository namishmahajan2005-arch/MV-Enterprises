import { FiSearch, FiUser } from "react-icons/fi"; 
import { LiaShoppingBagSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GetValidAccessToken, logout } from "./auth";
import { authFetch } from "../utils/authFetch";

export function Navbar() {
    const list = { "Home": [], "Office": [], "Travel": [], "Kids": [], "Drinkware": [], "Glassware": [], "Fashion": [], "Gifts": [] };
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const getCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    };

    const [cartCount, setCartCount] = useState(getCartCount());
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const handleCartUpdate = () => setCartCount(getCartCount());
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

    useEffect(() => {
        async function loadUser() {
            const token = await GetValidAccessToken();
            if (!token) return;
            try {
                const res = await authFetch("https://mv-enterprises-4.onrender.com/auth/me/");
                const data = await res.json();
                setUsername(data.username);
            } catch {
                setUsername(null);
            }
        }
        loadUser();
    }, []);
    console.log(username);

    const [popOpen,setPopOpen]=useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    
                    <div className="flex-shrink-0">
                        <Link to={'/'} className="text-2xl font-serif tracking-[0.2em] uppercase text-black">
                            LOGO
                        </Link>
                    </div>

                    <div className="hidden lg:flex space-x-8">
                        {Object.keys(list).map((category, index) => (
                            <Link 
                                key={index} 
                                to={`/search?q=${category}`} 
                                className="text-[12px] font-medium tracking-widest uppercase text-gray-500 hover:text-black transition-colors duration-300 relative group pb-1"
                            >
                                {category}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 ease-out group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-6">
                        
                        <form onSubmit={handleSubmit} className="sm:flex items-center border-b border-gray-300 focus-within:border-black transition-colors duration-300 pb-1">
                            <button type="submit" className="text-gray-400 hover:text-black transition-colors mr-2">
                                <FiSearch size={18} />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Search" 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)} 
                                className="bg-transparent outline-none text-[13px] w-24 lg:focus:w-40 transition-all duration-300 placeholder-gray-400 text-black font-light"
                            />
                        </form>

                        <div className="relative" onClick={()=>setPopOpen(!popOpen)}>
                            {username ? (
                                <button className="flex items-center text-gray-500 hover:text-black transition-colors" aria-haspopup="true" aria-expanded={popOpen}><FiUser size={20}/></button>
                            ):(
                                <Link to={'/login'} className="t hover:text-black "><FiUser size={22} strokeWidth={1.5} /></Link>
                            )}

                            {popOpen && username &&(
                                <div className="">
                                    <div className="absolute right-0 top-8 w-60 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                                        <div className="px-4 py-3 border-b text-sm text-gray-400 text-xs">Hi {username}</div>
                                        <div className="flex flex-col text-sm">
                                            <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 transition">Profile</Link>
                                            <Link to="/my-orders" className="px-4 py-2 hover:bg-gray-100 transition"> Orders</Link>
                                            <Link to="/wishlist" className="px-4 py-2 hover:bg-gray-100 transition"> Wishlist</Link>
                                            <button onClick={logout} className="px-4 py-2 text-left text-red-500 hover:bg-red-50 transition"> Logout</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to={'/checkout'} className="relative flex items-center hover:text-gray-600 transition-colors">
                            <LiaShoppingBagSolid size={26} />
                            {cartCount > 0 && (
                                <span className="absolute -bottom-1 -right-1.5 h-4 w-4 flex justify-center items-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                    
                </div>
            </div>
        </nav>
    );
}