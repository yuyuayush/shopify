'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/shopify/types';
import { useCart } from '@/context/cart-context';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.featuredImage?.url || product.images?.[0]?.url || ''
  );
  
  const sizeOption = product.options?.find((o) => o.name.toLowerCase() === 'size');
  const availableSizes = sizeOption ? sizeOption.values : ['S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images?.length > 0 ? product.images : [product.featuredImage];

  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.variants?.[0]?.compareAtPrice
    ? parseFloat(product.variants[0].compareAtPrice.amount)
    : minPrice * 1.35;

  const handleAddToCart = async () => {
    let targetVariant = product.variants.find((v) =>
      v.selectedOptions.some((opt) => opt.value === selectedSize)
    );
    if (!targetVariant && product.variants.length > 0) {
      targetVariant = product.variants[0];
    }
    if (targetVariant) {
      await addItem(targetVariant, product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 text-gray-300 hover:text-white hover:bg-rose-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="md:w-1/2 p-6 flex flex-col items-center bg-zinc-900/50">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto max-w-full pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img.url ? 'border-rose-500 scale-105' : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          
          <div>
            {/* Header / Vendor */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest">
                {product.vendor || 'SNITCH STREETWEAR'}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating || 4.9}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount || 128} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
              {product.title}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-black text-white">
                ${minPrice.toFixed(2)}
              </span>
              {compareAtPrice > minPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="px-2 py-0.5 bg-rose-600/20 text-rose-400 text-xs font-bold rounded border border-rose-500/30">
                SAVE {(compareAtPrice - minPrice).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 mt-4 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          </div>

          {/* Options & Selection */}
          <div className="space-y-4">
            {/* Size Picker */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 text-gray-300">
                <span>Select Size:</span>
                <span className="text-rose-400 hover:underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                      selectedSize === size
                        ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                        : 'bg-zinc-900 text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Quantity:</span>
              <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-white hover:bg-white/10 transition-colors font-black"
                >
                  -
                </button>
                <span className="px-4 text-xs font-black text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-white hover:bg-white/10 transition-colors font-black"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Button & Guarantees */}
          <div className="space-y-4 pt-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added To Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" /> Add To Shopping Bag
                </>
              )}
            </button>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[10px] font-bold text-gray-400 text-center uppercase">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-rose-400" /> Express Delivery
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-rose-400" /> Easy 7-Day Return
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-rose-400" /> 100% Authentic
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
