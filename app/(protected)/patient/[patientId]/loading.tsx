import { ProfileCardSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientProfileLoading() {
  return (
    <div className="bg-gray-100/60 h-full rounded-xl py-6 px-3 2xl:p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full xl:w-3/4">
        <ProfileCardSkeleton />
        <div className="mt-10 bg-white rounded-xl p-4 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-1/3">
        <div className="bg-white p-4 rounded-md mb-8">
          <Skeleton className="h-6 w-28 mb-4" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-36 rounded-md" />
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-md space-y-3">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
