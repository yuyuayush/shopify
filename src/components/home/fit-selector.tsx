'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/lib/shopify/types';
import { Flame, Sparkles } from 'lucide-react';

interface FitSelectorProps {
  products: Product[];
}

const FIT_TABS = [
  { id: 'all', label: '🔥 All Drops' },
  { id: 'oversized-tees', label: 'Oversized Tees' },
  { id: 'korean-fit-shirts', label: 'Korean Shirts' },
  { id: 'parachute-cargos', label: 'Parachute Cargos' },
  { id: 'matching-coords', label: 'Co-Ord Sets' },
  { id: 'varsity-jackets', label: 'Outerwear & Jackets' },
];

export function FitSelector({ products }: FitSelectorProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category === activeTab ||
            p.tags?.includes(activeTab) ||
            p.handle.includes(activeTab)
        );

  const displayList = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
            <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            CURATED CATEGORIES &bull; SNITCH DROPS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase mt-1">
            SHOP BY FIT & STYLE
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {FIT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 scale-105'
                  : 'bg-zinc-900/80 text-gray-400 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}
