'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/lib/shopify/types';
import { ArrowUpRight, Flame } from 'lucide-react';

interface FeaturedCollectionsProps {
  collections: Collection[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
            <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            MUST-HAVE CATEGORIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase mt-1">
            TRENDING COLLECTIONS
          </h2>
        </div>

        <Link
          href="/search"
          className="text-xs font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest flex items-center gap-1 hidden sm:flex"
        >
          View All Collections <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col, idx) => {
          const imgUrl =
            col.image?.url ||
            'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop';

          return (
            <Link
              key={col.id || idx}
              href={col.path || `/collections/${col.handle}`}
              className="group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 flex flex-col justify-end p-8 transition-all duration-500 hover:border-rose-500/60 hover:shadow-2xl hover:shadow-rose-950/40"
            >
              {/* Background Editorial Image */}
              <Image
                src={imgUrl}
                alt={col.title}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Card Content */}
              <div className="relative z-20 space-y-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-rose-400 text-[10px] font-black tracking-widest uppercase rounded-full inline-block">
                  EXPLORE DROP &bull; SNITCH
                </span>

                <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-rose-400 transition-colors">
                  {col.title}
                </h3>

                <p className="text-xs text-gray-300 line-clamp-2 font-medium">
                  {col.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase text-white tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                  <span>Shop Collection</span>
                  <ArrowUpRight className="w-4 h-4 text-rose-500" />
                </div>
              </div>

            </Link>
          );
        })}
      </div>

    </section>
  );
}
