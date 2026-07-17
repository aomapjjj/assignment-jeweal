"use client";

import Link from "next/link";
import Image from "next/image";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import {
    AlertTriangle,
    Boxes,
    CheckCircle2,
    Eye,
    Package,
    Pencil,
    Search,
    XCircle,
} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

import { useInventory, useAdjustStock } from "@/hooks/useInventory";

import {
    InventoryItem,
    InventoryStatus,
} from "@/types/inventory";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

import { Badge } from "@/components/ui/Badge";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Skeleton } from "@/components/ui/skeleton";

import { Textarea } from "@/components/ui/textarea";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@base-ui/react";

export default function InventoryPage() {

    const { data, isLoading, error } = useInventory();

    const adjustStock = useAdjustStock();

    const products = data?.data ?? [];

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("ALL");

    const [open, setOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<InventoryItem | null>(null);

    const [quantityChange, setQuantityChange] =
        useState(0);

    const [reason, setReason] = useState("");

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const keyword = search.trim().toLowerCase();

            const matchesSearch =
                keyword === "" ||
                product.name.toLowerCase().includes(keyword) ||
                product.sku.toLowerCase().includes(keyword) ||
                product.productCode.toLowerCase().includes(keyword);

            const matchesStatus =
                status === "ALL" ||
                product.status === status;

            return matchesSearch && matchesStatus;

        });

    }, [products, search, status]);

    const totalProducts = filteredProducts.length;

    const availableProducts = filteredProducts.filter(
        (p) => p.status === InventoryStatus.AVAILABLE
    ).length;

    const soldProducts = filteredProducts.filter(
        (p) => p.status === InventoryStatus.SOLD
    ).length;

    const lowStockProducts = filteredProducts.filter(
        (p) =>
            p.status === InventoryStatus.AVAILABLE &&
            p.stock <= 3
    ).length;

    if (isLoading) {

        return (

            <div className="space-y-6">

                <Skeleton className="h-10 w-72" />

                <Skeleton className="h-40 w-full" />

                <Skeleton className="h-[500px] w-full" />

            </div>

        );

    }

    if (error) {

        return (

            <div className="rounded-lg border border-destructive p-6">

                <h2 className="font-semibold text-destructive">
                    Failed to load inventory
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {(error as Error).message}
                </p>

            </div>

        );

    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Build Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Sales</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>



            <div className="flex flex-1 flex-col gap-6 p-6">

                <div className="flex flex-col gap-2">

                    <h1 className="text-3xl font-bold tracking-tight">
                        Inventory
                    </h1>

                    <p className="text-muted-foreground">
                        Monitor stock levels and inventory status.
                    </p>

                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <Card>

                        <CardHeader className="flex flex-row items-center justify-between pb-2">

                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>

                            <Boxes className="h-4 w-4 text-muted-foreground" />

                        </CardHeader>

                        <CardContent>

                            <div className="text-2xl font-bold">
                                {totalProducts}
                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader className="flex flex-row items-center justify-between pb-2">

                            <CardTitle className="text-sm font-medium">
                                Available
                            </CardTitle>

                            <CheckCircle2 className="h-4 w-4 text-green-600" />

                        </CardHeader>

                        <CardContent>

                            <div className="text-2xl font-bold">
                                {availableProducts}
                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader className="flex flex-row items-center justify-between pb-2">

                            <CardTitle className="text-sm font-medium">
                                Low Stock
                            </CardTitle>

                            <AlertTriangle className="h-4 w-4 text-yellow-600" />

                        </CardHeader>

                        <CardContent>

                            <div className="text-2xl font-bold">
                                {lowStockProducts}
                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader className="flex flex-row items-center justify-between pb-2">

                            <CardTitle className="text-sm font-medium">
                                Sold
                            </CardTitle>

                            <XCircle className="h-4 w-4 text-destructive" />

                        </CardHeader>

                        <CardContent>

                            <div className="text-2xl font-bold">
                                {soldProducts}
                            </div>

                        </CardContent>

                    </Card>

                </div>
                <Card>

                    <CardHeader>

                        <CardTitle>
                            Inventory List
                        </CardTitle>

                        <CardDescription>
                            Search products, check stock and inventory status.
                        </CardDescription>

                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            <div className="relative w-full lg:max-w-sm">

                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    className="pl-10"
                                    placeholder="Search SKU, Code or Product..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

                            <div className="w-full lg:w-56">

                                <Select
                                    value={status}
                                    onValueChange={(value) =>
                                        setStatus(
                                            value as InventoryStatus | "ALL"
                                        )
                                    }
                                >

                                    <SelectTrigger>

                                        <SelectValue placeholder="Status" />

                                    </SelectTrigger>

                                    <SelectContent>

                                        <SelectItem value="ALL">
                                            All Status
                                        </SelectItem>

                                        <SelectItem
                                            value={InventoryStatus.AVAILABLE}
                                        >
                                            Available
                                        </SelectItem>

                                        <SelectItem
                                            value={InventoryStatus.CONSIGNED}
                                        >
                                            Consigned
                                        </SelectItem>

                                        <SelectItem
                                            value={InventoryStatus.SOLD}
                                        >
                                            Sold
                                        </SelectItem>

                                    </SelectContent>

                                </Select>

                            </div>

                        </div>

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        Product
                                    </TableHead>

                                    <TableHead>
                                        Category
                                    </TableHead>

                                    <TableHead>
                                        Price
                                    </TableHead>

                                    <TableHead>
                                        Stock
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <TableHead>
                                        Updated
                                    </TableHead>

                                    <TableHead className="text-right">
                                        Action
                                    </TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>

                                {filteredProducts.length === 0 && (

                                    <TableRow>

                                        <TableCell
                                            colSpan={7}
                                            className="h-40 text-center text-muted-foreground"
                                        >
                                            No inventory found.
                                        </TableCell>

                                    </TableRow>

                                )}

                                {filteredProducts.map((product) => (

                                    <TableRow key={product.id}>

                                        <TableCell>

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border bg-muted">

                                                    {product.imageUrl ? (

                                                        <Image
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            width={56}
                                                            height={56}
                                                            className="h-full w-full object-cover"
                                                        />

                                                    ) : (

                                                        <Package className="h-6 w-6 text-muted-foreground" />

                                                    )}

                                                </div>

                                                <div>

                                                    <div className="font-medium">
                                                        {product.name}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        SKU : {product.sku}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        Code : {product.productCode}
                                                    </div>

                                                </div>

                                            </div>

                                        </TableCell>

                                        <TableCell>

                                            <Badge variant="outline">
                                                {product.category}
                                            </Badge>

                                        </TableCell>

                                        <TableCell>

                                            ฿{Number(product.price).toLocaleString()}

                                        </TableCell>
                                        <TableCell>

                                            <span
                                                className={cn(
                                                    "font-semibold",
                                                    product.stock <= 3 &&
                                                    product.status ===
                                                    InventoryStatus.AVAILABLE &&
                                                    "text-destructive"
                                                )}
                                            >
                                                {product.stock}
                                            </span>

                                        </TableCell>

                                        <TableCell>

                                            <Badge
                                                variant={getStatusVariant(
                                                    product.status
                                                )}
                                            >
                                                {product.status.replace("_", " ")}
                                            </Badge>

                                        </TableCell>

                                        <TableCell>

                                            <div className="text-sm">
                                                {format(
                                                    new Date(product.updatedAt),
                                                    "dd MMM yyyy"
                                                )}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {format(
                                                    new Date(product.updatedAt),
                                                    "HH:mm"
                                                )}
                                            </div>

                                        </TableCell>

                                        <TableCell className="text-right">

                                            <div className="flex justify-end gap-2">

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <Link
                                                        href={`/dashboard/products/${product.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setQuantityChange(0);
                                                        setReason("");
                                                        setOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                            </div>

                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>

                    </CardContent>

                </Card>

                <Dialog
                    open={open}
                    onOpenChange={setOpen}
                >

                    <DialogContent className="sm:max-w-md">

                        <DialogHeader>

                            <DialogTitle>
                                Adjust Stock
                            </DialogTitle>

                            <DialogDescription>
                                Increase or decrease inventory quantity manually.
                            </DialogDescription>

                        </DialogHeader>

                        <div className="space-y-4">

                            <div>

                                <Label className="mb-2">
                                    Product
                                </Label>

                                <Input
                                    disabled
                                    value={selectedProduct?.name ?? ""}
                                />

                            </div>

                            <div>

                                <Label className="mb-2">
                                    Quantity Change
                                </Label>

                                <Input
                                    type="number"
                                    value={quantityChange}
                                    onChange={(e) =>
                                        setQuantityChange(Number(e.target.value))
                                    }
                                />

                            </div>

                            <div>

                                <Label className="mb-2">
                                    Reason
                                </Label>

                                <Textarea
                                    rows={4}
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(e.target.value)
                                    }
                                    placeholder="Inventory adjustment reason..."
                                />

                            </div>
                        </div>

                        <DialogFooter>

                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                disabled={
                                    !selectedProduct ||
                                    quantityChange === 0 ||
                                    reason.trim() === "" ||
                                    adjustStock.isPending
                                }
                                onClick={() => {

                                    if (!selectedProduct) return;

                                    adjustStock.mutate(
                                        {
                                            id: selectedProduct.id,
                                            quantityChange,
                                            reason,
                                        },
                                        {
                                            onSuccess: () => {
                                                setOpen(false);
                                                setSelectedProduct(null);
                                                setQuantityChange(0);
                                                setReason("");
                                            },
                                        }
                                    );

                                }}
                            >
                                {adjustStock.isPending
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                        </DialogFooter>

                    </DialogContent>

                </Dialog>

            </div>
        </>
    );

}

function getStatusVariant(
    status: InventoryStatus
): "default" | "secondary" | "destructive" | "outline" {

    switch (status) {

        case InventoryStatus.AVAILABLE:
            return "default";

        case InventoryStatus.CONSIGNED:
            return "secondary";

        case InventoryStatus.SOLD:
            return "destructive";

        default:
            return "outline";

    }

}