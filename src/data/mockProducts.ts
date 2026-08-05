import type { Product } from '../types';

/** Product catalogue emptied for Krishna Jewellers redesign — keep typing / imports. */
export const PRODUCTS: Product[] = [];

export function getProductBySlug(_slug: string): Product | undefined {
  return undefined;
}

export function getProductsByCategory(_categorySlug: string): Product[] {
  return [];
}

export function getFeaturedProducts(): Product[] {
  return [];
}

export function getNewArrivals(): Product[] {
  return [];
}
