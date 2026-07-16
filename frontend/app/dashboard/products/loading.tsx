import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProductsPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-2">
        <Skeleton className="h-10 w-72" />

        <Skeleton className="h-5 w-[420px]" />
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <Skeleton className="aspect-square w-full rounded-none" />

            <div className="space-y-4 p-5">
              <Skeleton className="h-5 w-32" />

              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-20" />

              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-6 w-24" />

              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}