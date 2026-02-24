import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function statusStyle(status) {
  if (!status) return "bg-zinc-100 text-zinc-500 border border-transparent";

  switch (status.toLowerCase()) {
    case "placed": 
      return "bg-zinc-100 text-zinc-600 border border-transparent";
    case "packed": 
      return "bg-zinc-200 text-zinc-800 border border-transparent";
    case "shipped": 
      return "bg-zinc-900 text-white border border-transparent";
    case "out_for_delivery": 
      return "bg-stone-800 text-stone-100 border border-transparent";
    case "delivered": 
      return "bg-emerald-50/50 text-emerald-800 border border-emerald-200/60";
    case "cancelled": 
      return "bg-red-50/50 text-red-800 border border-red-200/60";
    default: 
      return "bg-zinc-100 text-zinc-500 border border-transparent";
  }
}

export default function OrderCard({ order }) {
  const statusLabel = order.status ? order.status.replaceAll("_", " ") : "Processing";
  
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [products,setProducts]=useState([]);
  console.log(products);

  useEffect(()=>{
    fetch("https://mv-enterprises-4.onrender.com").
    then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.log("Failed to load products ",err))
  },[]);
  
  return (
    <div className="group block bg-white border border-zinc-200 p-6 md:p-8 hover:border-zinc-900 transition-colors duration-500">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-zinc-100">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">
            Order Date
          </span>
          <span className="text-sm font-medium text-zinc-900">
            {formattedDate}
          </span>
        </div>
        
        <div className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium ${statusStyle(order.status)}`}>
          {statusLabel}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl md:text-2xl font-serif text-zinc-900">
            Order #{order.order_id}
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400">
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="space-y-3">
          {order.items.map((item, index) => {
            const product=products.find(p => p.id===Number(item.product_id));
            console.log(product);
            return(
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center text-zinc-600">
                <span className="w-6 text-zinc-400 font-serif italic text-xs">
                  {item.quantity}x
                </span>
                <div>
                  <div className="capitalize">{item.name}</div>
                  <div className="mt-2">
                    <Link  to={`/subcategory/${item.subcategory}/product/${item.product_id}`} state={{ product }} className="text-[12px] uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-900 transition-colors duration-300">View Product →</Link>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      <div className="flex justify-between items-end pt-6 border-t border-zinc-100">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">
            Total • {order.payment_method}
          </span>
          <span className="text-lg font-serif text-zinc-900">
            ₹{order.price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex flex-col items-end">
          {order.completed && (
            <span className="text-[10px] uppercase tracking-widest text-emerald-700 mb-2">
              Fulfilled
            </span>
          )}
          <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 group-hover:text-zinc-900 transition-colors duration-300 flex items-center gap-2">
            View Order Details <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}