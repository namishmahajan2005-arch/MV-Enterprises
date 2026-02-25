import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!email || !fname || !lname || !password) {
      alert("All fields are required");
      return; 
    }

    setLoading(true);

    try {
      const res = await fetch("https://mv-enterprises-4.onrender.com/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          first_name: fname,
          last_name: lname,
          password: password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Account created successfully. Please sign in.");
        navigate('/login');
      } else {
        alert("Registration failed. Please check your details and try again.");
      }
    } catch (error) {
      setLoading(false);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] font-sans selection:bg-black selection:text-white">
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop')" }}
      ></div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 py-12 md:py-20">
        <div className="w-full max-w-sm">
          <h6 className="text-xl font-light text-center mb-2 tracking-[0.2em] text-black">
            MV Enterprises
          </h6>
          <p className="text-center text-xs tracking-widest text-gray-400 mb-12 uppercase">
            Create an Account
          </p>

          <form onSubmit={handlesubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full pb-2 bg-transparent border-0 border-b border-gray-300 text-sm text-black focus:outline-none focus:border-black focus:ring-0 transition-colors"
                  placeholder="Jane"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full pb-2 bg-transparent border-0 border-b border-gray-300 text-sm text-black focus:outline-none focus:border-black focus:ring-0 transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-black text-white text-xs tracking-[0.15em] uppercase py-4 mt-6 hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-12">
            <Link
              to="/login"
              className="text-[10px] tracking-widest text-gray-500 hover:text-black uppercase transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-black"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}