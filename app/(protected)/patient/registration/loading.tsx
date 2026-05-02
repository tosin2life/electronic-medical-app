import { FormSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationLoading() {
  return (
    <div className="py-6 px-3 2xl:px-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-48" />
      </div>
      <FormSkeleton fields={10} />
    </div>
  );
}
