'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Flame, Heart, User, Truck, Zap } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function Navbar() {
  const { cart, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(3);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const totalQuantity = cart?.totalQuantity || 0;

  return (
    <>
      {/* Infinite Marquee Top Announcement Bar */}
      <div className="bg-black text-white text-[11px] font-bold py-2 border-b border-white/10 overflow-hidden relative z-50">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 tracking-widest uppercase">
          <span className="flex items-center gap-2 text-rose-400">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            END OF SEASON DROP IS LIVE — UP TO 60% OFF
          </span>
          <span className="flex items-center gap-2 text-yellow-400">
            <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            USE CODE &quot;SNITCH20&quot; FOR EXTRA 20% OFF
          </span>
          <span className="flex items-center gap-2 text-cyan-400">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            FREE OVERNIGHT SHIPPING ON ORDERS OVER $75
          </span>
          <span className="flex items-center gap-2 text-rose-400">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            END OF SEASON DROP IS LIVE — UP TO 60% OFF
          </span>
          <span className="flex items-center gap-2 text-yellow-400">
            <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            USE CODE &quot;SNITCH20&quot; FOR EXTRA 20% OFF
          </span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 glass-nav backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo - SNITCH Style */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white font-sans flex items-center gap-1.5 uppercase">
                SNITCH
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-600 text-white rounded tracking-widest">
                  STREETWEAR
                </span>
              </span>
              <span className="text-[9px] text-gray-400 tracking-widest uppercase font-mono">
                LUXURY FIT • REFINED DROPS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-gray-300">
            <Link href="/" className="hover:text-rose-500 transition-colors duration-200">
              New Drops
            </Link>
            <Link href="/collections/oversized-tees" className="hover:text-rose-500 transition-colors duration-200">
              Oversized Tees
            </Link>
            <Link href="/collections/korean-fit-shirts" className="hover:text-rose-500 transition-colors duration-200">
              Korean Shirts
            </Link>
            <Link href="/collections/parachute-cargos" className="hover:text-rose-500 transition-colors duration-200">
              Parachute Cargos
            </Link>
            <Link href="/collections/matching-coords" className="hover:text-rose-500 transition-colors duration-200">
              Co-Ords
            </Link>
            <Link href="/collections/varsity-jackets" className="hover:text-rose-500 transition-colors duration-200">
              Jackets
            </Link>
            <Link href="/collections/urban-footwear" className="hover:text-rose-500 transition-colors duration-200">
              Kicks
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/search"
              className="p-2 text-gray-300 hover:text-rose-500 hover:bg-white/10 rounded-full transition-all duration-200 relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              href="/account"
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 hidden sm:block"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 bg-white/10 hover:bg-rose-600 text-white rounded-full transition-all duration-300 group flex items-center justify-center shadow-lg shadow-black/50"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-black/95 py-4 px-4 sm:px-6 transition-all duration-300">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-rose-500" />
              <input
                type="text"
                placeholder="Search Oversized Tees, Cuban Shirts, Cargos, Co-Ords, Varsity Jackets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-28 py-3 bg-zinc-900 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 text-sm tracking-wide"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/95 px-6 py-6 space-y-4 flex flex-col font-bold uppercase tracking-wider text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              New Drops 🔥
            </Link>
            <Link
              href="/collections/oversized-tees"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              Oversized Tees
            </Link>
            <Link
              href="/collections/korean-fit-shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              Korean Shirts
            </Link>
            <Link
              href="/collections/parachute-cargos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              Parachute Cargos
            </Link>
            <Link
              href="/collections/matching-coords"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              Co-Ord Sets
            </Link>
            <Link
              href="/collections/varsity-jackets"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              Varsity & Denim Jackets
            </Link>
            <Link
              href="/collections/urban-footwear"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-200 hover:text-rose-500 py-1"
            >
              Retro Sneakers
            </Link>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <Link href="/orders/track" onClick={() => setMobileMenuOpen(false)} className="text-rose-400 hover:underline">
                Track Order
              </Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
                My Account
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
