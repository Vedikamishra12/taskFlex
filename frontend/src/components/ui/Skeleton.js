const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />
);

export const SkeletonCard = () => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
    <Skeleton className="mb-4 h-4 w-1/3" />
    <Skeleton className="mb-2 h-8 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="mt-2 h-3 w-5/6" />
  </div>
);

export default Skeleton;
