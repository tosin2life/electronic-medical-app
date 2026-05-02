import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const StatCardSkeleton = () => (
  <Card className="w-full md:w-[330px] 2xl:w-[250px]">
    <CardHeader className="flex flex-row items-center justify-between py-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-20" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
    <CardFooter className="pb-3">
      <Skeleton className="h-4 w-32" />
    </CardFooter>
  </Card>
);

export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr className="border-b border-gray-200">
    <td className="p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </td>
    {Array.from({ length: cols - 2 }).map((_, i) => (
      <td key={i} className="hidden md:table-cell p-4">
        <Skeleton className="h-4 w-24" />
      </td>
    ))}
    <td className="p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </td>
  </tr>
);

export const TableSkeleton = ({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) => (
  <table className="w-full mt-4">
    <thead>
      <tr className="text-left">
        {Array.from({ length: cols }).map((_, i) => (
          <th key={i} className={i > 0 ? "hidden md:table-cell" : ""}>
            <Skeleton className="h-4 w-20" />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </tbody>
  </table>
);

export const PaginatedListSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="hidden lg:block h-6 w-32" />
      <div className="w-full lg:w-fit flex items-center gap-2">
        <Skeleton className="h-9 w-full lg:w-56" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
    <TableSkeleton rows={rows} />
    <div className="flex items-center justify-between mt-4">
      <Skeleton className="h-4 w-40" />
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded" />
        ))}
      </div>
    </div>
  </div>
);

export const ChartSkeleton = ({ height = 500 }: { height?: number }) => (
  <div className="bg-white rounded-xl p-4 h-full">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-16" />
    </div>
    <Skeleton className="w-full rounded-lg" style={{ height: height - 80 }} />
  </div>
);

export const SmallCardSkeleton = () => (
  <div className="w-full md:w-1/3 space-y-1">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-4 w-28" />
  </div>
);

export const ProfileCardSkeleton = () => (
  <div className="w-full flex flex-col lg:flex-row gap-4">
    <Card className="bg-white rounded-xl p-4 w-full lg:w-[30%] border-none flex flex-col items-center gap-3">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-44" />
      <div className="w-full flex justify-center gap-4 mt-2">
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-10 mx-auto" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </Card>
    <Card className="bg-white rounded-xl p-6 w-full lg:w-[70%] border-none space-y-6">
      <div className="flex flex-wrap gap-y-4">
        <SmallCardSkeleton />
        <SmallCardSkeleton />
        <SmallCardSkeleton />
      </div>
      <div className="flex flex-wrap gap-y-4">
        <SmallCardSkeleton />
        <SmallCardSkeleton />
        <SmallCardSkeleton />
      </div>
      <div className="flex flex-wrap gap-y-4">
        <SmallCardSkeleton />
        <SmallCardSkeleton />
        <SmallCardSkeleton />
      </div>
    </Card>
  </div>
);

export const FormSkeleton = ({ fields = 6 }: { fields?: number }) => (
  <div className="bg-white rounded-xl p-6 space-y-6">
    <Skeleton className="h-6 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
    <Skeleton className="h-10 w-32 rounded-md" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="py-6 px-3 flex flex-col xl:flex-row rounded-xl gap-6">
    {/* Left */}
    <div className="w-full xl:w-[69%] space-y-8">
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex flex-wrap gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
      <div className="h-[500px]">
        <ChartSkeleton height={500} />
      </div>
      <div className="bg-white rounded-xl p-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <TableSkeleton rows={5} cols={5} />
      </div>
    </div>
    {/* Right */}
    <div className="w-full xl:w-[30%] space-y-8">
      <div className="h-[450px]">
        <ChartSkeleton height={450} />
      </div>
      <div className="bg-white rounded-xl p-4 space-y-3">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
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
