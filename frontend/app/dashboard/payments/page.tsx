"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
    ArrowLeft,
    Banknote,
    CreditCard,
    Eye,
    Landmark,
    Loader2,
    QrCode,
    Receipt,
    Search,
} from "lucide-react";

import { usePayments } from "@/hooks/usePayments";

import {
    Payment,
    PaymentMethod,
} from "@/types/payment";

import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";

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

import { Input } from "@/components/ui/input";

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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

function paymentMethodLabel(method: PaymentMethod) {
    switch (method) {
        case PaymentMethod.CASH:
            return "Cash";

        case PaymentMethod.BANK_TRANSFER:
            return "Bank Transfer";

        case PaymentMethod.QR_CODE:
            return "QR Code";

        default:
            return method;
    }
}

function paymentMethodIcon(method: PaymentMethod) {
    switch (method) {
        case PaymentMethod.CASH:
            return (
                <Banknote className="h-4 w-4" />
            );

        case PaymentMethod.BANK_TRANSFER:
            return (
                <Landmark className="h-4 w-4" />
            );

        case PaymentMethod.QR_CODE:
            return (
                <QrCode className="h-4 w-4" />
            );

        default:
            return (
                <CreditCard className="h-4 w-4" />
            );
    }
}

export default function PaymentsPage() {
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<
        PaymentMethod | undefined
    >();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const {
        data: payments = [],
        isLoading,
        isError
    } = usePayments({
        search,
        page,
        limit,
    });

    const [method, setMethod] =
        useState("ALL");

    const [preview, setPreview] =
        useState<string | null>(null);

    const filteredPayments =
        useMemo(() => {
            const paymentList = Array.isArray(payments) ? payments : payments?.data || [];
            return paymentList.filter((payment) => {
                const matchesSearch =
                    payment.orderId
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    payment.note
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesMethod =
                    method === "ALL" ||
                    payment.paymentMethod ===
                    method;

                return (
                    matchesSearch &&
                    matchesMethod
                );
            });
        }, [
            payments,
            search,
            method,
        ]);

    const totalAmount = useMemo(() => {
        return filteredPayments?.reduce(
            (sum: number, payment: { amount: number; }) =>
                sum + Number(payment.amount),
            0
        );
    }, [filteredPayments]);

    const cashCount =
        filteredPayments?.filter(
            (p: { paymentMethod: PaymentMethod; }) =>
                p.paymentMethod ===
                PaymentMethod.CASH
        ).length;

    const transferCount =
        filteredPayments?.filter(
            (p: { paymentMethod: PaymentMethod; }) =>
                p.paymentMethod ===
                PaymentMethod.BANK_TRANSFER
        ).length;

    const qrCount =
        filteredPayments?.filter(
            (p: { paymentMethod: PaymentMethod; }) =>
                p.paymentMethod ===
                PaymentMethod.QR_CODE
        ).length;

    return (
        <SidebarInset>

            <header className="flex h-16 items-center gap-2 border-b bg-background px-4">

                <SidebarTrigger />

                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/dashboard"
                            >
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>

                            <BreadcrumbPage>
                                Payments
                            </BreadcrumbPage>

                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>

            </header>

            <div className="flex flex-1 flex-col gap-6 p-6">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment History
                        </h1>

                        <p className="text-muted-foreground">
                            View all recorded
                            customer payments.
                        </p>

                    </div>

                    <Button
                        variant="outline"
                    >
                        <Link
                            href="/dashboard/orders"
                            className="flex"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Orders
                        </Link>
                    </Button>

                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <Card>

                        <CardContent className="p-6">

                            <p className="text-sm text-muted-foreground">
                                Total Payments
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {filteredPayments?.length}
                            </h2>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="p-6">

                            <p className="text-sm text-muted-foreground">
                                Total Amount
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                ฿
                                {totalAmount.toLocaleString()}
                            </h2>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="p-6">

                            <p className="text-sm text-muted-foreground">
                                Cash Payments
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {cashCount}
                            </h2>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardContent className="p-6">

                            <p className="text-sm text-muted-foreground">
                                Transfer / QR
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {transferCount +
                                    qrCount}
                            </h2>

                        </CardContent>

                    </Card>

                </div>

                <Card>

                    <CardContent className="flex flex-col gap-4 p-6 lg:flex-row">

                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                            <Input
                                className="pl-9"
                                placeholder="Search Order ID or Note..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <Select
                            value={method}
                            onValueChange={(value) => {
                                if (value !== null) {
                                    setMethod(value);
                                }
                            }}
                        >

                            <SelectTrigger className="w-full lg:w-[220px]">

                                <SelectValue />

                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="ALL">
                                    All Methods
                                </SelectItem>

                                <SelectItem
                                    value={
                                        PaymentMethod.CASH
                                    }
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
                                    value={
                                        PaymentMethod.QR_CODE
                                    }
                                >
                                    QR Code
                                </SelectItem>

                            </SelectContent>

                        </Select>

                    </CardContent>

                </Card>
                {isLoading && (
                    <div className="flex h-[400px] items-center justify-center rounded-xl border">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {!isLoading && isError && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
                            <Receipt className="h-12 w-12 text-destructive" />

                            <div className="space-y-1 text-center">
                                <h3 className="text-xl font-semibold">
                                    Failed to load payments
                                </h3>

                                <p className="text-muted-foreground">
                                    Something went wrong while loading payment history.
                                </p>
                            </div>

                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {!isLoading &&
                    !isError &&
                    filteredPayments?.length === 0 && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                <Receipt className="mb-4 h-12 w-12 text-muted-foreground" />

                                <h3 className="text-xl font-semibold">
                                    No Payments Found
                                </h3>

                                <p className="mt-2 text-center text-muted-foreground">
                                    No payment records match your current search or filter.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                {!isLoading &&
                    !isError &&
                    filteredPayments?.length > 0 && (

                        <Card>

                            <CardContent className="p-0">

                                <Table>

                                    <TableHeader>

                                        <TableRow>

                                            <TableHead>
                                                Order ID
                                            </TableHead>

                                            <TableHead>
                                                Payment Method
                                            </TableHead>

                                            <TableHead>
                                                Amount
                                            </TableHead>

                                            <TableHead>
                                                Payment Date
                                            </TableHead>

                                            <TableHead>
                                                Note
                                            </TableHead>

                                            <TableHead>
                                                Slip
                                            </TableHead>

                                        </TableRow>

                                    </TableHeader>

                                    <TableBody>

                                        {filteredPayments?.map(
                                            (
                                                payment: Payment
                                            ) => (

                                                <TableRow
                                                    key={payment.id}
                                                >

                                                    <TableCell className="font-mono text-xs">
                                                        {payment.orderId}
                                                    </TableCell>

                                                    <TableCell>

                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-2"
                                                        >

                                                            {paymentMethodIcon(
                                                                payment.paymentMethod
                                                            )}

                                                            {paymentMethodLabel(
                                                                payment.paymentMethod
                                                            )}

                                                        </Badge>

                                                    </TableCell>

                                                    <TableCell className="font-medium">
                                                        ฿
                                                        {Number(
                                                            payment.amount
                                                        ).toLocaleString()}
                                                    </TableCell>

                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                payment.paymentDate
                                                            ),
                                                            "dd MMM yyyy"
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="max-w-[260px] truncate">
                                                        {payment.note ||
                                                            "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {payment.slipUrl ? (

                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    setPreview(
                                                                        payment.slipUrl!
                                                                    )
                                                                }
                                                            >

                                                                <Eye className="h-4 w-4" />

                                                            </Button>

                                                        ) : (

                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>

                                                        )}

                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )}

                                    </TableBody>

                                </Table>

                            </CardContent>

                        </Card>

                    )}

            </div>

            <Dialog
                open={!!preview}
                onOpenChange={(open) => {
                    if (!open) {
                        setPreview(null);
                    }
                }}
            >

                <DialogContent className="max-w-4xl">

                    <DialogHeader>

                        <DialogTitle>
                            Payment Slip
                        </DialogTitle>

                    </DialogHeader>

                    {preview && (

                        <div className="overflow-hidden rounded-xl border bg-muted">

                            <Image
                                src={preview}
                                alt="Payment Slip"
                                width={1400}
                                height={1800}
                                className="max-h-[80vh] w-full object-contain"
                            />

                        </div>

                    )}
                </DialogContent>

            </Dialog>

        </SidebarInset>
    );
}