'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye, Check, Star, Flame } from 'lucide-react';
import { Product } from '@/lib/shopify/types';
import { useCart } from '@/context/cart-context';
import { QuickViewModal } from './quick-view-modal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Extract available sizes from variants or options
  const sizeOption = product.options?.find(
    (opt) => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'edition'
  );
  const availableSizes = sizeOption ? sizeOption.values : ['S', 'M', 'L', 'XL', 'XXL'];

  const primaryImage = product.featuredImage?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.variants?.[0]?.compareAtPrice
    ? parseFloat(product.variants[0].compareAtPrice.amount)
    : minPrice * 1.35;
  const discountPercent = Math.round(((compareAtPrice - minPrice) / compareAtPrice) * 100);

  const handleSizeAdd = async (e: React.MouseEvent, sizeVal: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(sizeVal);

    // Find variant matching selected size
    let targetVariant = product.variants.find((v) =>
      v.selectedOptions.some((opt) => opt.value === sizeVal)
    );

    if (!targetVariant && product.variants.length > 0) {
      targetVariant = product.variants[0];
    }

    if (targetVariant) {
      await addItem(targetVariant, product, 1);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        setQuickAddOpen(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-950/30">
        
        {/* Product Image Box */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
          
          {/* Main Link Image with Hover Transition */}
          <Link href={`/products/${product.handle}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              className="object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <Image
              src={secondaryImage}
              alt={`${product.title} Back View`}
              fill
              className="object-cover object-top transition-all duration-700 ease-out opacity-0 group-hover:scale-105 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black tracking-widest uppercase rounded">
                -{discountPercent}% OFF
              </span>
            )}
            {product.tags?.includes('bestseller') && (
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-black tracking-widest uppercase rounded flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                BESTSELLER
              </span>
            )}
            {product.tags?.includes('hot-drop') && (
              <span className="px-2.5 py-1 bg-cyan-500 text-black text-[10px] font-black tracking-widest uppercase rounded">
                HOT DROP
              </span>
            )}
          </div>

          {/* Top Right Action Buttons (Wishlist & Quick View) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                isWishlisted
                  ? 'bg-rose-600 text-white border-rose-500 scale-110'
                  : 'bg-black/60 text-gray-300 hover:text-rose-400 border-white/10 hover:border-white/30'
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={() => setQuickViewOpen(true)}
              className="p-2 rounded-full bg-black/60 text-gray-300 hover:text-white hover:bg-rose-600 border border-white/10 hover:border-rose-500 transition-all duration-300 backdrop-blur-md"
              aria-label="Quick View Product"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick-Add Drawer Trigger / Size Selector Bar */}
          <div className="absolute inset-x-3 bottom-3 z-20">
            {!quickAddOpen ? (
              <button
                onClick={() => setQuickAddOpen(true)}
                className="w-full py-3 bg-black/85 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 hover:border-rose-500 flex items-center justify-center gap-2 transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              >
                <ShoppingBag className="w-4 h-4" />
                Quick Add
              </button>
            ) : (
              <div className="bg-black/95 backdrop-blur-md border border-rose-500 p-2.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider">
                  <span>Select Size:</span>
                  <button
                    onClick={() => setQuickAddOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeAdd(e, size)}
                      className={`py-1.5 text-xs font-black rounded border transition-all ${
                        selectedSize === size && added
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-zinc-900 hover:bg-rose-600 text-white border-white/10 hover:border-rose-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Product Details Section */}
        <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
          <div>
            {/* Vendor / Category */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-rose-400 tracking-widest">
              <span>{product.vendor || 'SNITCH'}</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {product.rating || 4.9}
              </span>
            </div>

            {/* Product Title */}
            <Link
              href={`/products/${product.handle}`}
              className="block mt-1 text-sm font-extrabold text-white hover:text-rose-400 transition-colors uppercase tracking-tight line-clamp-1"
            >
              {product.title}
            </Link>
          </div>

          {/* Price Box */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white tracking-tight">
                ${minPrice.toFixed(2)}
              </span>
              {compareAtPrice > minPrice && (
                <span className="text-xs text-gray-500 line-through font-normal">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock meter */}
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In Stock
            </span>
          </div>

        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
