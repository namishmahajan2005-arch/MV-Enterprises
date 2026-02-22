import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  
  const navigate = useNavigate();

  const [gmail,setGmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);

  const handlesubmit=async(e)=>{
    e.preventDefault();

    if(!gmail || !password){
      alert("Gmail and Password required");
      return;
    }
    setLoading(true);

    const res=await fetch("https://mv-enterprises-4.onrender.com/api/token/",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:gmail.trim(),password:password}),
    });

    const data=await res.json();
    setLoading(false);

    if(res.ok){
      localStorage.setItem("access",data.access);
      localStorage.setItem("refresh",data.refresh);
      localStorage.setItem("username",data.username);

      navigate("/")
    }else{
      alert("Login failed")
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
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
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="border h-100 w-70 ">
        <div className="flex justify-center font-bold text-2xl mt-3">LOGIN</div>
        <div>
          <form onSubmit={handlesubmit} className="my-4">
            <div className="ml-7 mb-1">Gmail</div>
            <input type="email" placeholder=" abc@example.com" value={gmail} onChange={(e)=>{setGmail(e.target.value)}} className="w-4/5 h-9 rounded-xl border mx-7 mb-2"/>
            <div className="pl-7 mb-1">Password</div>
            <input type="password" placeholder=" ******" value={password} onChange={(e)=>{setPassword(e.target.value)}} className="w-4/5 h-9 rounded-xl border mx-7 mb-2"/>
            <div className="flex justify-center"><button type="submit" className="bg-black text-white h-8 rounded-2xl mt-3 w-4/5">{loading ? "Logging in" :"Login"}</button></div>
          </form>
        </div>
        <div className="flex justify-center">or</div>
        <div className="flex justify-center items-center my-4">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google login failed")}/>
        </div>
        <div className='flex justify-center'><Link to={'register'}>Don't have an account? </Link></div>
      </div>
    </div>
  );
}
