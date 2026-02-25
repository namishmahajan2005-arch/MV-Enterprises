import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!gmail || !password) {
      alert("Email and Password required");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("https://mv-enterprises-4.onrender.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: gmail.trim(), password: password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", data.username);
        navigate("/");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoading(false);
      alert("An error occurred during login.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("https://mv-enterprises-4.onrender.com/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", data.username);
        navigate("/");
      } else {
        alert("Google login failed");
      }
    } catch (error) {
      alert("An error occurred during Google login.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] font-sans selection:bg-black selection:text-white">
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')" }}
      ></div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 py-12 md:py-20">
        <div className="w-full max-w-sm">
          <h6 className="text-xl font-light text-center mb-2 tracking-[0.2em] text-black">
            MV Enterprises
          </h6>
          <p className="text-center text-xs tracking-widest text-gray-400 mb-12 uppercase">
            Access Your Account
          </p>

          <form onSubmit={handlesubmit} className="space-y-8">
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="w-full pb-2 bg-transparent border-0 border-b border-gray-300 text-sm text-black focus:outline-none focus:border-black focus:ring-0 transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pb-2 bg-transparent border-0 border-b border-gray-300 text-sm text-black focus:outline-none focus:border-black focus:ring-0 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-xs tracking-[0.15em] uppercase py-4 mt-4 hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-[10px] tracking-widest text-gray-400 uppercase">Or Continue With</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="flex justify-center mb-10">
            <div className="hover:opacity-90 transition-opacity">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => alert("Google login failed")} 
                theme="outline"
                shape="rectangular"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/login/register"
              className="text-[10px] tracking-widest text-gray-500 hover:text-black uppercase transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-black"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}