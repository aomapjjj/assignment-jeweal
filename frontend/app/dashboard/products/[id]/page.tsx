// File: app/dashboard/products/[id]/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  BadgeDollarSign,
  Gem,
  Package,
  PackageSearch,
  Scale,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useProduct,
  useSimilarProducts,
} from "@/hooks/useProduct";

import {
  InventoryStatus,
  Product,
} from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(id);

  const {
    data: similar = [],
    isLoading: isLoadingSimilar,
  } = useSimilarProducts(id);

  const isUnavailable = useMemo(() => {
    if (!product) return true;

    return (
      product.status === InventoryStatus.SOLD ||
      product.stock <= 0
    );
  }, [product]);

  if (isLoading) {
    return (
      <>
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
                <BreadcrumbLink href="/dashboard/products">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Loading...</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-6">
          <Skeleton className="h-10 w-44" />

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="aspect-square w-full rounded-xl" />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <Skeleton className="h-px w-full" />

              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Skeleton className="h-11 flex-1" />
                <Skeleton className="h-11 flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-52" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />

                    <Skeleton className="mt-4 h-5 w-3/4" />

                    <Skeleton className="mt-2 h-4 w-1/2" />

                    <Skeleton className="mt-4 h-6 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
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
                <BreadcrumbLink href="/dashboard/products">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Error</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 p-6 text-center">
          <PackageSearch className="h-14 w-14 text-muted-foreground" />

          <div>
            <h2 className="text-2xl font-bold">
              Product not found
            </h2>

            <p className="mt-2 text-muted-foreground">
              The requested product does not exist or
              cannot be loaded.
            </p>
          </div>

          <Button >
            <Link href="/dashboard/products">
              Back to Product Catalog
            </Link>
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
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
              <BreadcrumbLink href="/dashboard/products">
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
                <Image
                  src={
                    product.imageUrl ??
                    "https://placehold.co/800x800/png"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <Badge
                variant={
                  product.status === InventoryStatus.AVAILABLE
                    ? "default"
                    : "secondary"
                }
              >
                {product.status}
              </Badge>

              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                {product.name}
              </h1>

              <p className="mt-3 leading-7 text-muted-foreground">
                {product.description ||
                  "No description available."}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Package className="h-4 w-4" />}
                label="SKU"
                value={product.sku}
              />

              <InfoCard
                label="Product Code"
                value={product.productCode}
              />

              <InfoCard
                label="Category"
                value={product.category}
              />

              <InfoCard
                label="Product Type"
                value={product.productType}
              />

              <InfoCard
                icon={<Gem className="h-4 w-4" />}
                label="Material"
                value={product.material}
              />

              <InfoCard
                label="Gemstone"
                value={product.gemstone ?? "-"}
              />

              <InfoCard
                icon={<Scale className="h-4 w-4" />}
                label="Weight"
                value={
                  product.weight
                    ? `${product.weight} g`
                    : "-"
                }
              />

              <InfoCard
                label="Size / Variation"
                value={product.size ?? "-"}
              />

              <InfoCard
                icon={
                  <BadgeDollarSign className="h-4 w-4" />
                }
                label="Selling Price"
                value={`฿${Number(product.price).toLocaleString()}`}
              />

              <InfoCard
                label="Stock Status"
                value={
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        product.status ===
                          InventoryStatus.AVAILABLE
                          ? "default"
                          : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>

                    <span className="text-sm text-muted-foreground">
                      {product.stock} item(s)
                    </span>
                  </div>
                }
              />
            </div>

            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Product Selection
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Preview this product and continue
                    creating an order when the customer
                    decides to purchase.
                  </p>
                </div>

                {isUnavailable && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">
                      This product cannot be selected
                      because it has already been sold or
                      is currently out of stock.
                    </p>
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  <Button
                    disabled={isUnavailable}
                    className="h-11"
                  >
                    <Link
                      href={`/dashboard/orders/new?productId=${product.id}`}
                      className="flex"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Create Order
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    disabled={isUnavailable}
                    className="h-11"

                  >
                    <Link
                      href={`/dashboard/orders/new?productId=${product.id}&consignment=true`}
                      className="flex"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Create Consignment
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Stock will not be deducted until the
                  order has been fully paid and converted
                  into a completed sale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Similar Products
              </h2>

              <p className="text-sm text-muted-foreground">
                Recommend products from the same category or
                similar price range.
              </p>
            </div>
          </div>

          {isLoadingSimilar ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="mt-4 h-5 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                    <Skeleton className="mt-4 h-6 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : similar.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {similar.map((item: Product) => (
                <Link
                  key={item.id}
                  href={`/dashboard/products/${item.id}`}
                >
                  <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={
                            item.imageUrl ??
                            "https://placehold.co/600x600/png"
                          }
                          alt={item.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <Badge
                        variant="outline"
                        className="mb-3"
                      >
                        {item.category}
                      </Badge>

                      <h3 className="line-clamp-1 font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {item.material}
                        {item.gemstone
                          ? ` • ${item.gemstone}`
                          : ""}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-bold">
                          ฿
                          {Number(
                            item.price
                          ).toLocaleString()}
                        </span>

                        <Badge
                          variant={
                            item.status ===
                              InventoryStatus.AVAILABLE
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <PackageSearch className="mb-5 h-14 w-14 text-muted-foreground" />

                <h3 className="text-xl font-semibold">
                  No Similar Products Found
                </h3>

                <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                  We couldn&apos;t find products from the same
                  category or similar price range. Browse
                  the product catalog to discover more
                  jewelry for your customer.
                </p>

                <Button
                  variant="outline"
                  className="mt-6"
                >
                  <Link href="/dashboard/products">
                    Browse Product Catalog
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>

        <div className="font-semibold break-words">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}