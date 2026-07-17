import Link from 'next/link';
import { Lock, Database, Cookie, UserCheck, Mail, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'What UnfilteredMoney stores (almost nothing), what never leaves your browser, and your rights under the DPDP Act 2023.',
  alternates: { canonical: 'https://unfilteredmoney.example/privacy-policy' },
};

const stored = [
  ['Your finder answers', 'Your browser only — localStorage. Never sent to us.'],
  ['Your shortlist (❤️)', 'Your browser only — localStorage.'],
  ['Your compare selection', 'Your browser only — localStorage.'],
  ['Your age / income for eligibility', 'Your browser only — localStorage. We never transmit it.'],
  ['Your spend in the simulators', 'Held in memory for the session. Not stored at all.'],
  ['Light/dark theme choice', 'Your browser only — localStorage.'],
];

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <span className="section-eyebrow"><Lock size={14} /> Privacy</span>
      <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Privacy Policy</h1>
      <p className="text-sm text-ink-400 mt-3">Last updated 17 July 2026</p>

      <div className="rounded-2xl border-2 border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 p-5 mt-8">
        <p className="text-ink-700 dark:text-ink-200 leading-relaxed">
          <strong>The short version:</strong> this site has no accounts, no database and no analytics.
          Everything you type — your finder answers, your age, your income, your spend — is computed
          in your own browser and stored in your own browser. We never receive it, so we could not
          sell it even if we wanted to.
        </p>
      </div>

      <Section icon={Database} title="What we store, and where">
        <div className="space-y-2">
          {stored.map(([what, where]) => (
            <div key={what} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-xl bg-ink-50 dark:bg-ink-800 p-3">
              <span className="text-sm font-bold text-ink-800 dark:text-ink-100 sm:w-56 shrink-0">{what}</span>
              <span className="text-sm text-ink-600 dark:text-ink-300">{where}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-4 leading-relaxed">
          You can wipe all of it any time by clearing site data in your browser, or by using the
          clear/reset controls built into each tool. Nothing is retained on our side because nothing
          reaches our side.
        </p>
      </Section>

      <Section icon={Cookie} title="Cookies & tracking">
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          We set <strong>no cookies</strong> and run <strong>no analytics</strong> or advertising
          trackers in this build. We use <code className="text-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">localStorage</code>,
          which is not a cookie and is never transmitted with requests.
        </p>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-3 leading-relaxed">
          If analytics are added later, this page will say so before they go live, and any
          non-essential tracking will ask for consent first.
        </p>
      </Section>

      <Section icon={ArrowRight} title="Outbound / affiliate links">
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          Some “Apply” links are affiliate links, marked <strong>Sponsored</strong>. When you click one,
          you leave this site and the destination’s own privacy policy takes over — they may set
          cookies and identify you. That is their processing, not ours. We do not pass any of your
          browser-stored data along with you.
        </p>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-3">
          See <Link href="/methodology" className="text-brand-600 font-semibold hover:underline">how we get paid</Link> for
          the full commercial picture.
        </p>
      </Section>

      <Section icon={Mail} title="The contact form">
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          The contact form on this demo is <strong>not wired to a backend</strong> — submitting it sends
          nothing anywhere. When it is connected, this policy will state exactly what is collected,
          why, how long it is kept, and you will be asked to consent first.
        </p>
      </Section>

      <Section icon={UserCheck} title="Your rights (DPDP Act 2023)">
        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          India’s Digital Personal Data Protection Act 2023 gives you the right to access, correct and
          erase your personal data, and to withdraw consent. Because we hold no personal data about
          you, there is nothing for us to access, correct or erase — your data is already entirely
          under your control, in your browser.
        </p>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-3">
          If that ever changes, we will publish a named Data Protection contact and a grievance
          process here before collecting anything.
        </p>
      </Section>

      <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 p-5 mt-8">
        <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
          <strong>Demo notice.</strong> UnfilteredMoney is a demonstration build with illustrative sample
          data. It is not registered with SEBI, IRDAI or the RBI, and nothing here is financial advice.
        </p>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-display font-extrabold text-xl text-ink-900 dark:text-white mb-3">
        <Icon size={18} className="text-brand-600" /> {title}
      </h2>
      {children}
    </section>
  );
}
