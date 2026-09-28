'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { AddToCartButton } from '@/components/product/add-to-cart-button';

export function ProductDetailClient({ product }: { product: Product }) {
  // Initialize option state with first available variant or first values
  const defaultVariant = product.variants[0];
  const initialOptions: Record<string, string> = {};

  product.options.forEach((opt) => {
    if (defaultVariant) {
      const match = defaultVariant.selectedOptions.find((so) => so.name === opt.name);
      initialOptions[opt.name] = match ? match.value : opt.values[0];
    } else {
      initialOptions[opt.name] = opt.values[0];
    }
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  // Find matching variant
  const selectedVariant: ProductVariant | undefined = product.variants.find((v) =>
    v.selectedOptions.every((so) => selectedOptions[so.name] === so.value)
  ) || defaultVariant;

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount).toFixed(2)
    : parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2);

  const compareAtPrice = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount).toFixed(2)
    : null;

  return (
    <div className="space-y-6">
      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-white">${currentPrice}</span>
        {compareAtPrice && (
          <span className="text-lg text-gray-500 line-through">${compareAtPrice}</span>
        )}
        <span className="text-xs font-semibold text-gray-400 uppercase">
          {selectedVariant?.price.currencyCode || 'USD'}
        </span>
      </div>

      {/* Option Selector Pills */}
      <ProductVariantSelector
        options={product.options}
        variants={product.variants}
        selectedOptions={selectedOptions}
        onOptionSelect={handleOptionSelect}
      />

      {/* Action Add To Cart Button */}
      <AddToCartButton product={product} selectedVariant={selectedVariant} />
    </div>
  );
}
