// File:
// components/products/ProductList.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Gem,
  Scale,
  Package,
  PackageCheck,
  Clock3,
  CircleX,
} from "lucide-react";

import { Product } from "@/types/product";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

interface ProductListProps {
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

export function ProductList({
  products,
}: ProductListProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full">
        <thead className="bg-muted/40">
          <tr className="border-b">
            <th className="w-[90px] px-6 py-4 text-left text-sm font-semibold">
              Image
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Product
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Material
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Details
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Price
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="w-[140px] px-6 py-4"></th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b transition-colors hover:bg-muted/30"
            >
              {/* Image */}
              <td className="px-6 py-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={
                      product.imageUrl ||
                      "https://placehold.co/300x300?text=Jewelry"
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>

              {/* Product */}
              <td className="px-6 py-4 align-top">
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    SKU : {product.sku}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Code : {product.productCode}
                  </p>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 align-top">
                <div className="space-y-2">
                  <Badge variant="secondary">
                    {product.category}
                  </Badge>

                  <Badge variant="outline">
                    {product.productType}
                  </Badge>
                </div>
              </td>

              {/* Material */}
              <td className="px-6 py-4 align-top">
                <span className="font-medium">
                  {product.material}
                </span>
              </td>

              {/* Detail */}
              <td className="px-6 py-4 align-top">
                <div className="space-y-2 text-sm">
                  {product.weight && (
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {product.weight} g
                      </span>
                    </div>
                  )}

                  {product.gemstone && (
                    <div className="flex items-center gap-2">
                      <Gem className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {product.gemstone}
                      </span>
                    </div>
                  )}
                </div>
              </td>

              {/* Price */}
              <td className="px-6 py-4 text-right align-top">
                <div className="font-bold text-lg">
                  ฿
                  {Number(product.price).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-center align-top">
                <Badge
                  variant={getStatusVariant(product.status)}
                  className="gap-1"
                >
                  {getStatusIcon(product.status)}
                  {product.status}
                </Badge>
              </td>

              {/* Action */}
              <td className="px-6 py-4 text-right align-top">
                <Button
                  size="sm"
                >
                  <Link
                    href={`/dashboard/products/${product.id}`}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}