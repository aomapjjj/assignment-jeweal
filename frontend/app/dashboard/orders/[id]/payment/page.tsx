"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Loader2,
    Receipt,
    Upload,
    Save,
    User,
    Wallet,
    ImageIcon,
    UploadCloud,
} from "lucide-react";

import { useOrder } from "@/hooks/useOrders";
import { usePayments, useCreatePayment } from "@/hooks/usePayments";

import { uploadService } from "@/services/upload.service";

import { PaymentMethod } from "@/types/payment";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

import { Badge } from "@/components/ui/Badge";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

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

import PaymentSlipUpload from "@/components/ui/payment-slip-upload";

const paymentSchema = z
    .object({
        amount: z.coerce
            .number()
            .min(0.01, "Amount must be greater than 0"),

        paymentMethod: z.nativeEnum(PaymentMethod),

        note: z.string().optional(),

        paymentDate: z.string().optional(),

        slipUrl: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            (data.paymentMethod === PaymentMethod.BANK_TRANSFER ||
                data.paymentMethod === PaymentMethod.QR_CODE) &&
            !data.slipUrl
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["slipUrl"],
                message: "Please upload payment slip.",
            });
        }
    });

type PaymentForm = z.output<typeof paymentSchema>;

export default function OrderPaymentPage() {
    const router = useRouter();

    const params = useParams();

    const orderId = params.id as string;

    const {
        data: order,
        isLoading: orderLoading,
        error: orderError,
    } = useOrder(orderId);

    const {
        data: payments = [],
        isLoading: paymentsLoading,
    } = usePayments(orderId);

    const createPayment = useCreatePayment();

    const form = useForm<
        z.input<typeof paymentSchema>,
        unknown,
        z.output<typeof paymentSchema>
    >({
        resolver: zodResolver(paymentSchema),

        defaultValues: {
            amount: 0,
            paymentMethod: PaymentMethod.QR_CODE,
            note: "",
            paymentDate: format(new Date(), "yyyy-MM-dd"),
            slipUrl: "",
        },
    });

    const paymentMethod = form.watch("paymentMethod");

    const slipUrl = form.watch("slipUrl");

    const remainingAmount = useMemo(() => {
        if (!order) return 0;

        return Number(order.remainingAmount);
    }, [order]);


    async function onSubmit(values: PaymentForm) {
        if (!order) return;

        try {
            await createPayment.mutateAsync({
                orderId,

                amount: values.amount,

                paymentMethod: values.paymentMethod,

                note: values.note,

                paymentDate: values.paymentDate,

                slipUrl: values.slipUrl,
            });

            toast.success("Payment recorded successfully.");

            router.push(`/dashboard/orders/${orderId}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                    "Failed to record payment."
                );
            } else {
                toast.error("Failed to record payment.");
            }
        }
    }

    if (orderLoading || paymentsLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (orderError || !order) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">
                    Failed to load order.
                </p>

                <Button >
                    <Link href="/dashboard/orders">
                        Back
                    </Link>
                </Button>
            </div>
        );
    }

    const isPaid = order.status === "PAID";
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
                            <BreadcrumbPage>Payment</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="mx-auto max-w-3xl p-6 ">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Record Payment
                        </h1>

                        <p className="text-muted-foreground">
                            Order #{order.id.slice(0, 8)}
                        </p>

                    </div>

                    <Badge
                        variant={isPaid ? "default" : "secondary"}
                        className="w-fit"
                    >
                        {order.status}
                    </Badge>

                </div>

                <div className="grid gap-6 lg:grid-cols-3 mt-4">

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <Wallet className="h-5 w-5" />

                                Remaining Balance

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">

                                ฿
                                {Number(order.remainingAmount).toLocaleString()}

                            </p>

                            <p className="mt-2 text-sm text-muted-foreground">

                                Paid

                                {" "}

                                ฿
                                {Number(order.paidAmount).toLocaleString()}

                                {" "}

                                / ฿
                                {Number(order.totalAmount).toLocaleString()}

                            </p>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <User className="h-5 w-5" />

                                Customer

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="space-y-2">

                            <p className="font-medium">
                                {order.customer.fullName}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {order.customer.phoneNumber}
                            </p>

                            {order.customer.email && (
                                <p className="text-sm text-muted-foreground">
                                    {order.customer.email}
                                </p>
                            )}

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <Receipt className="h-5 w-5" />

                                Payment History

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p className="text-3xl font-bold">
                                {payments.length}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Recorded payment(s)
                            </p>

                        </CardContent>

                    </Card>

                </div>

                <Card className="mt-4">

                    <CardHeader>

                        <CardTitle>
                            Previous Payments
                        </CardTitle>

                        <CardDescription>
                            Payment history for this order.
                        </CardDescription>

                    </CardHeader>

                    <CardContent>

                        {payments.length === 0 ? (

                            <div className="rounded-lg border border-dashed py-12 text-center">

                                <Receipt className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                                <p className="text-muted-foreground">
                                    No payment history.
                                </p>

                            </div>

                        ) : (

                            <Table>

                                <TableHeader>

                                    <TableRow>

                                        <TableHead>Date</TableHead>

                                        <TableHead>Method</TableHead>

                                        <TableHead>Amount</TableHead>

                                        <TableHead>Note</TableHead>

                                    </TableRow>

                                </TableHeader>

                                <TableBody>

                                    {payments.map((payment) => (

                                        <TableRow key={payment.id}>

                                            <TableCell>

                                                <div className="flex items-center gap-2">

                                                    <Calendar className="h-4 w-4 text-muted-foreground" />

                                                    {format(
                                                        new Date(payment.paymentDate),
                                                        "dd MMM yyyy"
                                                    )}

                                                </div>

                                            </TableCell>

                                            <TableCell>

                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1"
                                                >

                                                    <CreditCard className="h-3 w-3" />

                                                    {payment.paymentMethod.replaceAll(
                                                        "_",
                                                        " "
                                                    )}

                                                </Badge>

                                            </TableCell>

                                            <TableCell className="font-medium">

                                                ฿
                                                {Number(payment.amount).toLocaleString()}

                                            </TableCell>

                                            <TableCell>

                                                {payment.note || "-"}

                                            </TableCell>

                                        </TableRow>

                                    ))}

                                </TableBody>

                            </Table>

                        )}

                    </CardContent>

                </Card>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <Card className="mt-4">

                        <CardHeader>

                            <CardTitle>
                                New Payment
                            </CardTitle>

                            <CardDescription>
                                Record payment for this order.
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">

                                <div className="space-y-2">

                                    <Label htmlFor="amount">
                                        Amount
                                    </Label>

                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        max={remainingAmount}
                                        disabled={isPaid}
                                        {...form.register("amount", {
                                            valueAsNumber: true,
                                        })}
                                    />

                                    {form.formState.errors.amount && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.amount
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>

                                <div className="space-y-2">

                                    <Label>
                                        Payment Method
                                    </Label>

                                    <Select
                                        value={paymentMethod}
                                        disabled={isPaid}
                                        onValueChange={(value) =>
                                            form.setValue(
                                                "paymentMethod",
                                                value as PaymentMethod
                                            )
                                        }
                                    >

                                        <SelectTrigger>

                                            <SelectValue />

                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem
                                                value={PaymentMethod.QR_CODE}
                                            >
                                                QR Code
                                            </SelectItem>

                                        </SelectContent>

                                    </Select>

                                </div>

                            </div>

                            <div className="space-y-2">

                                <Label htmlFor="paymentDate">
                                    Payment Date
                                </Label>

                                <Input
                                    id="paymentDate"
                                    type="date"
                                    disabled={isPaid}
                                    {...form.register("paymentDate")}
                                />

                            </div>

                            <div className="space-y-2">

                                <Label htmlFor="note">
                                    Note
                                </Label>

                                <Textarea
                                    id="note"
                                    rows={4}
                                    disabled={isPaid}
                                    placeholder="Optional note..."
                                    {...form.register("note")}
                                />

                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Slip</CardTitle>

                                    <CardDescription>
                                        Upload bank transfer or QR payment receipt.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <PaymentSlipUpload
                                        value={slipUrl}
                                        disabled={createPayment.isPending || isPaid}
                                        onChange={(url) => {
                                            form.setValue("slipUrl", url, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                        onRemove={() => {
                                            form.setValue("slipUrl", "", {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                    />
                                </CardContent>
                            </Card>
                            <div className="rounded-lg border bg-muted/40 p-4">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-muted-foreground">
                                        Remaining Balance
                                    </span>

                                    <span className="font-semibold">
                                        ฿{Number(order.remainingAmount).toLocaleString()}
                                    </span>

                                </div>

                                <div className="mt-2 flex items-center justify-between">

                                    <span className="text-sm text-muted-foreground">
                                        This Payment
                                    </span>

                                    <span className="font-semibold">
                                        ฿
                                        {Number(
                                            form.watch("amount") || 0
                                        ).toLocaleString()}
                                    </span>

                                </div>

                                <div className="mt-4 border-t pt-4">

                                    <div className="flex items-center justify-between">

                                        <span className="font-medium">
                                            Balance After Payment
                                        </span>

                                        <span className="text-lg font-bold">

                                            ฿
                                            {Math.max(
                                                0,
                                                Number(order.remainingAmount) -
                                                Number(
                                                    form.watch("amount") || 0
                                                )
                                            ).toLocaleString()}

                                        </span>

                                    </div>

                                </div>

                            </div>

                            {isPaid && (

                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">

                                    <p className="font-medium text-green-700">
                                        This order has already been fully paid.
                                    </p>

                                </div>

                            )}

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                                <Button
                                    type="button"
                                    variant="outline"
                                >

                                    <Link href={`/dashboard/orders/${order.id}`}>
                                        Cancel
                                    </Link>

                                </Button>

                                <Button type="submit"
                                    disabled={
                                        createPayment.isPending || isPaid}
                                >
                                    Record Payment

                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                </form>

            </div>
        </>
    );
}