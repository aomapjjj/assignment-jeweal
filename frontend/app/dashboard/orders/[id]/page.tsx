"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Receipt,
    ShoppingBag,
    User,
    Phone,
    Mail,
    Package,
    CircleDollarSign,
    ShieldCheck,
    AlertTriangle,
    Wallet,
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

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

import { Badge } from "@/components/ui/Badge";

import { Skeleton } from "@/components/ui/skeleton";

import { Separator } from "@/components/ui/separator";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { useOrder } from "@/hooks/useOrders";

import {
    OrderStatus
} from "@/types/order";
import { InventoryStatus } from "@/types/product";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface OrderItem {
    id: string;
    product: {
        imageUrl: string | null;
        name: string;
        category: string;
        productType: string;
        sku: string;
        productCode: string;
        material: string;
        gemstone: string | null;
        weight: number | null;
        status: string;
        stock: number;
    };
    quantity: number;
    price: number | string;
}

export default function OrderDetailPage() {
    const params = useParams();

    const id = params.id as string;

    const {
        data: order,
        isLoading,
        isError,
    } = useOrder(id);

    const formatCurrency = (value: number | string) =>
        `฿${Number(value).toLocaleString()}`;

    const formatDate = (value?: string) =>
        value
            ? new Date(value).toLocaleString("en-GB")
            : "-";

    const getStatusVariant = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PAID:
                return "default";

            case OrderStatus.PARTIAL:
                return "secondary";

            case OrderStatus.PENDING:
                return "outline";

            case OrderStatus.CANCELLED:
                return "destructive";

            default:
                return "outline";
        }
    };

    const getInventoryVariant = (
        status: InventoryStatus
    ) => {
        switch (status) {
            case InventoryStatus.AVAILABLE:
                return "default";

            case InventoryStatus.RESERVED:
                return "secondary";

            case InventoryStatus.CONSIGNED:
                return "secondary";

            case InventoryStatus.OUT_OF_STOCK:
                return "outline";

            case InventoryStatus.SOLD:
                return "destructive";

            default:
                return "outline";
        }
    };
    if (isLoading) {
        return (
            <>
                <header className="flex h-16 items-center gap-2 border-b bg-background px-4">
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
                                <BreadcrumbLink href="/dashboard/orders">
                                    Orders
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

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Skeleton className="h-[260px]" />
                        <Skeleton className="h-[260px]" />
                        <Skeleton className="h-[260px]" />
                    </div>

                    <Skeleton className="h-[420px]" />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Skeleton className="h-[320px]" />
                        <Skeleton className="h-[320px]" />
                    </div>
                </div>
            </>
        );
    }

    if (isError || !order) {
        return (
            <>
                <header className="flex h-16 items-center gap-2 border-b bg-background px-4">
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
                                <BreadcrumbLink href="/dashboard/orders">
                                    Orders
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>Order</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="mx-auto max-w-3xl p-6">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />

                        <AlertTitle>Unable to load order</AlertTitle>

                        <AlertDescription>
                            The requested order could not be found or an unexpected error
                            occurred.
                        </AlertDescription>
                    </Alert>

                    <Button
                        className="mt-6"
                        variant="outline"
                    >
                        <Link href="/dashboard/orders" className="flex">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="flex h-16 items-center gap-2 border-b bg-background px-4">
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
                            <BreadcrumbLink href="/dashboard/orders">
                                Orders
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {order.id.slice(0, 8)}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="mx-auto max-w-7xl space-y-8 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Button
                        variant="outline"
                    >
                        <Link href="/dashboard/orders" className="flex">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>

                    <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                        </Badge>

                        {order.isConsignment && (
                            <Badge variant="secondary">
                                Consignment
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>

                            <CardDescription>
                                Customer details associated with this order.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Full Name
                                </p>

                                <p className="font-semibold">
                                    {order.customer.fullName}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />

                                <span>{order.customer.phoneNumber}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />

                                <span>
                                    {order.customer.email || "-"}
                                </span>
                            </div>

                            {order.isConsignment && (
                                <>
                                    <Separator />

                                    <Alert>
                                        <ShieldCheck className="h-4 w-4" />

                                        <AlertTitle>
                                            Consigned To
                                        </AlertTitle>

                                        <AlertDescription>
                                            Customer Name :{" "}
                                            <strong>
                                                {order.customer.fullName}
                                            </strong>
                                        </AlertDescription>
                                    </Alert>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Order Summary
                            </CardTitle>

                            <CardDescription>
                                Overview of the order transaction.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Order Status
                                </span>

                                <Badge
                                    variant={getStatusVariant(order.status)}
                                >
                                    {order.status}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Order Date
                                </span>

                                <span className="flex items-center gap-2 font-medium">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(order.createdAt)}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Total Items
                                </span>

                                <span className="font-semibold">
                                    {order.items.length}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Consignment
                                </span>

                                <Badge
                                    variant={
                                        order.isConsignment
                                            ? "secondary"
                                            : "outline"
                                    }
                                >
                                    {order.isConsignment
                                        ? "Yes"
                                        : "No"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CircleDollarSign className="h-5 w-5" />
                                Payment Summary
                            </CardTitle>

                            <CardDescription>
                                Current payment progress.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Total Amount
                                </span>

                                <span className="text-lg font-bold">
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Paid Amount
                                </span>

                                <span className="font-semibold text-green-600">
                                    {formatCurrency(order.paidAmount)}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Remaining
                                </span>

                                <span className="font-semibold text-red-600">
                                    {formatCurrency(order.remainingAmount)}
                                </span>
                            </div>

                            <Separator />

                            <Button className="w-full h-12">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Record Payment
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Ordered Products
                        </CardTitle>

                        <CardDescription>
                            Products included in this order.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {order.items.map((item: OrderItem) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-6 rounded-xl border p-5 md:flex-row"
                            >
                                <div className="relative h-36 w-36 overflow-hidden rounded-lg border bg-muted">
                                    <Image
                                        src={
                                            item.product.imageUrl ??
                                            "https://placehold.co/600x600/png"
                                        }
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {item.product.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {item.product.category} • {item.product.productType}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <Info
                                            label="SKU"
                                            value={item.product.sku}
                                        />

                                        <Info
                                            label="Product Code"
                                            value={item.product.productCode}
                                        />

                                        <Info
                                            label="Material"
                                            value={item.product.material}
                                        />

                                        <Info
                                            label="Gemstone"
                                            value={item.product.gemstone ?? "-"}
                                        />

                                        <Info
                                            label="Weight"
                                            value={
                                                item.product.weight
                                                    ? `${item.product.weight} g`
                                                    : "-"
                                            }
                                        />

                                        <Info
                                            label="Quantity"
                                            value={item.quantity}
                                        />

                                        <Info
                                            label="Unit Price"
                                            value={formatCurrency(item.price)}
                                        />

                                        <Info
                                            label="Line Total"
                                            value={formatCurrency(
                                                Number(item.price) * item.quantity
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">
                                            {item.product.status}
                                        </Badge>

                                        {item.product.stock > 0 ? (
                                            <Badge>
                                                In Stock ({item.product.stock})
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Payment History
                            </CardTitle>

                            <CardDescription>
                                All payments recorded for this order.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {order.payments.length > 0 ? (
                                <div className="space-y-4">
                                    {order.payments.map((payment: { id: Key | null | undefined; amount: string | number; createdAt: string | undefined; method: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(payment.createdAt)}
                                                </p>
                                            </div>

                                            <Badge>
                                                {payment.method}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Wallet className="mb-4 h-10 w-10 text-muted-foreground" />

                                    <h3 className="font-semibold">
                                        No Payments Yet
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                        This order has not received any payment.
                                        Click &quot;Record Payment&quot; to receive a
                                        deposit or additional payment.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Sale Information
                            </CardTitle>

                            <CardDescription>
                                Order completion status.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {order.sale ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Sale ID
                                        </span>

                                        <span className="font-medium">
                                            {order.sale.id}
                                        </span>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Sold At
                                        </span>

                                        <span>
                                            {formatDate(order.sale.createdAt)}
                                        </span>
                                    </div>

                                    <Separator />

                                    <Badge className="w-fit">
                                        Completed Sale
                                    </Badge>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package className="mb-4 h-10 w-10 text-muted-foreground" />

                                    <h3 className="font-semibold">
                                        Sale Not Completed
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                        The order will automatically become a Sale
                                        after the customer completes full payment.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 font-semibold">
                {value}
            </p>
        </div>
    );
}

function formatCurrency(value: string | number) {
    return `฿${Number(value).toLocaleString()}`;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString();
}

function getStatusVariant(status: string) {
    switch (status) {
        case "PAID":
            return "default";

        case "PARTIAL":
            return "secondary";

        case "CANCELLED":
            return "destructive";

        default:
            return "outline";
    }
}