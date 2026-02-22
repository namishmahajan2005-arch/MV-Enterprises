import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { authFetch } from "../utils/authFetch";
import { Navbar } from './navbar';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await authFetch(`http://127.0.0.1:8000/orders/${id}`);
        const data = await res.json();
        setOrder(data.order);
        setUpdates(data.updates || []);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="animate-pulse text-zinc-400 uppercase tracking-widest text-sm">Retrieving Details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-zinc-500 uppercase tracking-widest text-sm">Order Not Found</div>
      </div>
    );
  }

  const formatStatus = (status) => status ? status.replaceAll("_", " ") : "Processing";

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        
        <div className="mb-12">
          <Link 
            to="/orders" 
            className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors duration-300 flex items-center gap-2 w-fit"
          >
            <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span> Back to Orders
          </Link>
        </div>

        <div className="border-b border-zinc-200/60 pb-12 mb-12">
          <span className="block text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Digital Receipt
          </span>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-2">
                Order #{order.order_id}
              </h1>
              <p className="text-sm text-zinc-500">
                Placed on {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">
                Total Amount
              </span>
              <span className="text-2xl font-serif text-zinc-900">
                ₹{order.price?.toLocaleString('en-IN') || "0"}
              </span>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-10">
            Journey & Updates
          </h2>

          <div className="relative pl-4 md:pl-0">
            <div className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-[1px] bg-zinc-200"></div>

            <div className="space-y-10">
              {updates.map((update, index) => {
                const isLatest = index === 0; 
                const statusName = formatStatus(update.status);
                
                return (
                  <div key={index} className="relative flex items-start gap-8 group">

                    <div className="relative z-10 flex items-center justify-center bg-[#FAF9F6] py-2">
                      <div className={`rounded-full transition-colors duration-500 ${
                        isLatest 
                          ? 'w-6 h-6 border-[6px] border-zinc-900 bg-[#FAF9F6]' 
                          : 'w-2 h-2 bg-zinc-300 ml-2'
                      }`} />
                    </div>

                    <div className={`pt-1 md:pt-1.5 ${isLatest ? 'opacity-100' : 'opacity-60'} transition-opacity hover:opacity-100`}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
                        <h3 className={`capitalize text-lg ${isLatest ? 'font-serif text-zinc-900' : 'font-sans font-medium text-zinc-600'}`}>
                          {statusName}
                        </h3>
                        <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-400">
                          {new Date(update.time).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {update.message && (
                        <p className={`text-sm leading-relaxed max-w-lg ${isLatest ? 'text-zinc-600' : 'text-zinc-500'}`}>
                          {update.message}
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}