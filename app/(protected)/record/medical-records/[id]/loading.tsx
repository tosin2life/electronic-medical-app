import { Skeleton } from "@/components/ui/skeleton";

export default function MedicalRecordDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-48" />
          <div className="h-6 w-px bg-gray-300" />
          <Skeleton className="h-7 w-44" />
        </div>
      </div>

      {/* Patient + Doctor info */}
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
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis */}
      <div className="bg-white rounded-xl p-6 border">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Vital signs */}
      <div className="bg-white rounded-xl p-6 border">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Metadata footer */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
