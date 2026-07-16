"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Gem,
  Scale,
  BadgeDollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";

import { useProduct, useSimilarProducts } from "@/hooks/useProduct";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: similar = [] } = useSimilarProducts(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Back Button */}
        <Skeleton className="h-10 w-44 rounded-lg" />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="rounded-xl border p-6">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4"
                >
                  <Skeleton className="mb-3 h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-52" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border p-4"
              >
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="mt-4 h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
                <Skeleton className="mt-4 h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return <div className="p-6">Failed to load product.</div>;
  }

  return (
    <> <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
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
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <Button variant="outline">
          <Link href="/dashboard/products" className="flex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="relative aspect-square overflow-hidden rounded-xl border">
                <Image
                  src={product.imageUrl || "https://placehold.co/800x800/png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <Badge>{product.status}</Badge>
              <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={<Package className="h-4 w-4" />} label="SKU" value={product.sku} />
              <Info label="Product Code" value={product.productCode} />
              <Info label="Category" value={product.category} />
              <Info label="Type" value={product.productType} />
              <Info icon={<Gem className="h-4 w-4" />} label="Material" value={product.material} />
              <Info label="Gemstone" value={product.gemstone ?? "-"} />
              <Info icon={<Scale className="h-4 w-4" />} label="Weight" value={product.weight ? `${product.weight} g` : "-"} />
              <Info label="Size" value={product.size ?? "-"} />
              <Info icon={<BadgeDollarSign className="h-4 w-4" />} label="Price" value={`฿${Number(product.price).toLocaleString()}`} />
              <Info label="Stock" value={`${product.stock}`} />
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Similar Products</h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {similar.map((item) => (
              <Link key={item.id} href={`/dashboard/products/${item.id}`}>
                <Card className="transition hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={item.imageUrl || "https://placehold.co/600x600/png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="mt-2 font-bold">
                      ฿{Number(item.price).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
