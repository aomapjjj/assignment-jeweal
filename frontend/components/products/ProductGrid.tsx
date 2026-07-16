"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Gem,
  Scale,
  Package,
  PackageCheck,
  CircleX,
  Clock3,
} from "lucide-react";

import { Product } from "@/types/product";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

interface ProductGridProps {
  products: Product[];
}

function getStatusVariant(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "default";

    case "RESERVED":
      return "secondary";

    case "CONSIGNED":
      return "outline";

    case "SOLD":
      return "destructive";

    default:
      return "secondary";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "AVAILABLE":
      return <PackageCheck className="h-3.5 w-3.5" />;

    case "RESERVED":
      return <Clock3 className="h-3.5 w-3.5" />;

    case "CONSIGNED":
      return <Package className="h-3.5 w-3.5" />;

    case "SOLD":
      return <CircleX className="h-3.5 w-3.5" />;

    default:
      return <Package className="h-3.5 w-3.5" />;
  }
}

export function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={
                product.imageUrl ||
                "https://placehold.co/600x600?text=Jewelry"
              }
              alt={product.name}
              fill
              className="object-cover transition duration-300 hover:scale-105"
            />
          </div>

          <CardContent className="space-y-4 p-5">
            {/* SKU */}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {product.sku}
              </p>

              <h3 className="mt-1 line-clamp-2 text-lg font-semibold">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {product.productCode}
              </p>
            </div>

            {/* Category */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {product.category}
              </Badge>

              <Badge variant="outline">
                {product.productType}
              </Badge>
            </div>

            {/* Information */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Material
                </span>

                <span className="font-medium">
                  {product.material}
                </span>
              </div>

              {product.weight && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    Weight
                  </span>

                  <span>{product.weight} g</span>
                </div>
              )}

              {product.gemstone && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Gem className="h-4 w-4" />
                    Stone
                  </span>

                  <span>{product.gemstone}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs uppercase text-muted-foreground">
                Selling Price
              </p>

              <p className="mt-1 text-2xl font-bold">
                ฿
                {Number(product.price).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Stock Status
              </span>

              <Badge
                variant={getStatusVariant(product.status)}
                className="gap-1"
              >
                {getStatusIcon(product.status)}
                {product.status}
              </Badge>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
            >
              <Link
                href={`/dashboard/products/${product.id}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Product
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}