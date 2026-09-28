'use client';

import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import { Order } from '@/lib/shopify/types';

export default function OrderTrackingPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setOrder(undefined);

    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to track order', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Live Order Tracking</h1>
        <p className="text-sm text-gray-400">
          Enter your Shopify Order ID or Order Number to check real-time fulfillment and tracking status.
        </p>
      </div>

      {/* Track Form */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            required
            placeholder="Enter Order ID (e.g., 8457866215481)"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-900 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-xl"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-500/25 hover:opacity-90 flex items-center gap-2"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {/* Order Status Display */}
      {searched && !loading && !order && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>No order found matching "{orderQuery}". Please check your order ID or sign into your account.</span>
        </div>
      )}

      {order && (
        <div className="rounded-3xl bg-gray-900/80 border border-white/10 p-8 shadow-2xl space-y-8 animate-fade-in">
          
          {/* Top Order Summary */}
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Order Details</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{order.name}</h2>
              <p className="text-xs text-gray-400 mt-1">Placed on {new Date(order.processedAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white">
                ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
              </span>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {order.financialStatus || 'PAID'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {order.fulfillmentStatus || 'PROCESSING'}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment Status Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Order Confirmed</h4>
                  <p className="text-[10px] text-gray-400">Payment verified</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                order.fulfillmentStatus === 'FULFILLED' ? 'bg-white/5 border-emerald-500/30' : 'bg-white/5 border-indigo-500/30'
              }`}>
                <Package className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Processing</h4>
                  <p className="text-[10px] text-gray-400">Inventory prepared</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                order.fulfillmentStatus === 'FULFILLED' ? 'bg-white/5 border-emerald-500/30' : 'bg-white/5 border-white/5'
              }`}>
                <Truck className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Out for Delivery</h4>
                  <p className="text-[10px] text-gray-400">With carrier</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                order.fulfillmentStatus === 'FULFILLED' ? 'bg-white/5 border-emerald-500/30' : 'bg-white/5 border-white/5'
              }`}>
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Delivered</h4>
                  <p className="text-[10px] text-gray-400">Destination reached</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Carrier Links */}
          {order.successfulFulfillments && order.successfulFulfillments.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase">Carrier Tracking Details</h4>
              {order.successfulFulfillments.map((fulfillment, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-white">
                  <span>Carrier: {fulfillment.trackingCompany || 'Courier'}</span>
                  {fulfillment.trackingInfo?.map((info, i) => (
                    <a
                      key={i}
                      href={info.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                    >
                      Track #{info.number} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Purchased Line Items */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Items in Order</h3>
            <div className="space-y-2">
              {order.lineItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-white">${parseFloat(item.originalTotalPrice.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
