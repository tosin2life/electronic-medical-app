import { PaginatedListSkeleton, StatCardSkeleton } from "@/components/skeletons";

export default function BillingLoading() {
  return (
    <div className="space-y-6">
      {/* Summary stats row */}
      <div className="flex flex-wrap gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <PaginatedListSkeleton />
    </div>
  );
}
