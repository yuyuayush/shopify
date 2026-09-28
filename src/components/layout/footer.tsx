'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight, Check } from 'lucide-react';

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-white/10 bg-black text-gray-400 mt-20">
      
      {/* Service Highlights Bar */}
      <div className="border-b border-white/5 py-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <div className="p-3 rounded-xl bg-rose-600/20 text-rose-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">EXPRESS SHIPPING</h4>
              <p className="text-[11px] text-gray-500">Free delivery on orders over $75</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">100% AUTHENTIC</h4>
              <p className="text-[11px] text-gray-500">Heavyweight premium fabrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">7-DAY EASY RETURNS</h4>
              <p className="text-[11px] text-gray-500">Hassle-free size exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <div className="p-3 rounded-xl bg-rose-600/20 text-rose-500">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">STREET CONCIERGE</h4>
              <p className="text-[11px] text-gray-500">24/7 dedicated chat support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter text-white font-sans uppercase">
              SNITCH
              <span className="ml-2 text-xs font-extrabold text-rose-500 tracking-widest px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                STREETWEAR
              </span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            India&apos;s fastest-growing youth streetwear brand. Redefining modern menswear with high-drape oversized tees, Korean camp collar resort shirts, multi-pocket parachute cargos, and limited edition varsity drops.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-rose-400 font-mono">
            <Flame className="w-4 h-4 fill-rose-500 animate-pulse text-rose-500" />
            <span>OVER 500,000+ HAPPY SNITCH SQUAD MEMBERS</span>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h3 className="text-white text-xs font-black tracking-widest uppercase">STREET DROPS</h3>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
            <li><Link href="/collections/oversized-tees" className="hover:text-rose-400 transition-colors">Oversized Tees</Link></li>
            <li><Link href="/collections/korean-fit-shirts" className="hover:text-rose-400 transition-colors">Korean Shirts</Link></li>
            <li><Link href="/collections/parachute-cargos" className="hover:text-rose-400 transition-colors">Parachute Cargos</Link></li>
            <li><Link href="/collections/matching-coords" className="hover:text-rose-400 transition-colors">Co-Ord Sets</Link></li>
            <li><Link href="/collections/varsity-jackets" className="hover:text-rose-400 transition-colors">Varsity Jackets</Link></li>
            <li><Link href="/collections/urban-footwear" className="hover:text-rose-400 transition-colors">Retro Kicks</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h3 className="text-white text-xs font-black tracking-widest uppercase">CUSTOMER HELP</h3>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
            <li><Link href="/orders/track" className="hover:text-rose-400 transition-colors text-rose-400">Track Order Live</Link></li>
            <li><Link href="/account" className="hover:text-rose-400 transition-colors">My Account</Link></li>
            <li><Link href="/search" className="hover:text-rose-400 transition-colors">Size Guide & Fit</Link></li>
            <li><Link href="/search" className="hover:text-rose-400 transition-colors">Returns & Exchange</Link></li>
            <li><Link href="/search" className="hover:text-rose-400 transition-colors">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-3">
          <h3 className="text-white text-xs font-black tracking-widest uppercase">SNITCH CLUB VIP</h3>
          <p className="text-xs text-gray-400">Subscribe for secret drop alerts & instant 15% OFF code.</p>
          
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-zinc-900 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors shrink-0 font-black text-xs"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> WELCOME TO SNITCH SQUAD! USE CODE &apos;SNITCH15&apos;
            </div>
          )}
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/5 py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500 uppercase">
          <p>© {new Date().getFullYear()} SNITCH STREETWEAR STORE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
            <span>STORE LOCATOR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
