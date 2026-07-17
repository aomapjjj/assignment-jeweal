"use client";

import Link from "next/link";
import { PackageSearch, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
      <CardContent className="flex min-h-[520px] flex-col items-center justify-center px-8 py-16 text-center">

        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <PackageSearch className="h-10 w-10 text-muted-foreground" />
        </div>

        <h2 className="text-3xl font-semibold tracking-tight">
          {hasFilter
            ? "No products found"
            : "No products available"}
        </h2>

        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          {hasFilter
            ? "No products match your current search or filters. Try adjusting your search criteria or clear all filters."
            : "There are currently no products in your catalog. Add your first product to start managing inventory, pricing, and sales."}
        </p>

        <div className="mt-10 flex justify-center">
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
              <Link href="/dashboard/products/new" className="flex">
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