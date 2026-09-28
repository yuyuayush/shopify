'use client';

import React from 'react';
import { ProductOption, ProductVariant } from '@/lib/shopify/types';

interface ProductVariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onOptionSelect: (optionName: string, value: string) => void;
}

export function ProductVariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionSelect,
}: ProductVariantSelectorProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id} className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-white tracking-wide">
              {option.name}: <span className="text-pink-400 font-normal">{selectedOptions[option.name]}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onOptionSelect(option.name, value)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 border-transparent text-white shadow-lg shadow-indigo-500/25 scale-105'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
