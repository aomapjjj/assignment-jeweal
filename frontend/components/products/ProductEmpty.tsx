"use client";

import Link from "next/link";
import { PackageSearch, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface ProductEmptyProps {
  hasFilter?: boolean;
  onReset?: () => void;
}

export function ProductEmpty({
  hasFilter = false,
  onReset,
}: ProductEmptyProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <PackageSearch className="h-8 w-8 text-muted-foreground" />
        </div>

        <CardHeader className="space-y-2 p-0">
          <CardTitle className="text-2xl">
            {hasFilter
              ? "No products found"
              : "No products available"}
          </CardTitle>

          <CardDescription className="max-w-md">
            {hasFilter
              ? "No products match your current search or filters. Try adjusting the filters to find what you're looking for."
              : "There are currently no products in the catalog. Create your first product to begin managing inventory and sales."}
          </CardDescription>
        </CardHeader>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {hasFilter ? (
            <Button
              variant="outline"
              onClick={onReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          ) : (
            <Button >
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}