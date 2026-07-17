'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    setSent(true); // demo — no backend
  };

  return (
    <div className="container-page py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <span className="section-eyebrow">Contact</span>
          <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Still confused? Talk to us</h1>
          <p className="text-lg text-ink-500 dark:text-ink-400 mt-4 leading-relaxed">
            Have a question about a product or your match? Drop us a note and we'll help you decide — no sales pressure.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 card-surface p-4">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600"><Mail size={20} /></span>
              <div><p className="text-xs text-ink-400 font-semibold">Email</p><p className="font-bold text-ink-900 dark:text-white">hello@unfilteredmoney.example</p></div>
            </div>
            <div className="flex items-center gap-3 card-surface p-4">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600"><MessageSquare size={20} /></span>
              <div><p className="text-xs text-ink-400 font-semibold">Response time</p><p className="font-bold text-ink-900 dark:text-white">Within 24 hours</p></div>
            </div>
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          {sent ? (
            <div className="grid place-items-center text-center py-12">
              <span className="grid place-items-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 mb-4"><Check size={30} /></span>
              <p className="font-display font-bold text-xl text-ink-900 dark:text-white">Message sent!</p>
              <p className="text-sm text-ink-500 mt-1">We'll get back to you soon. (Demo — nothing was actually sent.)</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-ink-700 dark:text-ink-200">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1.5" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-700 dark:text-ink-200">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field mt-1.5" placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-700 dark:text-ink-200">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field mt-1.5 resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3">Send message <Send size={16} /></button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
