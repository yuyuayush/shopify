'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: 'CRAZY DROPS • LIMITED EDITIONS',
    title: 'SUMMER STREETWEAR DROPS',
    subtitle: 'Heavyweight 280 GSM Oversized Tees & Matrix Parachute Utility Cargos engineered for maximum street presence.',
    ctaPrimary: 'Shop The Drop',
    ctaPrimaryLink: '/collections/oversized-tees',
    ctaSecondary: 'Parachute Cargos',
    ctaSecondaryLink: '/collections/parachute-cargos',
    badge: 'HOT DROP #047',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 2,
    tagline: 'KOREAN RESORT VIBES',
    title: 'CUBAN & SATIN SHIRTS',
    subtitle: 'Breezy open camp collars, high-lustre fluid satins, and boxy linen fits for effortless day-to-night statements.',
    ctaPrimary: 'Explore Korean Shirts',
    ctaPrimaryLink: '/collections/korean-fit-shirts',
    ctaSecondary: 'View Co-Ords',
    ctaSecondaryLink: '/collections/matching-coords',
    badge: 'RESTOCKED',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 3,
    tagline: 'STATEMENT OUTERWEAR',
    title: 'VARSITY & DENIM JACKETS',
    subtitle: 'Custom wool-blend varsity bombers with chenille toweling patches and washed vintage denim layers.',
    ctaPrimary: 'Shop Jackets',
    ctaPrimaryLink: '/collections/varsity-jackets',
    ctaSecondary: 'Retro Sneakers',
    ctaSecondaryLink: '/collections/urban-footwear',
    badge: 'EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop',
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image Carousel */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            sizes="100vw"
          />
          {/* Gradient Overlay for Vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-rose-600/40 backdrop-blur-md">
            <Flame className="w-4 h-4 fill-white text-white animate-pulse" />
            <span>{activeSlide.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>

          {/* Subheader / Tagline */}
          <p className="text-xs sm:text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 fill-rose-500" />
            {activeSlide.tagline}
          </p>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">
            {activeSlide.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed max-w-xl">
            {activeSlide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={activeSlide.ctaPrimaryLink}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl shadow-rose-600/30 flex items-center gap-3 group"
            >
              {activeSlide.ctaPrimary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={activeSlide.ctaSecondaryLink}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 backdrop-blur-md border border-white/15 hover:border-white/30"
            >
              {activeSlide.ctaSecondary}
            </Link>
          </div>

          {/* Live Social Proof Badge */}
          <div className="pt-6 flex items-center gap-3 text-xs text-gray-400 font-mono">
            <div className="flex -space-x-2">
              <span className="inline-block w-7 h-7 rounded-full bg-rose-500 border-2 border-black flex items-center justify-center font-bold text-white text-[10px]">🔥</span>
              <span className="inline-block w-7 h-7 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center font-bold text-white text-[10px]">⚡</span>
              <span className="inline-block w-7 h-7 rounded-full bg-cyan-500 border-2 border-black flex items-center justify-center font-bold text-white text-[10px]">🚀</span>
            </div>
            <span><strong className="text-white font-black">14,800+</strong> drops claimed this week</span>
          </div>

        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors backdrop-blur-md border border-white/10 hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors backdrop-blur-md border border-white/10 hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-10 bg-rose-600' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
