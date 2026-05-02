import { PaginatedListSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsLoading() {
  return (
    <div className="space-y-3">
      {/* Filter bar placeholder */}
      <div className="bg-white rounded-xl py-4 px-3 flex flex-wrap gap-3">
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <PaginatedListSkeleton />
    </div>
  );
}
