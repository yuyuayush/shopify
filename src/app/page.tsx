import React from 'react';
import { HeroBanner } from '@/components/home/hero-banner';
import { StoryReels } from '@/components/home/story-reels';
import { LookbookSection } from '@/components/home/lookbook-section';
import { FitSelector } from '@/components/home/fit-selector';
import { FeaturedCollections } from '@/components/home/featured-collections';
import { getCollections, getProducts } from '@/lib/shopify/client';
import { Flame, Sparkles, Star, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts({ limit: 12 }),
    getCollections(),
  ]);

  return (
    <div className="space-y-12 bg-black text-white overflow-hidden pb-12">
      
      {/* Category Reels / Story Circles */}
      <StoryReels />

      {/* Main Hero Slider */}
      <HeroBanner />

      {/* Interactive Shop The Look Section */}
      <LookbookSection />

      {/* Tabbed Product Grid by Fit */}
      <FitSelector products={products} />

      {/* Featured Collections Grid */}
      <FeaturedCollections collections={collections} />

      {/* Brand Trust Banner / UGC Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> OVER 50,000+ FIVE STAR REVIEWS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">
              JOIN THE SNITCH STREET SQUAD
            </h2>
            <p className="text-sm text-gray-400">
              Tag @snitch.official on Instagram & TikTok to get featured on our wall of fame and win free monthly streetwear drops.
            </p>
          </div>

          {/* Customer Reviews Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-300 italic font-medium">
                &quot;The 280 GSM acid-wash oversized tee fit is insane! Heavy drape, boxy drop shoulder, and didn&apos;t shrink after washing. Easily my favorite brand right now.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-rose-600 font-black text-white flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Aarav Sharma</h4>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer &bull; Mumbai
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-300 italic font-medium">
                &quot;The Matrix parachute cargos are top tier! Drawstring ankle cuffs let you style them baggy or tapered over kicks. Fast 2-day delivery too.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-cyan-600 font-black text-white flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Rohan Kapoor</h4>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer &bull; Bengaluru
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-300 italic font-medium">
                &quot;Cuban resort shirt fabric is super breathable for summer. Got so many compliments at the beach party. Snitch packaging is premium!&quot;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-amber-600 font-black text-white flex items-center justify-center text-xs">
                  VS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Vikram Singh</h4>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer &bull; Delhi NCR
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
