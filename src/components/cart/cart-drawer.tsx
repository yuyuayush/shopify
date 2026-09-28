'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Lock, Tag, Sparkles, Check, Truck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { MOCK_PRODUCTS } from '@/lib/shopify/mockData';

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity, isUpdating, addItem } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const lines = cart?.lines || [];
  const totalQuantity = cart?.totalQuantity || 0;
  const rawSubtotal = parseFloat(cart?.subtotalAmount?.amount || '0.00');
  
  // Apply coupon discount if active
  const discountAmount = couponApplied ? rawSubtotal * 0.2 : 0;
  const finalSubtotal = Math.max(0, rawSubtotal - discountAmount);

  // Free shipping threshold ($75.00)
  const freeShippingThreshold = 75.0;
  const freeShippingProgress = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SNITCH20' || couponCode.trim().toUpperCase() === 'SNITCH10') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try code "SNITCH20"!');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 2000);
  };

  // Upsell item
  const upsellProduct = MOCK_PRODUCTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-white/10 text-white flex flex-col shadow-2xl">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-tight">SHOPPING BAG</h2>
                <p className="text-[10px] text-gray-400 font-mono">
                  {totalQuantity} {totalQuantity === 1 ? 'ITEM' : 'ITEMS'} IN BAG
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-rose-950/40 border-b border-rose-500/20 px-5 py-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-rose-300 uppercase tracking-wider text-[11px]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-400" />
                {freeShippingProgress >= 100
                  ? '⚡ YOU UNLOCKED FREE EXPRESS SHIPPING!'
                  : `ADD $${amountNeededForFreeShipping.toFixed(2)} MORE FOR FREE SHIPPING`}
              </span>
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-500 rounded-full shadow-lg shadow-rose-600/50"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Order Completed Screen */}
          {orderComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-18 h-18 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">ORDER CONFIRMED!</h3>
              <p className="text-xs text-gray-300 max-w-xs">
                Thank you for shopping at SNITCH! Your order <strong className="text-rose-400 font-mono">#SN-{Math.floor(100000 + Math.random() * 900000)}</strong> has been received and is being prepared for express dispatch.
              </p>
              <button
                onClick={() => {
                  setOrderComplete(false);
                  closeCart();
                }}
                className="px-6 py-3 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-rose-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {lines.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-rose-500 border border-white/10">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">YOUR BAG IS EMPTY</h3>
                    <p className="text-xs text-gray-400 max-w-xs">
                      Discover our latest drop of heavyweight oversized tees, Cuban resort shirts, and parachute cargos.
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-2 px-6 py-3 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/30"
                    >
                      EXPLORE STREETWEAR DROPS
                    </button>
                  </div>
                ) : (
                  <>
                    {lines.map((line) => {
                      const merchandise = line.merchandise;
                      const product = merchandise?.product;
                      const image = merchandise?.image || product?.featuredImage;

                      return (
                        <div
                          key={line.id}
                          className="flex gap-4 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all"
                        >
                          {/* Item Thumbnail */}
                          <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-white/10">
                            {image?.url ? (
                              <Image
                                src={image.url}
                                alt={image.altText || product?.title || 'Product'}
                                fill
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-900" />
                            )}
                          </div>

                          {/* Item Information */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-black text-white uppercase tracking-tight line-clamp-1">
                                  {product?.title || 'Product'}
                                </h4>
                                <button
                                  onClick={() => removeItem(line.id)}
                                  disabled={isUpdating}
                                  className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[10px] font-mono text-rose-400 mt-0.5 uppercase">
                                {merchandise?.title !== 'Default Title' ? merchandise?.title : ''}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-white/15 rounded-lg bg-zinc-950">
                                <button
                                  onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1 text-gray-400 hover:text-white disabled:opacity-50 text-xs font-black"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-black text-white">
                                  {line.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1 text-gray-400 hover:text-white disabled:opacity-50 text-xs font-black"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <span className="text-sm font-black text-white">
                                ${parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                              </span>
                            </div>

                          </div>
                        </div>
                      );
                    })}

                    {/* Upsell Recommendation Banner */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-dashed border-rose-500/30 space-y-2">
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> PAIR IT WITH
                      </span>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0">
                            <Image src={upsellProduct.featuredImage.url} alt={upsellProduct.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white line-clamp-1 uppercase">{upsellProduct.title}</p>
                            <p className="text-[10px] text-gray-400">${upsellProduct.priceRange.minVariantPrice.amount}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addItem(upsellProduct.variants[0], upsellProduct, 1)}
                          className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-rose-500"
                        >
                          + ADD
                        </button>
                      </div>
                    </div>

                  </>
                )}
              </div>

              {/* Cart Footer Summary */}
              {lines.length > 0 && (
                <div className="p-5 border-t border-white/10 bg-black/90 space-y-4">
                  
                  {/* Coupon Form */}
                  {!couponApplied ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Promo Code (Try 'SNITCH20')"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 uppercase font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-white/10"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>✓ COUPON &quot;SNITCH20&quot; APPLIED (-20%)</span>
                      <button onClick={() => setCouponApplied(false)} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                  )}

                  {/* Summary Breakdown */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-white font-bold">${rawSubtotal.toFixed(2)}</span>
                    </div>

                    {couponApplied && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Discount (20% OFF)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span className="text-rose-400 font-bold">
                        {freeShippingProgress >= 100 ? 'FREE EXPRESS' : '$8.50'}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-black text-white uppercase tracking-wider">
                      <span>Total</span>
                      <span className="text-rose-500 text-base">
                        ${(finalSubtotal + (freeShippingProgress >= 100 ? 0 : 8.5)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition-all duration-300 active:scale-95 disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <span>PROCESSING ORDER...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        PROCEED TO CHECKOUT
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-500 font-mono">
                    🔒 SSL Encrypted • 7-Day Easy Returns & Exchanges
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
