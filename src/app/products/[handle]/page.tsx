import React from 'react';
import { notFound } from 'next/navigation';
import { getProduct, getProductRecommendations } from '@/lib/shopify/client';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductDetailClient } from './product-detail-client';
import { Truck, ShieldCheck, RefreshCw, Star, Sparkles } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!handle) return {};
  const product = await getProduct(handle);
  if (!product) return {};

  return {
    title: `${product.title} — AURA Storefront`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!handle) notFound();

  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const recommendations = await getProductRecommendations(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : []} />
        </div>

        {/* Right Column: Details & Selection */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Vendor / Rating */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {product.vendor || product.category || 'Luxury Drop'}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1.5 text-amber-400 text-sm font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-xs text-gray-500 font-normal">({product.reviewsCount || 42} reviews)</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* Client Interactive Options & Add To Cart */}
          <ProductDetailClient product={product} />

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <Truck className="w-5 h-5 text-indigo-400 mx-auto" />
              <p className="text-[11px] font-medium text-gray-300">Free Express Delivery</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <ShieldCheck className="w-5 h-5 text-pink-400 mx-auto" />
              <p className="text-[11px] font-medium text-gray-300">2-Year Warranty</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <RefreshCw className="w-5 h-5 text-emerald-400 mx-auto" />
              <p className="text-[11px] font-medium text-gray-300">30-Day Easy Return</p>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" /> Product Highlights
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>

      </div>

      {/* Recommended Products Carousel / Section */}
      {recommendations.length > 0 && (
        <section className="pt-12 border-t border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">You Might Also Like</h2>
            <span className="text-xs text-gray-400">Curated recommendations</span>
          </div>
          <ProductGrid products={recommendations} />
        </section>
      )}

    </div>
  );
}
