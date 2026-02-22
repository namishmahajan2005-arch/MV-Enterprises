import React from 'react'
import { Navbar } from './navbar'
import { authFetch } from '../utils/authFetch'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OrderCard from './ordercard'

export default function MyOrders() {
    const [orders,setOrders]=useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
      async function fetchOrders(){
        try{
          const res=await authFetch("https://mv-enterprises-4.onrender.com/myorders");
          const data= await res.json();
          setOrders(data);
        }catch(err){
          console.log("Failed to load orders ",err)
        }finally{
          setLoading(false);
        }
      }
      fetchOrders();
    },[]);
    console.log(orders);

    if(loading){
      return <div className='p-10 text-center'>Loading Orders...</div>
    }
    if(!orders){
      return <div className='p-10 text-center'>No Orders yet</div>
    }
  return (
    <>
        <Navbar/>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h4 className="text-2xl font-semibold mb-6">My Orders</h4>

          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        </div>
    </>
  )
}
