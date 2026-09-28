'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ExternalLink } from 'lucide-react';
import { Customer } from '@/lib/shopify/types';

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('shopify_customer_token') : null;
        const res = await fetch('/api/account/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        if (!res.ok || !data.success || !data.customer) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('shopify_customer_token');
          }
          router.push('/account/login');
        } else {
          setCustomer(data.customer);
        }
      } catch (err) {
        console.error('Failed to load customer account', err);
        router.push('/account/login');
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/account/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopify_customer_token');
    }
    router.push('/account/login');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Fetching your Shopify account & order history...</p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gray-900/80 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/25">
            {customer.firstName ? customer.firstName[0] : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Welcome, {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-xs text-gray-400">{customer.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders/track"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10"
          >
            Track Order
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account Info & Saved Address */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Account Details
            </h2>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-500">Name</span>
                <span>{customer.firstName} {customer.lastName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-500">Email</span>
                <span>{customer.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Newsletter</span>
                <span className={customer.acceptsMarketing ? 'text-emerald-400' : 'text-gray-500'}>
                  {customer.acceptsMarketing ? 'Subscribed' : 'Not Subscribed'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-400" /> Shipping Address
            </h2>
            {customer.defaultAddress ? (
              <div className="text-xs text-gray-300 space-y-1">
                <p className="font-semibold text-white">{customer.defaultAddress.address1}</p>
                {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
                <p>{customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}</p>
                <p>{customer.defaultAddress.country}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No default shipping address saved on Shopify yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" /> Recent Shopify Orders
            </h2>
            <span className="text-xs text-gray-400">{customer.orders?.length || 0} Total Orders</span>
          </div>

          {!customer.orders || customer.orders.length === 0 ? (
            <div className="p-12 rounded-2xl bg-gray-900/40 border border-white/10 text-center space-y-4">
              <Package className="w-10 h-10 text-gray-600 mx-auto" />
              <h3 className="text-sm font-semibold text-gray-300">No orders placed yet</h3>
              <p className="text-xs text-gray-500">When you check out on Shopify, your order history will appear here.</p>
              <Link
                href="/search"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold text-xs rounded-xl"
              >
                Shop Catalog
              </Link>
            </div>
          ) : (
            customer.orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-gray-900/80 border border-white/10 hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-white/10 pb-4">
                  <div>
                    <span className="font-bold text-white text-sm">{order.name}</span>
                    <p className="text-gray-400 text-[11px]">Placed on {new Date(order.processedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.fulfillmentStatus === 'FULFILLED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {order.fulfillmentStatus || 'Processing'}
                    </span>
                    <span className="text-sm font-bold text-white">
                      ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                    </span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                  {order.lineItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-gray-200">{item.title}</p>
                        <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-gray-300">${parseFloat(item.originalTotalPrice.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Status Link / Tracking */}
                {order.statusUrl && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={order.statusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      View Official Shopify Receipt & Tracking <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
