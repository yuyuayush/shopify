'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STORIES = [
  {
    id: 's1',
    title: 'JUST DROPPED',
    handle: 'oversized-tees',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=300&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 's2',
    title: 'OVERSIZED',
    handle: 'oversized-tees',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 's3',
    title: 'PARACHUTE',
    handle: 'parachute-cargos',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=300&auto=format&fit=crop',
    isHot: true,
  },
  {
    id: 's4',
    title: 'KOREAN SHIRTS',
    handle: 'korean-fit-shirts',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 's5',
    title: 'CO-ORDS',
    handle: 'matching-coords',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 's6',
    title: 'VARSITY',
    handle: 'varsity-jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 's7',
    title: 'KICKS',
    handle: 'urban-footwear',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=300&auto=format&fit=crop',
  },
];

export function StoryReels() {
  return (
    <div className="w-full bg-zinc-950/80 border-b border-white/5 py-4 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-6 min-w-max">
        {STORIES.map((story) => (
          <Link
            key={story.id}
            href={`/collections/${story.handle}`}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            {/* Story Circle Outer Ring */}
            <div className={`p-0.5 rounded-full transition-transform duration-300 group-hover:scale-110 ${
              story.isHot 
                ? 'bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 animate-story-ring' 
                : story.isNew 
                ? 'bg-gradient-to-tr from-cyan-400 via-rose-500 to-amber-300 animate-pulse'
                : 'bg-gradient-to-tr from-zinc-700 via-zinc-400 to-zinc-700 group-hover:from-rose-500 group-hover:to-amber-400'
            }`}>
              <div className="p-0.5 bg-black rounded-full">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="80px"
                  />
                  {story.isHot && (
                    <span className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[8px] font-black text-center py-0.5 uppercase tracking-tighter">
                      HOT
                    </span>
                  )}
                  {story.isNew && (
                    <span className="absolute bottom-0 inset-x-0 bg-cyan-500 text-black text-[8px] font-black text-center py-0.5 uppercase tracking-tighter">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Story Label */}
            <span className="text-[10px] font-extrabold tracking-wider text-gray-300 group-hover:text-rose-400 transition-colors uppercase">
              {story.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
