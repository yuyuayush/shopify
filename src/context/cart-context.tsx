'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, Product, ProductVariant } from '@/lib/shopify/types';

interface CartContextType {
  cart: Cart | undefined;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (variant: ProductVariant, product: Product, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isUpdating: boolean;
  refreshCart: (reset?: boolean) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshCart = async (reset = false) => {
    try {
      const url = reset ? '/api/cart?reset=true' : '/api/cart';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  useEffect(() => {
    refreshCart();

    // When user returns to window tab (e.g. after completing Shopify checkout)
    const handleFocus = () => {
      refreshCart();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = async (variant: ProductVariant, product: Product, quantity = 1) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          merchandiseId: variant.id,
          quantity,
        }),
      });

      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to add item to cart', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (lineId: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          lineId,
        }),
      });

      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Failed to remove item from cart', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: quantity <= 0 ? 'remove' : 'update',
          lineId,
          quantity,
        }),
      });

      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Failed to update quantity', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const clearCart = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/cart', { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Failed to clear cart', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isUpdating,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
