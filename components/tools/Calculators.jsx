'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, ShieldCheck, Receipt, CreditCard, ArrowRight, Landmark,
  PiggyBank, Sparkles, Palmtree, Percent, BadgeCheck,
} from 'lucide-react';
import { inrCompact, inr, cx } from '@/lib/format';

const TABS = [
  { id: 'sip', label: 'SIP', icon: TrendingUp, link: '/investments' },
  { id: 'emi', label: 'EMI', icon: Landmark, link: '/loans' },
  { id: 'loan-elig', label: 'Loan Eligibility', icon: BadgeCheck, link: '/loans/finder' },
  { id: 'fd', label: 'FD', icon: PiggyBank, link: '/investments' },
  { id: 'compound', label: 'Compound', icon: Sparkles, link: '/investments/finder' },
  { id: 'retire', label: 'Retirement', icon: Palmtree, link: '/investments/finder' },
  { id: 'cover', label: 'Insurance Cover', icon: ShieldCheck, link: '/insurance' },
  { id: 'tax', label: 'Tax Saving (80C)', icon: Receipt, link: '/investments/finder' },
  { id: 'gst', label: 'GST', icon: Percent, link: '/tools' },
  { id: 'rewards', label: 'Card Rewards', icon: CreditCard, link: '/tools/spending-simulator' },
];

function Field({ label, value, onChange, min, max, step, suffix, prefix }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-ink-700 dark:text-ink-200">{label}</label>
        <span className="text-sm font-bold text-brand-600">{prefix}{Number(value).toLocaleString('en-IN')}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600 cursor-pointer" />
    </div>
  );
}

function Result({ big, caption, sub, link, linkText }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-8 text-white text-center flex flex-col justify-center">
      <p className="text-sm text-brand-50/90">{caption}</p>
      <p className="font-display font-extrabold text-4xl sm:text-5xl mt-2">{big}</p>
      {sub && <p className="text-sm text-brand-50/90 mt-2">{sub}</p>}
      <Link href={link} className="btn inline-flex self-center mt-6 bg-white text-brand-700 hover:bg-brand-50 px-5 py-2.5 text-sm font-bold">
        {linkText} <ArrowRight size={15} />
      </Link>
    </motion.div>
  );
}

export default function Calculators() {
  const [tab, setTab] = useState('sip');

  // SIP
  const [amt, setAmt] = useState(5000);
  const [yrs, setYrs] = useState(10);
  const [rate, setRate] = useState(12);
  const sip = useMemo(() => {
    const n = yrs * 12; const r = rate / 100 / 12;
    const fv = amt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = amt * n;
    return { fv, invested, gain: fv - invested };
  }, [amt, yrs, rate]);

  // Insurance cover
  const [income, setIncome] = useState(1000000);
  const [loans, setLoans] = useState(2000000);
  const [deps, setDeps] = useState(2);
  const cover = useMemo(() => {
    const base = income * (deps >= 2 ? 15 : 12);
    return base + loans;
  }, [income, loans, deps]);

  // Tax 80C
  const [invest, setInvest] = useState(150000);
  const [slab, setSlab] = useState(30);
  const taxSaved = useMemo(() => Math.min(invest, 150000) * (slab / 100), [invest, slab]);

  // Rewards
  const [spend, setSpend] = useState(40000);
  const [reward, setReward] = useState(2);
  const rewardYr = useMemo(() => spend * 12 * (reward / 100), [spend, reward]);

  // EMI — standard amortisation formula
  const [loan, setLoan] = useState(2000000);
  const [loanRate, setLoanRate] = useState(9);
  const [loanYrs, setLoanYrs] = useState(20);
  const emi = useMemo(() => {
    const n = loanYrs * 12;
    const r = loanRate / 100 / 12;
    const m = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = m * n;
    return { monthly: m, total, interest: total - loan, principalPct: (loan / total) * 100 };
  }, [loan, loanRate, loanYrs]);

  // FD — quarterly compounding, the Indian bank standard
  const [fdAmt, setFdAmt] = useState(500000);
  const [fdRate, setFdRate] = useState(7);
  const [fdYrs, setFdYrs] = useState(5);
  const fd = useMemo(() => {
    const maturity = fdAmt * Math.pow(1 + fdRate / 100 / 4, 4 * fdYrs);
    return { maturity, interest: maturity - fdAmt };
  }, [fdAmt, fdRate, fdYrs]);

  // Compound interest (lump sum, annual compounding)
  const [cAmt, setCAmt] = useState(100000);
  const [cRate, setCRate] = useState(12);
  const [cYrs, setCYrs] = useState(15);
  const comp = useMemo(() => {
    const fv = cAmt * Math.pow(1 + cRate / 100, cYrs);
    return { fv, gain: fv - cAmt, multiple: fv / cAmt };
  }, [cAmt, cRate, cYrs]);

  // Retirement corpus — inflate today's expense, then 25x rule
  const [rAge, setRAge] = useState(30);
  const [rRetire, setRRetire] = useState(60);
  const [rExpense, setRExpense] = useState(50000);
  const [rInflation, setRInflation] = useState(6);
  const retire = useMemo(() => {
    const yrs = Math.max(0, rRetire - rAge);
    const futureMonthly = rExpense * Math.pow(1 + rInflation / 100, yrs);
    const corpus = futureMonthly * 12 * 25; // 25x annual expense (4% rule)
    // SIP needed at 12% to reach it
    const r = 0.12 / 12, n = yrs * 12;
    const sipNeeded = n > 0 ? corpus / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)) : 0;
    return { yrs, futureMonthly, corpus, sipNeeded };
  }, [rAge, rRetire, rExpense, rInflation]);

  // GST — add or remove
  const [gstAmt, setGstAmt] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [gstMode, setGstMode] = useState('add');
  const gst = useMemo(() => {
    if (gstMode === 'add') {
      const tax = (gstAmt * gstRate) / 100;
      return { base: gstAmt, tax, total: gstAmt + tax };
    }
    const base = gstAmt / (1 + gstRate / 100);
    return { base, tax: gstAmt - base, total: gstAmt };
  }, [gstAmt, gstRate, gstMode]);

  // Loan eligibility — FOIR (50% of income can service EMIs)
  const [leIncome, setLeIncome] = useState(80000);
  const [leEmis, setLeEmis] = useState(5000);
  const [leRate, setLeRate] = useState(9);
  const [leYrs, setLeYrs] = useState(20);
  const loanElig = useMemo(() => {
    const capacity = Math.max(0, leIncome * 0.5 - leEmis);
    const r = leRate / 100 / 12, n = leYrs * 12;
    const amount = r === 0 ? capacity * n : (capacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    return { capacity, amount };
  }, [leIncome, leEmis, leRate, leYrs]);

  const active = TABS.find((t) => t.id === tab);

  return (
    <div>
      {/* tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((t) => {
          const on = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cx('shrink-0 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold border transition',
                on ? 'bg-brand-600 border-brand-600 text-white shadow-lift' : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400')}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
          className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="card-surface p-6 space-y-6">
            {tab === 'sip' && (<>
              <Field label="Monthly SIP" value={amt} onChange={setAmt} min={500} max={100000} step={500} prefix="₹" />
              <Field label="Time period" value={yrs} onChange={setYrs} min={1} max={40} step={1} suffix=" yrs" />
              <Field label="Expected return" value={rate} onChange={setRate} min={4} max={20} step={0.5} suffix="% p.a." />
              <p className="text-xs text-ink-400">You invest {inr(sip.invested)} over {yrs} years.</p>
            </>)}
            {tab === 'emi' && (<>
              <Field label="Loan amount" value={loan} onChange={setLoan} min={50000} max={20000000} step={50000} prefix="₹" />
              <Field label="Interest rate" value={loanRate} onChange={setLoanRate} min={5} max={20} step={0.1} suffix="% p.a." />
              <Field label="Tenure" value={loanYrs} onChange={setLoanYrs} min={1} max={30} step={1} suffix=" yrs" />
              <div className="rounded-xl bg-ink-50 dark:bg-ink-900/50 p-3 space-y-1">
                <p className="flex justify-between text-xs"><span className="text-ink-500">Principal</span><span className="font-bold text-ink-800 dark:text-ink-100">{inr(loan)}</span></p>
                <p className="flex justify-between text-xs"><span className="text-ink-500">Total interest</span><span className="font-bold text-rose-500">{inr(emi.interest)}</span></p>
                <p className="flex justify-between text-xs"><span className="text-ink-500">Total payable</span><span className="font-bold text-ink-800 dark:text-ink-100">{inr(emi.total)}</span></p>
                <div className="h-2 rounded-full overflow-hidden bg-rose-200 dark:bg-rose-500/30 mt-2 flex">
                  <div className="h-full bg-brand-600" style={{ width: `${emi.principalPct}%` }} />
                </div>
                <p className="text-[10px] text-ink-400 pt-0.5">
                  <span className="text-brand-600 font-bold">■</span> principal {emi.principalPct.toFixed(0)}% ·
                  <span className="text-rose-400 font-bold"> ■</span> interest {(100 - emi.principalPct).toFixed(0)}%
                </p>
              </div>
            </>)}
            {tab === 'cover' && (<>
              <Field label="Annual income" value={income} onChange={setIncome} min={200000} max={10000000} step={100000} prefix="₹" />
              <Field label="Outstanding loans" value={loans} onChange={setLoans} min={0} max={20000000} step={100000} prefix="₹" />
              <Field label="Dependents" value={deps} onChange={setDeps} min={0} max={6} step={1} />
              <p className="text-xs text-ink-400">Rule of thumb: 12–15× income + liabilities.</p>
            </>)}
            {tab === 'tax' && (<>
              <Field label="80C investment" value={invest} onChange={setInvest} min={0} max={150000} step={5000} prefix="₹" />
              <Field label="Your tax slab" value={slab} onChange={setSlab} min={5} max={30} step={5} suffix="%" />
              <p className="text-xs text-ink-400">80C deduction is capped at ₹1.5L per year.</p>
            </>)}
            {tab === 'rewards' && (<>
              <Field label="Monthly card spend" value={spend} onChange={setSpend} min={2000} max={300000} step={1000} prefix="₹" />
              <Field label="Reward / cashback rate" value={reward} onChange={setReward} min={0.5} max={7.25} step={0.25} suffix="%" />
              <p className="text-xs text-ink-400">A good everyday card returns 1.5–5%. For a real per-card number, use the Spending Simulator.</p>
            </>)}
            {tab === 'fd' && (<>
              <Field label="Deposit amount" value={fdAmt} onChange={setFdAmt} min={10000} max={10000000} step={10000} prefix="₹" />
              <Field label="Interest rate" value={fdRate} onChange={setFdRate} min={3} max={9} step={0.1} suffix="% p.a." />
              <Field label="Tenure" value={fdYrs} onChange={setFdYrs} min={1} max={10} step={1} suffix=" yrs" />
              <p className="text-xs text-ink-400">Compounded quarterly, the Indian bank standard. Interest is taxed at your slab.</p>
            </>)}
            {tab === 'compound' && (<>
              <Field label="One-time investment" value={cAmt} onChange={setCAmt} min={5000} max={10000000} step={5000} prefix="₹" />
              <Field label="Expected return" value={cRate} onChange={setCRate} min={1} max={25} step={0.5} suffix="% p.a." />
              <Field label="Time" value={cYrs} onChange={setCYrs} min={1} max={40} step={1} suffix=" yrs" />
              <p className="text-xs text-ink-400">Your money multiplies <strong>{comp.multiple.toFixed(1)}×</strong> over {cYrs} years. This is why time beats timing.</p>
            </>)}
            {tab === 'retire' && (<>
              <Field label="Your age now" value={rAge} onChange={setRAge} min={18} max={59} step={1} suffix=" yrs" />
              <Field label="Retire at" value={rRetire} onChange={setRRetire} min={rAge + 1} max={70} step={1} suffix=" yrs" />
              <Field label="Monthly expense today" value={rExpense} onChange={setRExpense} min={10000} max={500000} step={5000} prefix="₹" />
              <Field label="Inflation" value={rInflation} onChange={setRInflation} min={3} max={10} step={0.5} suffix="%" />
              <div className="rounded-xl bg-ink-50 dark:bg-ink-900/50 p-3 space-y-1">
                <p className="flex justify-between text-xs"><span className="text-ink-500">Monthly expense at {rRetire}</span><span className="font-bold text-ink-800 dark:text-ink-100">{inrCompact(retire.futureMonthly)}</span></p>
                <p className="flex justify-between text-xs"><span className="text-ink-500">SIP needed (at 12%)</span><span className="font-bold text-brand-600">{inr(retire.sipNeeded)}/mo</span></p>
                <p className="text-[10px] text-ink-400 pt-0.5">Uses the 25× rule — a corpus 25× your annual expense, drawn down at ~4%/year.</p>
              </div>
            </>)}
            {tab === 'gst' && (<>
              <div className="flex gap-2">
                {[['add', 'Add GST'], ['remove', 'Remove GST']].map(([id, label]) => (
                  <button key={id} onClick={() => setGstMode(id)}
                    className={cx('flex-1 rounded-xl px-4 py-2 text-sm font-semibold border transition',
                      gstMode === id ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300')}>
                    {label}
                  </button>
                ))}
              </div>
              <Field label={gstMode === 'add' ? 'Amount (before GST)' : 'Amount (including GST)'} value={gstAmt} onChange={setGstAmt} min={100} max={1000000} step={100} prefix="₹" />
              <div>
                <label className="text-sm font-semibold text-ink-700 dark:text-ink-200">GST slab</label>
                <div className="flex gap-2 mt-1.5">
                  {[5, 12, 18, 28].map((r) => (
                    <button key={r} onClick={() => setGstRate(r)}
                      className={cx('flex-1 rounded-lg py-2 text-sm font-bold border transition',
                        gstRate === r ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300')}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-ink-50 dark:bg-ink-900/50 p-3 space-y-1">
                <p className="flex justify-between text-xs"><span className="text-ink-500">Base amount</span><span className="font-bold text-ink-800 dark:text-ink-100">{inr(gst.base)}</span></p>
                <p className="flex justify-between text-xs"><span className="text-ink-500">GST @ {gstRate}%</span><span className="font-bold text-ink-800 dark:text-ink-100">{inr(gst.tax)}</span></p>
                <p className="text-[10px] text-ink-400 pt-0.5">CGST {inr(gst.tax / 2)} + SGST {inr(gst.tax / 2)} for intra-state supply.</p>
              </div>
            </>)}
            {tab === 'loan-elig' && (<>
              <Field label="Monthly take-home" value={leIncome} onChange={setLeIncome} min={15000} max={1000000} step={5000} prefix="₹" />
              <Field label="Existing EMIs" value={leEmis} onChange={setLeEmis} min={0} max={200000} step={1000} prefix="₹" />
              <Field label="Interest rate" value={leRate} onChange={setLeRate} min={5} max={20} step={0.1} suffix="% p.a." />
              <Field label="Tenure" value={leYrs} onChange={setLeYrs} min={1} max={30} step={1} suffix=" yrs" />
              <p className="text-xs text-ink-400">
                Uses the FOIR rule: lenders cap all your EMIs at ~50% of take-home. Your spare capacity is <strong>{inr(loanElig.capacity)}/month</strong>.
              </p>
            </>)}
          </div>

          {tab === 'sip' && <Result caption="Your corpus after " big={inrCompact(sip.fv)} sub={`Est. gain of ${inrCompact(sip.gain)}`} link={active.link} linkText="See index & ELSS funds" />}
          {tab === 'emi' && <Result caption="Your monthly EMI" big={inr(emi.monthly)} sub={`You'll pay ${inrCompact(emi.interest)} in interest over ${loanYrs} years`} link={active.link} linkText="See cards & products" />}
          {tab === 'cover' && <Result caption="Recommended life cover" big={inrCompact(cover)} sub="Aim for a term plan around this cover" link={active.link} linkText="See term plans" />}
          {tab === 'tax' && <Result caption="Tax you could save" big={inr(taxSaved)} sub="via 80C investments this year" link={active.link} linkText="See tax-saving options" />}
          {tab === 'rewards' && <Result caption="Rewards you could earn / year" big={inr(rewardYr)} sub="Match a card to your spend" link={active.link} linkText="Find your best card" />}
          {tab === 'fd' && <Result caption="Maturity value" big={inrCompact(fd.maturity)} sub={`${inrCompact(fd.interest)} of interest — taxed at your slab`} link={active.link} linkText="See better-taxed options" />}
          {tab === 'compound' && <Result caption={`Your money after ${cYrs} years`} big={inrCompact(comp.fv)} sub={`${comp.multiple.toFixed(1)}× your money · ${inrCompact(comp.gain)} gained`} link={active.link} linkText="Find where to invest it" />}
          {tab === 'retire' && <Result caption="Corpus you'll need" big={inrCompact(retire.corpus)} sub={`Start a ${inr(retire.sipNeeded)}/mo SIP for ${retire.yrs} years`} link={active.link} linkText="See retirement options" />}
          {tab === 'gst' && <Result caption={gstMode === 'add' ? 'Total payable' : 'Base (pre-GST) amount'} big={inr(gstMode === 'add' ? gst.total : gst.base)} sub={`GST @ ${gstRate}% = ${inr(gst.tax)}`} link={active.link} linkText="Back to tools" />}
          {tab === 'loan-elig' && <Result caption="You could borrow about" big={inrCompact(loanElig.amount)} sub={`At ${leRate}% over ${leYrs} years · EMI capacity ${inr(loanElig.capacity)}/mo`} link={active.link} linkText="Find your loan" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
