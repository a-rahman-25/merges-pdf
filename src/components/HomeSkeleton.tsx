import { Skeleton } from '@/components/ui/skeleton';

const HomeSkeleton = () => (
  <div className="min-h-screen bg-background animate-in fade-in duration-300">
    {/* Header */}
    <div className="h-14 border-b border-border/40 bg-card" />

    {/* Hero skeleton */}
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center space-y-6">
        <Skeleton className="mx-auto h-8 w-48 rounded-full" />
        <Skeleton className="mx-auto h-14 w-[28rem] max-w-full rounded-xl" />
        <Skeleton className="mx-auto h-14 w-[22rem] max-w-full rounded-xl" />
        <Skeleton className="mx-auto h-6 w-[32rem] max-w-full rounded-lg" />
        <div className="flex justify-center gap-3 pt-4">
          <Skeleton className="h-14 w-44 rounded-2xl" />
          <Skeleton className="h-14 w-44 rounded-2xl" />
        </div>
      </div>
    </section>

    {/* Stats skeleton */}
    <section className="py-14 bg-accent/30">
      <div className="mx-auto max-w-5xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="mx-auto h-6 w-6 rounded" />
            <Skeleton className="mx-auto h-10 w-24 rounded-lg" />
            <Skeleton className="mx-auto h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    </section>

    {/* Tools grid skeleton */}
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center space-y-3 mb-8">
          <Skeleton className="mx-auto h-10 w-64 rounded-xl" />
          <Skeleton className="mx-auto h-5 w-80 rounded-lg" />
        </div>
        <Skeleton className="mx-auto h-12 w-80 rounded-xl mb-4" />
        <Skeleton className="mx-auto h-10 w-96 rounded-xl mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default HomeSkeleton;
