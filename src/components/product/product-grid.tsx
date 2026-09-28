import React from 'react';
import { Product } from '@/lib/shopify/types';
import { ProductCard } from './product-card';

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 bg-gray-900/30 rounded-2xl border border-white/5">
        <p className="text-base font-medium">No products found in this selection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
