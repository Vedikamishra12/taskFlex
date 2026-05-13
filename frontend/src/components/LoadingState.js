import { SkeletonCard } from "./ui/Skeleton";

const LoadingState = ({ label = "Loading...", skeleton = false }) => {
  if (skeleton) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-16 backdrop-blur-xl">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-400 border-r-cyan-400" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-300">{label}</p>
    </div>
  );
};

export default LoadingState;
