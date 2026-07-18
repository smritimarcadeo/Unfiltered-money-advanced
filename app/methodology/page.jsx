import Link from 'next/link';
import { Scale, Sparkles, Coins, RefreshCw, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'How we rate — our methodology',
  description: 'Exactly how UnfilteredMoney scores products, how the Preference Finder ranks your matches, and how we make money. No black box.',
};

const criteria = [
  { name: 'Claim record / Rewards rate', weight: '30%', text: 'For insurance: the claim settlement ratio and how the insurer behaves at claim time. For cards: the real reward rate after caps and exclusions — not the headline number.' },
  { name: 'Value for money', weight: '30%', text: 'What you pay versus what you actually get. A cheap product that fails you is not value; an expensive one that earns its fee can be.' },
  { name: 'Service & ease', weight: '20%', text: 'How painful the process is — buying, servicing, and the moment you need to claim or redeem.' },
  { name: 'Transparency', weight: '20%', text: 'How clearly the terms are disclosed. Products that bury caps, co-pays or spend targets in fine print lose points here.' },
];

const finderSteps = [
  'Every product carries a set of tags — e.g. health, senior, cashless, budget-low.',
  'Every answer you give in the finder rewards products sharing its tags, with a weight based on how much that answer should matter.',
  'Your first answer (your goal) is a hard filter: ask for health cover and you will never be shown a car policy.',
  'Match % = the points a product scored ÷ the maximum it could have scored, nudged slightly by its Unfiltered Score to break ties.',
  'Every reason shown on a result card is the actual answer that earned those points — nothing is decorative.',
];

export default function MethodologyPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow"><Scale size={14} /> Methodology</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">How we rate, and how we get paid</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-4 leading-relaxed">
          A recommendation you can't interrogate is just an advert. So here is the whole method —
          the scoring, the ranking, the money, and the limits of what we know.
        </p>
      </div>

      {/* scoring */}
      <section className="mt-14">
        <h2 className="heading-xl text-2xl">1. How a product gets its score</h2>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Every product is scored out of 10 on four criteria. You can see this breakdown on any product —
          open it and look for <em>"How we scored it"</em>.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {criteria.map((c) => (
            <div key={c.name} className="card-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display font-bold text-ink-900 dark:text-white">{c.name}</h3>
                <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 shrink-0">{c.weight}</span>
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* score vs decision */}
      <section className="mt-14">
        <h2 className="heading-xl text-2xl">2. Score vs Decision — why they can disagree</h2>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Every X-Ray shows two things that look similar and are not. This trips people up, so here it is plainly:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 max-w-4xl">
          <div className="card-surface p-5">
            <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 mb-3">Unfiltered Score</span>
            <h3 className="font-display font-bold text-ink-900 dark:text-white">How good the product is</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">
              The average of the four sub-scores above, out of 100. It judges the product on its own terms —
              build quality, if you like.
            </p>
          </div>
          <div className="card-surface p-5">
            <span className="chip bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 mb-3">YES / MAYBE / NO</span>
            <h3 className="font-display font-bold text-ink-900 dark:text-white">Whether you should buy it</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">
              Our call for the <em>typical</em> buyer. It accounts for who actually manages to extract the value —
              which the score cannot.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border-2 border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 p-5 max-w-3xl">
          <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
            <strong>A worked example.</strong> Amex Platinum Travel scores <strong>85 (Strong)</strong> — the perks are
            genuinely excellent and the service is the best in India. We still call it <strong>NO</strong>, because its
            value is gated behind ₹4L of annual spend that most people never hit. Great product; wrong product for
            most people. Both statements are true, and we refuse to hide either one.
          </p>
        </div>
      </section>

      {/* finder */}
      <section className="mt-14">
        <h2 className="heading-xl text-2xl">3. How the finder ranks your matches</h2>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          The match % is not a marketing number. It is arithmetic you could do by hand:
        </p>
        <ol className="mt-6 space-y-3 max-w-3xl">
          {finderSteps.map((s, i) => (
            <li key={i} className="flex gap-4 card-surface p-4">
              <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold shrink-0">{i + 1}</span>
              <span className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-2xl border-2 border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 p-5 max-w-3xl">
          <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
            <strong className="text-brand-700 dark:text-brand-300">What the finder never does:</strong> it does not
            look at who pays us. Sponsorship is a label on a card, not an input to the ranking. A sponsored product
            that fits you badly will rank below a free one that fits you well.
          </p>
        </div>
      </section>

      {/* money */}
      <section className="mt-14">
        <h2 className="heading-xl text-2xl flex items-center gap-2"><Coins size={22} className="text-brand-600" /> 4. How we make money</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 max-w-4xl">
          <div className="card-surface p-5">
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-3">What we do</h3>
            <ul className="space-y-2">
              {[
                'Earn a commission on some products when you apply through us',
                'Label every one of those with a "Sponsored" chip',
                'Keep the site free for you, with no account required',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <Check size={15} className="text-brand-500 mt-0.5 shrink-0" /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-5">
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-3">What we don't do</h3>
            <ul className="space-y-2">
              {[
                'Let commission change a score, rank or match %',
                'Hide the cons, the fine print or the exclusions',
                'Sell, share or even transmit your answers — they stay in your browser',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <AlertTriangle size={15} className="text-rose-400 mt-0.5 shrink-0" /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* freshness + limits */}
      <section className="mt-14">
        <h2 className="heading-xl text-2xl flex items-center gap-2"><RefreshCw size={20} className="text-brand-600" /> 5. Data freshness & our limits</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed card-surface p-5">
            Every product shows a <strong>"Last verified"</strong> date and the <strong>source</strong> we
            checked it against — open any product and scroll to the bottom. If a date looks old, trust the
            insurer's or issuer's own page over ours.
          </p>
          <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 p-5">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2"><AlertTriangle size={16} /> Where we fall short — honestly</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-700 dark:text-ink-200">
              <li>• This is a demo build with a <strong>sample catalogue</strong>. Prices and terms are illustrative, not live quotes.</li>
              <li>• Our scores are <strong>editorial judgement</strong>, not an audit. Reasonable people can disagree.</li>
              <li>• The eligibility checker compares you to <strong>published criteria only</strong>. The issuer still decides — it is not an approval.</li>
              <li>• We are <strong>not</strong> a registered investment adviser. Nothing here is personalised financial advice.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href="/insurance/finder" className="btn-primary text-base px-6 py-3"><Sparkles size={17} /> Try the finder</Link>
        <Link href="/glossary" className="btn-ghost text-base px-6 py-3">Read the glossary <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
