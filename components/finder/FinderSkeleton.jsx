export default function FinderSkeleton() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-28 rounded bg-ink-200 dark:bg-ink-800" />
          <div className="h-3 w-24 rounded bg-ink-200 dark:bg-ink-800" />
        </div>
        <div className="h-1.5 rounded-full bg-ink-200 dark:bg-ink-800" />
        <div className="h-9 w-3/4 rounded-lg bg-ink-200 dark:bg-ink-800 mt-8" />
        <div className="grid gap-3 mt-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl border-2 border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
