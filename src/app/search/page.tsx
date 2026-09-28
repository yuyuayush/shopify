import React from 'react';
import { getCollections, getProducts } from '@/lib/shopify/client';
import { ProductGrid } from '@/components/product/product-grid';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Search & Catalog — AURA Storefront',
  description: 'Search and filter minimalist products across all collections.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q || '';
  const sort = resolvedSearchParams?.sort || 'RELEVANCE';

  let sortKey: string | undefined;
  let reverse: boolean | undefined;

  if (sort === 'price-asc') {
    sortKey = 'PRICE';
    reverse = false;
  } else if (sort === 'price-desc') {
    sortKey = 'PRICE';
    reverse = true;
  } else if (sort === 'latest-desc') {
    sortKey = 'CREATED_AT';
    reverse = true;
  }

  const [products, collections] = await Promise.all([
    getProducts({ query, sortKey, reverse }),
    getCollections(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Search className="w-7 h-7 text-pink-500" />
          {query ? `Search results for "${query}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-400">
          Showing {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <Link
            href="/search"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 text-white border border-white/15 whitespace-nowrap"
          >
            All
          </Link>
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.handle}`}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5 whitespace-nowrap"
            >
              {col.title}
            </Link>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Sort by:</span>
          <div className="flex gap-2">
            <Link
              href={`/search?q=${query}&sort=RELEVANCE`}
              className={`px-3 py-1 rounded-lg border ${
                sort === 'RELEVANCE' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              Relevance
            </Link>
            <Link
              href={`/search?q=${query}&sort=price-asc`}
              className={`px-3 py-1 rounded-lg border ${
                sort === 'price-asc' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/search?q=${query}&sort=price-desc`}
              className={`px-3 py-1 rounded-lg border ${
                sort === 'price-desc' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>

      </div>

      {/* Grid */}
      <ProductGrid products={products} />

    </div>
  );
}
