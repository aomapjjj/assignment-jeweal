// File:
// app/dashboard/products/page.tsx

"use client";

import { useState } from "react";
import {
  LayoutGrid,
  List,
  PackageSearch,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductList } from "@/components/products/ProductList";
import { ProductLoading } from "@/components/products/ProductLoading";
import { ProductEmpty } from "@/components/products/ProductEmpty";

import { useProducts } from "@/hooks/useProducts";

type ViewMode = "grid" | "list";

export default function ProductsPage() {
  const [view, setView] =
    useState<ViewMode>("grid");

  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    search,
    page: 1,
    limit: 20,
  });

  const products = data?.data ?? [];

  return (
    <SidebarInset>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                Products
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Title */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-background shadow-sm">
              <PackageSearch className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Product Catalog
              </h1>

              <p className="text-muted-foreground">
                Browse jewelry products,
                inventory status and pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant={
                view === "grid"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setView("grid")
              }
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant={
                view === "list"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setView("list")
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Search */}
        <section className="rounded-xl border bg-card p-4 shadow-sm">
          <Input
            placeholder="Search by SKU, Product Code or Product Name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </section>

        {/* Loading */}
        {isLoading && <ProductLoading />}

        {/* Error */}
        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
            <h2 className="text-lg font-semibold">
              Failed to load products
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while
              loading the product catalog.
            </p>

            <Button
              className="mt-6"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          products.length === 0 && (
            <ProductEmpty />
          )}

        {/* Data */}
        {!isLoading &&
          !isError &&
          products.length > 0 &&
          (view === "grid" ? (
            <ProductGrid
              products={products}
            />
          ) : (
            <ProductList
              products={products}
            />
          ))}
      </div>
    </SidebarInset>
  );
}