"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";

import { useSale } from "@/hooks/use-Sale";
import { PaymentMethod } from "@/types/sale";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import {
    ArrowLeft,
    Calendar,
    CreditCard,
    ExternalLink,
    FileText,
    Loader2,
    Receipt,
    User,
    Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import {
    Separator,
} from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SaleDetailPage() {

    const params = useParams();

    const saleId = params.id as string;

    const {
        data: sale,
        isLoading,
        error,
    } = useSale(saleId);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !sale) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">
                    Sale not found
                </h2>

                <Button >
                    <Link href="/dashboard/sales">
                        Back to Sales
                    </Link>
                </Button>
            </div>
        );
    }

    const payment = sale.order.payments[0];

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

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="space-y-2">

                        <Button

                            variant="ghost"
                            className="w-fit"
                        >
                            <Link href="/dashboard/sales">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>

                        <div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Sale Details
                            </h1>

                            <p className="text-muted-foreground">
                                View completed sale information.
                            </p>

                        </div>

                    </div>

                    <Badge
                        variant="default"
                        className="w-fit"
                    >
                        Completed Sale
                    </Badge>

                </div>

                <div className="grid gap-4 md:grid-cols-4">

                    <Card>

                        <CardHeader className="pb-2">

                            <CardDescription>
                                Order Number
                            </CardDescription>

                            <CardTitle>
                                #{sale.order.id.slice(0, 8)}
                            </CardTitle>

                        </CardHeader>

                    </Card>

                    <Card>

                        <CardHeader className="pb-2">

                            <CardDescription>
                                Total Amount
                            </CardDescription>

                            <CardTitle>
                                ฿{Number(sale.order.totalAmount).toLocaleString()}
                            </CardTitle>

                        </CardHeader>

                    </Card>

                    <Card>

                        <CardHeader className="pb-2">

                            <CardDescription>
                                Payment Status
                            </CardDescription>

                            <CardTitle>
                                Paid
                            </CardTitle>

                        </CardHeader>

                    </Card>

                    <Card>

                        <CardHeader className="pb-2">

                            <CardDescription>
                                Sold Date
                            </CardDescription>

                            <CardTitle className="text-lg">

                                {format(
                                    new Date(sale.soldAt),
                                    "dd MMM yyyy"
                                )}

                            </CardTitle>

                        </CardHeader>

                    </Card>

                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <User className="h-5 w-5" />

                                Customer Information

                            </CardTitle>

                            <CardDescription>
                                Customer profile linked to this sale.
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Full Name
                                </p>

                                <p className="font-medium">
                                    {sale.order.customer.fullName}
                                </p>

                            </div>

                            <Separator />

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Phone Number
                                </p>

                                <p className="font-medium">
                                    {sale.order.customer.phoneNumber}
                                </p>

                            </div>

                            {sale.order.customer.email && (
                                <>
                                    <Separator />

                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Email
                                        </p>

                                        <p className="font-medium">
                                            {sale.order.customer.email}
                                        </p>

                                    </div>
                                </>
                            )}

                        </CardContent>

                    </Card>
                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <CreditCard className="h-5 w-5" />

                                Payment Information

                            </CardTitle>

                            <CardDescription>
                                Payment recorded for this sale.
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Payment Method
                                </p>

                                <Badge
                                    variant="secondary"
                                    className="mt-2 w-fit"
                                >
                                    {payment?.paymentMethod.replaceAll("_", " ")}
                                </Badge>

                            </div>

                            <Separator />

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Amount Paid
                                </p>

                                <p className="text-lg font-semibold">
                                    ฿{Number(payment?.amount ?? 0).toLocaleString()}
                                </p>

                            </div>

                            <Separator />

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Payment Date
                                </p>

                                <p className="font-medium">
                                    {payment
                                        ? format(
                                            new Date(payment.paymentDate),
                                            "dd MMM yyyy HH:mm"
                                        )
                                        : "-"}
                                </p>

                            </div>

                            {payment?.note && (
                                <>
                                    <Separator />

                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Note
                                        </p>

                                        <p className="whitespace-pre-wrap">
                                            {payment.note}
                                        </p>

                                    </div>
                                </>
                            )}

                            {(payment?.paymentMethod ===
                                PaymentMethod.BANK_TRANSFER ||
                                payment?.paymentMethod ===
                                PaymentMethod.QR_CODE) &&
                                payment.slipUrl && (
                                    <>
                                        <Separator />

                                        <div className="space-y-3">

                                            <p className="text-sm text-muted-foreground">
                                                Payment Slip
                                            </p>

                                            <Button

                                                variant="outline"
                                            >
                                                <a
                                                    href={payment.slipUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Slip
                                                </a>
                                            </Button>

                                        </div>
                                    </>
                                )}

                        </CardContent>

                    </Card>

                </div>

                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <Receipt className="h-5 w-5" />

                            Sale Information

                        </CardTitle>

                        <CardDescription>
                            Summary of this completed transaction.
                        </CardDescription>

                    </CardHeader>

                    <CardContent>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Sale ID
                                </p>

                                <p className="mt-1 font-medium break-all">
                                    {sale.id}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Order ID
                                </p>

                                <p className="mt-1 font-medium break-all">
                                    {sale.order.id}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Sold Date
                                </p>

                                <div className="mt-1 flex items-center gap-2">

                                    <Calendar className="h-4 w-4 text-muted-foreground" />

                                    <span className="font-medium">
                                        {format(
                                            new Date(sale.soldAt),
                                            "dd MMM yyyy HH:mm"
                                        )}
                                    </span>

                                </div>

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Total Paid
                                </p>

                                <div className="mt-1 flex items-center gap-2">

                                    <Wallet className="h-4 w-4 text-muted-foreground" />

                                    <span className="text-lg font-semibold">
                                        ฿{Number(
                                            sale.order.paidAmount
                                        ).toLocaleString()}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </CardContent>

                </Card>
                <Card>

                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">

                            <FileText className="h-5 w-5" />

                            Notes

                        </CardTitle>

                        <CardDescription>
                            Additional information recorded with this payment.
                        </CardDescription>

                    </CardHeader>

                    <CardContent>

                        {payment?.note ? (

                            <div className="rounded-lg border bg-muted/30 p-4">

                                <p className="whitespace-pre-wrap text-sm leading-6">
                                    {payment.note}
                                </p>

                            </div>

                        ) : (

                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No notes were recorded for this sale.
                            </div>

                        )}

                    </CardContent>

                </Card>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">

                    <Button
                        variant="outline"
                    >
                        <Link href="/dashboard/sales">

                            <ArrowLeft className="mr-2 h-4 w-4" />

                            Back to Sales

                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                    >
                        <Link
                            href={`/dashboard/orders/${sale.order.id}`}
                        >

                            <Receipt className="mr-2 h-4 w-4" />

                            View Order

                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                    >
                        <Link
                            href={`/dashboard/customers/${sale.order.customer.id}`}
                        >

                            <User className="mr-2 h-4 w-4" />

                            View Customer

                        </Link>
                    </Button>

                    {payment?.slipUrl && (

                        <Button >

                            <a
                                href={payment.slipUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >

                                <ExternalLink className="mr-2 h-4 w-4" />

                                Open Slip

                            </a>

                        </Button>

                    )}

                </div>

            </div>
        </>


    );

}