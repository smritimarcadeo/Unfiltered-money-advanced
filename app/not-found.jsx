import Link from 'next/link';
import { Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display font-extrabold text-7xl text-brand-600">404</p>
      <h1 className="heading-xl text-2xl mt-4">This page took an unfiltered turn</h1>
      <p className="text-ink-500 dark:text-ink-400 mt-2">The page you're looking for doesn't exist.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary"><Home size={16} /> Go home</Link>
        <Link href="/insurance/finder" className="btn-ghost"><Sparkles size={16} /> Try the finder</Link>
      </div>
    </div>
  );
}
