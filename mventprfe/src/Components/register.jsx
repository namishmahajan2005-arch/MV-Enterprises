import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function Register() {
    const navigate=useNavigate()

    const [gmail,setGmail]=useState("")
    const [fname,setFname]=useState("")
    const [lname,setLname]=useState("")
    const [password,setPassword]=useState("")

    const handlesubmit=async(e)=>{
        e.preventDefault();

        if(!gmail || !fname || !lname || !password){
            alert("All fields are required");
        }

        const res=await fetch("https://mv-enterprises-4.onrender.com/auth/register/",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: gmail,
                first_name: fname,
                last_name: lname,
                password: password,
            }),
        });

        const data=await res.json();

        if(res.ok){
            alert("User Regestered Successfully. Please Login");
            navigate('/login')
        }else{
            alert("Registration failed. Please try again")
        }
    }
  return (
    <div className='h-screen flex justify-center items-center'>
        <div className='h-112 w-70 border'>
            <div className='flex justify-center font-bold mt-3 text-2xl'>SIGN UP</div>
            <form onSubmit={handlesubmit} className='my-4'>
                <div className='ml-7 mb-1'>First Name</div>
                <input type="text" placeholder=' Enter your First Name' value={fname} onChange={(e)=>{setFname(e.target.value)}} className='w-4/5 h-9 rounded-xl border mx-7 mb-2'/>
                <div className='ml-7 mb-1'>Last Name</div>
                <input type="text" placeholder=' Enter your Last Name' value={lname} onChange={(e)=>{setLname(e.target.value)}} className='w-4/5 h-9 rounded-xl border mx-7 mb-2'/>
                <div className='ml-7 mb-1'>Gmail</div>
                <input type="email" placeholder=' Enter your Gmail address' value={gmail} onChange={(e)=>{setGmail(e.target.value)}} className='w-4/5 h-9 rounded-xl  border mx-7 mb-2'/>
                <div className='ml-7 mb-1'>Set Password</div>
                <input type="password" placeholder=' Set a strong password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='w-4/5 h-9 rounded-xl border mx-7 mb-2'/>
                <div className='flex justify-center mt-2'><button type='submit' className='bg-black text-white h-8 rounded-2xl mt-2 w-4/5'>Sign Up</button></div>
            </form>
            <div className='mt-6'><Link to={'/login'} className='flex justify-center '>Already have an Account?</Link></div>
        </div>
    </div>
  )
}
