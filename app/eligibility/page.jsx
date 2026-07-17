import EligibilityWizard from '@/components/tools/EligibilityWizard';

export const metadata = {
  title: 'Eligibility Wizard — your approval odds before you apply',
  description: 'Three questions, no credit bureau, no data leaves your browser. See which cards, loans and plans you are actually likely to be approved for.',
  alternates: { canonical: 'https://unfilteredmoney.example/eligibility' },
};

export default function EligibilityPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Eligibility Wizard</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Know your odds before you apply</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          Every rejected application dents your credit score. Three questions here — no bureau check,
          nothing sent anywhere — and you'll know where you actually stand.
        </p>
      </div>
      <div className="mt-10">
        <EligibilityWizard />
      </div>
    </div>
  );
}
