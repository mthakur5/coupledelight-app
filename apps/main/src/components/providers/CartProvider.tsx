'use client';

import { CartProvider as Cart } from '@/contexts/CartContext';
import { ReactNode } from 'react';

export default function CartProvider({ children }: { children: ReactNode }) {
  return <Cart>{children}</Cart>;
}