"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
    ArrowUpDown,
    Calendar,
    CreditCard,
    Eye,
    Loader2,
    Receipt,
    Search,
    ShoppingBag,
    User,
} from "lucide-react";

import { format } from "date-fns";

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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { Separator } from "@/components/ui/separator";

import { useSales } from "@/hooks/use-Sale";

import { PaymentMethod } from "@/types/sale";
import type { Sale } from "@/types/sale";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const paymentMethods = [
    "ALL",
    PaymentMethod.CASH,
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.QR_CODE,
] as const;

export default function SalesPage() {
    const { data: sales = [], isLoading, error } = useSales();

    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("ALL");

    const filteredSales = useMemo(() => {
        return sales.filter((sale: Sale) => {
            const customer = sale.order.customer;

            const matchesSearch =
                search.trim() === "" ||
                customer.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                customer.phoneNumber.includes(search) ||
                sale.order.id
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const payment =
                sale.order.payments.length > 0
                    ? sale.order.payments[0].paymentMethod
                    : undefined;

            const matchesPayment =
                paymentMethod === "ALL" ||
                payment === paymentMethod;

            return matchesSearch && matchesPayment;
        });
    }, [sales, search, paymentMethod]);

    const totalRevenue = filteredSales.reduce(
        (sum: number, sale: { order: { totalAmount: number; }; }) => sum + Number(sale.order.totalAmount),
        0
    );

    const totalOrders = filteredSales.length;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Unable to load sales</AlertTitle>

                <AlertDescription>
                    Please refresh and try again.
                </AlertDescription>
            </Alert>
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
                                    Dashboard
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

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Sales
                        </h1>

                        <p className="text-muted-foreground">
                            Completed sales and revenue overview.
                        </p>
                    </div>

                    <Button >
                        <Link href="/dashboard/orders" className="flex">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            New Sale
                        </Link>
                    </Button>

                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Total Revenue
                            </CardDescription>

                            <CardTitle>
                                ฿{totalRevenue.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Completed Sales
                            </CardDescription>

                            <CardTitle>
                                {totalOrders}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Average Sale
                            </CardDescription>

                            <CardTitle>
                                ฿
                                {totalOrders === 0
                                    ? "0"
                                    : (
                                        totalRevenue /
                                        totalOrders
                                    ).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                    })}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Payment Records
                            </CardDescription>

                            <CardTitle>
                                {filteredSales.reduce(
                                    (sum, sale) => sum + sale.order.payments.length,
                                    0
                                )}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                </div>

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Sales History
                        </CardTitle>

                        <CardDescription>
                            Browse all completed sales.
                        </CardDescription>

                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="flex flex-col gap-4 lg:flex-row">

                            <div className="relative flex-1">

                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    className="pl-9"
                                    placeholder="Search customer, phone or order..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

                            <Select
                                value={paymentMethod}
                                onValueChange={(value) =>
                                    setPaymentMethod(
                                        value as PaymentMethod | "ALL"
                                    )
                                }
                            >
                                <SelectTrigger className="w-full lg:w-60">
                                    <SelectValue placeholder="Payment" />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="ALL">
                                        All Payments
                                    </SelectItem>

                                    <SelectItem
                                        value={PaymentMethod.CASH}
                                    >
                                        Cash
                                    </SelectItem>

                                    <SelectItem
                                        value={
                                            PaymentMethod.BANK_TRANSFER
                                        }
                                    >
                                        Bank Transfer
                                    </SelectItem>

                                    <SelectItem
                                        value={PaymentMethod.QR_CODE}
                                    >
                                        QR Code
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </div>
                        {filteredSales.length === 0 ? (

                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">

                                <Receipt className="mb-4 h-10 w-10 text-muted-foreground" />

                                <h3 className="text-lg font-semibold">
                                    No sales found
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    There are no completed sales matching your filters.
                                </p>

                            </div>

                        ) : (

                            <Table>

                                <TableHeader>

                                    <TableRow>

                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                className="h-auto p-0 font-semibold"
                                            >
                                                Order
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>

                                        <TableHead>
                                            Customer
                                        </TableHead>

                                        <TableHead>
                                            Payment
                                        </TableHead>

                                        <TableHead>
                                            Total
                                        </TableHead>

                                        <TableHead>
                                            Sold Date
                                        </TableHead>

                                        <TableHead className="w-[90px]" />

                                    </TableRow>

                                </TableHeader>

                                <TableBody>

                                    {filteredSales.map((sale) => {

                                        const payment =
                                            sale.order.payments[0];

                                        return (

                                            <TableRow key={sale.id}>

                                                <TableCell>

                                                    <div className="font-medium">
                                                        #{sale.order?.id?.slice(0, 8)}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        {sale.order.items.length} item
                                                        {sale.order.items.length > 1
                                                            ? "s"
                                                            : ""}
                                                    </div>

                                                </TableCell>

                                                <TableCell>

                                                    <div className="flex flex-col">

                                                        <div className="flex items-center gap-2">

                                                            <User className="h-4 w-4 text-muted-foreground" />

                                                            <span className="font-medium">
                                                                {
                                                                    sale.order.customer
                                                                        .fullName
                                                                }
                                                            </span>

                                                        </div>

                                                        <span className="pl-6 text-xs text-muted-foreground">
                                                            {
                                                                sale.order.customer
                                                                    .phoneNumber
                                                            }
                                                        </span>

                                                    </div>

                                                </TableCell>

                                                <TableCell>

                                                    {payment ? (
                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-1"
                                                        >
                                                            <CreditCard className="h-3 w-3" />
                                                            {payment?.paymentMethod?.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            Unknown
                                                        </Badge>
                                                    )}

                                                </TableCell>

                                                <TableCell>

                                                    <span className="font-semibold">
                                                        ฿
                                                        {Number(
                                                            sale.order.totalAmount
                                                        ).toLocaleString()}
                                                    </span>

                                                </TableCell>

                                                <TableCell>

                                                    <div className="flex items-center gap-2 text-sm">

                                                        <Calendar className="h-4 w-4 text-muted-foreground" />

                                                        {format(
                                                            new Date(sale.soldAt),
                                                            "dd MMM yyyy"
                                                        )}

                                                    </div>

                                                </TableCell>

                                                <TableCell className="text-right">

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Link
                                                            href={`/dashboard/sales/${sale.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                </TableCell>

                                            </TableRow>

                                        );

                                    })}

                                </TableBody>

                            </Table>

                        )}

                    </CardContent>

                </Card>
            </div>
        </>
    );
}