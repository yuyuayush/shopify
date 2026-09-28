import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCollection, getCollectionProducts, getCollections } from '@/lib/shopify/client';
import { ProductGrid } from '@/components/product/product-grid';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!handle) return {};
  const collection = await getCollection(handle);
  if (!collection) return {};

  return {
    title: `${collection.title} Collection — AURA Storefront`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!handle) notFound();

  const [collection, products, allCollections] = await Promise.all([
    getCollection(handle),
    getCollectionProducts({ collection: handle }),
    getCollections(),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Collection Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-white/10 p-8 sm:p-12">
        {collection.image?.url && (
          <Image
            src={collection.image.url}
            alt={collection.title}
            fill
            priority
            className="object-cover opacity-40"
          />
        )}
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Shop Collection</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {collection.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Collection Category Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allCollections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.handle}`}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border whitespace-nowrap transition-all ${
              col.handle === handle
                ? 'bg-gradient-to-r from-indigo-500 to-pink-500 border-transparent text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {col.title}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Showing {products.length} products</span>
        </div>
        <ProductGrid products={products} />
      </section>

    </div>
  );
}
