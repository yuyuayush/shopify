'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Image as ImageType } from '@/lib/shopify/types';

export function ProductGallery({ images }: { images: ImageType[] }) {
  const [selectedImage, setSelectedImage] = useState<ImageType>(images[0] || { url: '', altText: '' });

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-gray-900 flex items-center justify-center text-gray-600 border border-white/10">
        No Images Available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Selector List */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[500px] scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                selectedImage.url === img.url
                  ? 'border-pink-500 scale-95 shadow-lg shadow-pink-500/20'
                  : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Display Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl flex-1">
        {selectedImage.url && (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || 'Product image'}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
          />
        )}
      </div>
    </div>
  );
}
