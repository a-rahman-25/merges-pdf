import { Skeleton } from '@/components/ui/skeleton';

const ToolPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header skeleton */}
    <div className="h-14 border-b border-border/40 bg-card" />
    
    <div className="flex w-full">
      {/* Sidebar skeleton - hidden on mobile */}
      <div className="hidden md:block w-[250px] border-r border-border/40 bg-card/50 p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-lg" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 mx-auto max-w-4xl px-6 py-12 w-full">
        {/* Title */}
        <div className="mb-6 text-center space-y-3">
          <Skeleton className="mx-auto h-9 w-72 rounded-xl" />
          <Skeleton className="mx-auto h-5 w-96 rounded-lg" />
        </div>

        {/* Drop zone skeleton */}
        <div className="rounded-2xl border-2 border-dashed border-border p-12">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
        </div>

        {/* FAQ skeleton */}
        <div className="mt-12 space-y-3">
          <Skeleton className="mx-auto h-8 w-64 rounded-xl mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ToolPageSkeleton;
