// File:
// app/dashboard/orders/page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
    Eye,
    Plus,
    Search,
    ShoppingCart,
    Clock3,
    CheckCircle2,
    Wallet,
} from "lucide-react";

import { useOrders } from "@/hooks/useOrders";

import { Order, OrderStatus } from "@/types/order";

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

import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

import { Skeleton } from "@/components/ui/skeleton";

import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

import { Badge } from "@/components/ui/Badge";

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

export default function OrdersPage() {
    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("ALL");

    const {
        data: orders = [],
        isLoading,
        isError,
    } = useOrders();

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const keyword = search.toLowerCase();

            const matchKeyword =
                order.customer.fullName
                    .toLowerCase()
                    .includes(keyword) ||
                order.customer.phoneNumber.includes(keyword) ||
                order.id.toLowerCase().includes(keyword);

            const matchStatus =
                status === "ALL" ||
                order.status === status;

            return matchKeyword && matchStatus;
        });
    }, [orders, search, status]);

    const stats = useMemo(() => {
        return {
            total: orders.length,

            pending: orders.filter(
                (o) => o.status === OrderStatus.PENDING
            ).length,

            partial: orders.filter(
                (o) => o.status === OrderStatus.PARTIAL
            ).length,

            paid: orders.filter(
                (o) => o.status === OrderStatus.PAID
            ).length,
        };
    }, [orders]);

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
                                <BreadcrumbPage>
                                    Orders
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="space-y-6 p-6">

                    <div className="grid gap-4 md:grid-cols-4">

                        {Array.from({ length: 4 }).map((_, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <Skeleton className="h-5 w-28" />
                                </CardHeader>

                                <CardContent>
                                    <Skeleton className="h-8 w-16" />
                                </CardContent>
                            </Card>
                        ))}

                    </div>

                    <Card>
                        <CardContent className="space-y-4 p-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-12 w-full"
                                />
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </>
        );
    }

    if (isError) {
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
                                <BreadcrumbPage>
                                    Orders
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertDescription>
                            Failed to load orders.
                        </AlertDescription>
                    </Alert>
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
                            <BreadcrumbPage>
                                Orders
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Orders
                        </h1>

                        <p className="text-muted-foreground">
                            Manage customer orders, deposits and consignment transactions.
                        </p>
                    </div>

                    <Button>
                        <Link href="/dashboard/products" className="flex">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Order
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.total}
                                </p>
                            </div>

                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.pending}
                                </p>
                            </div>

                            <Clock3 className="h-8 w-8 text-amber-500" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Partial Paid
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.partial}
                                </p>
                            </div>

                            <Wallet className="h-8 w-8 text-blue-500" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Completed
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.paid}
                                </p>
                            </div>

                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </CardContent>
                    </Card>

                </div>

                <Card>

                    <CardContent className="flex flex-col gap-4 p-6 md:flex-row">

                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                            <Input
                                placeholder="Search customer, phone number or order id..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={status || ""}
                            onValueChange={(value) =>
                                setStatus(value as OrderStatus | "ALL")
                            }
                        >
                            <SelectTrigger className="w-full md:w-[220px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="ALL">
                                    All Status
                                </SelectItem>

                                <SelectItem value={OrderStatus.PENDING}>
                                    Pending
                                </SelectItem>

                                <SelectItem value={OrderStatus.PARTIAL}>
                                    Partial
                                </SelectItem>

                                <SelectItem value={OrderStatus.PAID}>
                                    Paid
                                </SelectItem>

                                <SelectItem value={OrderStatus.CANCELLED}>
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Order List
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>Order</TableHead>

                                    <TableHead>Customer</TableHead>

                                    <TableHead>Status</TableHead>

                                    <TableHead>Payment</TableHead>

                                    <TableHead>Total</TableHead>

                                    <TableHead>Created</TableHead>

                                    <TableHead className="w-[100px]">
                                        Action
                                    </TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-40 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <ShoppingCart className="h-10 w-10 text-muted-foreground" />

                                                <div>
                                                    <h3 className="font-semibold">
                                                        No Orders Found
                                                    </h3>

                                                    <p className="text-sm text-muted-foreground">
                                                        Try changing your search or filter.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order: Order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        #{order.id.slice(0, 8)}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {order.items.length} item(s)
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        {order.customer.fullName}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {order.customer.phoneNumber}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <OrderStatusBadge
                                                    status={order.status}
                                                />

                                                {order.isConsignment && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mt-2"
                                                    >
                                                        Consignment
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        ฿
                                                        {Number(
                                                            order.paidAmount
                                                        ).toLocaleString()}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        Remaining ฿
                                                        {Number(
                                                            order.remainingAmount
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                ฿
                                                {Number(
                                                    order.totalAmount
                                                ).toLocaleString()}
                                            </TableCell>

                                            <TableCell>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Link
                                                        href={`/dashboard/orders/${order.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}

                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {filteredOrders.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-foreground">
                            {orders.length}
                        </span>{" "}
                        orders
                    </div>

                    <div className="text-sm">
                        Total Sales Value{" "}
                        <span className="font-semibold">
                            ฿
                            {filteredOrders
                                .reduce(
                                    (sum, order) =>
                                        sum + Number(order.totalAmount),
                                    0
                                )
                                .toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

function OrderStatusBadge({
    status,
}: {
    status: OrderStatus;
}) {
    switch (status) {
        case OrderStatus.PENDING:
            return (
                <Badge variant="secondary">
                    Pending
                </Badge>
            );

        case OrderStatus.PARTIAL:
            return (
                <Badge className="bg-amber-500 hover:bg-amber-500">
                    Partial Paid
                </Badge>
            );

        case OrderStatus.PAID:
            return (
                <Badge className="bg-green-600 hover:bg-green-600">
                    Paid
                </Badge>
            );

        case OrderStatus.CANCELLED:
            return (
                <Badge variant="destructive">
                    Cancelled
                </Badge>
            );

        default:
            return (
                <Badge variant="outline">
                    {status}
                </Badge>
            );
    }
}