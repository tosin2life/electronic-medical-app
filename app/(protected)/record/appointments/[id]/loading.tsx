import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons";

export default function AppointmentDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-48" />
          <div className="h-6 w-px bg-gray-300" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Patient + Doctor info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Appointment info */}
      <div className="bg-white rounded-xl p-6 border">
        <Skeleton className="h-5 w-44 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Medical records table */}
      <div className="bg-white rounded-xl p-4 border">
        <Skeleton className="h-5 w-36 mb-4" />
        <TableSkeleton rows={3} cols={4} />
      </div>
    </div>
  );
}
