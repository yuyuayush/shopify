'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Sparkles, Plus, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { MOCK_PRODUCTS } from '@/lib/shopify/mockData';

const LOOKBOOK_HOTSPOTS = [
  {
    id: 'pin-1',
    productId: 'prod-snitch-1',
    title: 'Cyber Tokio Acid-Wash Tee',
    price: '$34.00',
    top: '28%',
    left: '48%',
    product: MOCK_PRODUCTS[0],
  },
  {
    id: 'pin-2',
    productId: 'prod-snitch-3',
    title: 'Matrix Parachute Cargos',
    price: '$58.00',
    top: '64%',
    left: '52%',
    product: MOCK_PRODUCTS[2],
  },
  {
    id: 'pin-3',
    productId: 'prod-snitch-6',
    title: 'Phantom Retro Chunky Kicks',
    price: '$85.00',
    top: '88%',
    left: '45%',
    product: MOCK_PRODUCTS[5],
  },
];

export function LookbookSection() {
  const [activePin, setActivePin] = useState<string | null>('pin-1');
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (product && product.variants && product.variants.length > 0) {
      await addItem(product.variants[0], product, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2500);
    }
  };

  const activeHotspot = LOOKBOOK_HOTSPOTS.find((h) => h.id === activePin);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            STREETWEAR LOOKBOOK &bull; SHOP THE FIT
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase mt-1">
            STYLING & COMPOSITION
          </h2>
        </div>
        <p className="text-sm text-gray-400 max-w-md">
          Tap any glowing hotspot pin on our editorial fit model to inspect the garment details, pick your size, and add items directly to your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-10">
        
        {/* Interactive Editorial Image Canvas */}
        <div className="lg:col-span-7 relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            alt="SNITCH Streetwear Editorial Fit"
            fill
            className="object-cover object-top filter brightness-95"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Hotspot Pulse Pins */}
          {LOOKBOOK_HOTSPOTS.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
              style={{ top: pin.top, left: pin.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group/pin z-30 flex items-center justify-center`}
              aria-label={`Inspect ${pin.title}`}
            >
              {/* Outer Pulse */}
              <span className="absolute w-8 h-8 rounded-full bg-rose-500/50 animate-ping" />
              {/* Core Button */}
              <span className={`relative w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-transform duration-300 shadow-xl border-2 ${
                activePin === pin.id ? 'bg-rose-600 text-white scale-125 border-white' : 'bg-black/90 text-white border-rose-500 hover:scale-110'
              }`}>
                {activePin === pin.id ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Item Preview Panel */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 uppercase tracking-widest w-fit">
            <span>FIT BREAKDOWN &bull; 3 PIECES</span>
          </div>

          {activeHotspot ? (
            <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 space-y-5 animate-in fade-in duration-300">
              <div className="flex gap-4 items-center">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={activeHotspot.product.featuredImage.url}
                    alt={activeHotspot.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {activeHotspot.product.vendor}
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {activeHotspot.title}
                  </h3>
                  <div className="text-xl font-extrabold text-rose-500 mt-1">
                    {activeHotspot.price}
                    <span className="text-xs text-gray-500 line-through ml-2 font-normal">
                      ${(parseFloat(activeHotspot.price.replace('$', '')) * 1.35).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2">
                {activeHotspot.product.description}
              </p>

              {/* Quick Add Action */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={(e) => handleQuickAdd(e, activeHotspot.product)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    addedId === activeHotspot.product.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  }`}
                >
                  {addedId === activeHotspot.product.id ? (
                    <>
                      <Check className="w-4 h-4" /> Added To Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Quick Add Fit
                    </>
                  )}
                </button>

                <Link
                  href={`/products/${activeHotspot.product.handle}`}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15"
                >
                  Details
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              Select a pin on the left image to view item details.
            </div>
          )}

          {/* Hotspot Selector Switchers */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Items in this look:
            </span>
            <div className="space-y-2">
              {LOOKBOOK_HOTSPOTS.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => setActivePin(pin.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all duration-200 text-left ${
                    activePin === pin.id
                      ? 'bg-rose-600/10 border-rose-500 text-white'
                      : 'bg-zinc-900/50 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {pin.title}
                  </span>
                  <span className="text-xs font-extrabold text-rose-400">
                    {pin.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
