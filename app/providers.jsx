'use client';

import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompareBar from '@/components/compare/CompareBar';
import ProductDetail from '@/components/product/ProductDetail';

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <CompareBar />
      <ProductDetail />
    </StoreProvider>
  );
}
