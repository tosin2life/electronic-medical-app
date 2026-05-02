import { FormSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClinicalNotesLoading() {
  return (
    <div className="space-y-6 py-6 px-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-40" />
        <div className="h-6 w-px bg-gray-300" />
        <Skeleton className="h-7 w-48" />
      </div>
      <FormSkeleton fields={8} />
    </div>
  );
}
