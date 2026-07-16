// File:
// components/products/ProductLoading.tsx

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductLoadingProps {
  view?: "grid" | "list";
}

export function ProductLoading({
  view = "grid",
}: ProductLoadingProps) {
  if (view === "list") {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-56" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <Skeleton className="h-16 w-16 rounded-lg" />

              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>

              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden"
        >
          <Skeleton className="aspect-square w-full" />

          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 rounded-md" />
              <Skeleton className="h-12 rounded-md" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>

            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}