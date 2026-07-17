'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Single source of truth — CompareBar, CompareWorkspace and ProductCard all
// read this off the store. Never re-declare it locally.
const MAX_COMPARE = 4;
const MAX_RECENT = 6;

// ── localStorage helpers (SSR-safe) ──
const read = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [saved, setSaved] = useState([]); // product ids
  const [compare, setCompare] = useState([]); // product ids
  const [recent, setRecent] = useState([]); // product ids
  const [detailId, setDetailId] = useState(null); // open product-detail modal
  const [profile, setProfileState] = useState(null); // { age, incomeLakh } for eligibility
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage once on mount.
  useEffect(() => {
    const t = read('um-theme', null) ||
      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(t);
    setSaved(read('um-saved', []));
    setCompare(read('um-compare', []));
    setRecent(read('um-recent', []));
    setProfileState(read('um-profile', null));
    setHydrated(true);
  }, []);

  // Apply + persist theme.
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    write('um-theme', theme);
  }, [theme, hydrated]);

  useEffect(() => { if (hydrated) write('um-saved', saved); }, [saved, hydrated]);
  useEffect(() => { if (hydrated) write('um-compare', compare); }, [compare, hydrated]);
  useEffect(() => { if (hydrated) write('um-recent', recent); }, [recent, hydrated]);
  useEffect(() => { if (hydrated) write('um-profile', profile); }, [profile, hydrated]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const toggleSave = useCallback((id) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);
  const isSaved = useCallback((id) => saved.includes(id), [saved]);

  const toggleCompare = useCallback((id) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= MAX_COMPARE) return c;
      return [...c, id];
    });
  }, []);
  const inCompare = useCallback((id) => compare.includes(id), [compare]);
  const clearCompare = useCallback(() => setCompare([]), []);

  const pushRecent = useCallback((id) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, MAX_RECENT));
  }, []);

  const setProfile = useCallback((p) => setProfileState(p), []);
  const clearProfile = useCallback(() => setProfileState(null), []);

  const openDetail = useCallback((id) => {
    setDetailId(id);
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, MAX_RECENT));
  }, []);
  const closeDetail = useCallback(() => setDetailId(null), []);

  const value = {
    hydrated,
    theme, toggleTheme,
    saved, toggleSave, isSaved,
    compare, toggleCompare, inCompare, clearCompare, MAX_COMPARE,
    recent, pushRecent,
    detailId, openDetail, closeDetail,
    profile, setProfile, clearProfile,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
