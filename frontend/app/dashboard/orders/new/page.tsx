"use client";

import { Suspense } from "react";
import NewOrderContent from "./NewOrderContent";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewOrderPage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-7xl space-y-6 p-6">
            <Skeleton className="h-10 w-44" />

            <div className="grid gap-6 lg:grid-cols-3">
                <Skeleton className="h-[520px]" />
                <Skeleton className="h-[520px]" />
                <Skeleton className="h-[520px]" />
            </div>
        </div>}>
            <NewOrderContent />
        </Suspense>
    );
}