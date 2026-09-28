'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { useCart } from '@/context/cart-context';

export function AddToCartButton({
  product,
  selectedVariant,
  disabled,
}: {
  product: Product;
  selectedVariant?: ProductVariant;
  disabled?: boolean;
}) {
  const { addItem, isUpdating } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant || disabled) return;
    await addItem(selectedVariant, product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale;

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || !isAvailable || isUpdating}
      className={`w-full py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
        !isAvailable
          ? 'bg-zinc-800 text-gray-500 cursor-not-allowed border border-white/5'
          : added
          ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]'
          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 transform active:scale-95'
      }`}
    >
      {isUpdating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>ADDING TO BAG...</span>
        </>
      ) : added ? (
        <>
          <Check className="w-4 h-4" />
          <span>ADDED TO BAG!</span>
        </>
      ) : !isAvailable ? (
        <span>OUT OF STOCK</span>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          <span>ADD TO BAG &bull; ${parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}</span>
        </>
      )}
    </button>
  );
}
