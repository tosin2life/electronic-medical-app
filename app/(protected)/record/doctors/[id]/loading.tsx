import { ProfileCardSkeleton, TableSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorProfileLoading() {
  return (
    <div className="py-6 px-3 2xl:p-6 space-y-6">
      <ProfileCardSkeleton />

      {/* Appointments table */}
      <div className="bg-white rounded-xl p-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <TableSkeleton rows={5} cols={5} />
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Ratings block */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
