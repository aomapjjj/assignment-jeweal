"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    ShoppingBag,
    User,
} from "lucide-react";

import { useCustomer } from "@/hooks/useCustomer";

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

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetailPage() {
    const params = useParams();

    const id = params.id as string;

    const {
        data: customer,
        isLoading,
        isError,
    } = useCustomer(id);

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
                                <BreadcrumbLink href="/dashboard/customers">
                                    Customers
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Customer Detail
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="mx-auto max-w-7xl space-y-6 p-6">
                    <Skeleton className="h-10 w-40" />

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-80" />
                        </CardHeader>

                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-20 rounded-lg"
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-7 w-56" />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-16 rounded-lg"
                                />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (isError || !customer) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>
                            Customer Not Found
                        </CardTitle>

                        <CardDescription>
                            Unable to load customer information.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Button >
                            <Link href="/dashboard/customers">
                                Back to Customers
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalOrders = customer?.orders?.length;

    const totalSpent = customer?.orders?.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0
    );

    const pendingOrders = customer?.orders?.filter(
        (order) => order.status !== "PAID"
    ).length ?? 0;

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
                            <BreadcrumbLink href="/dashboard/customers">
                                Customers
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {customer.fullName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {customer.fullName}
                        </h1>

                        <p className="text-muted-foreground">
                            Customer Profile & Purchase History
                        </p>
                    </div>

                    <Button
                        variant="outline"

                    >
                        <Link href="/dashboard/customers" className="flex">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>

                            <CardDescription>
                                Contact details and account information.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </div>

                                    <p className="mt-2 text-lg font-semibold">
                                        {customer.fullName}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        Phone Number
                                    </div>

                                    <p className="mt-2 text-lg font-semibold">
                                        {customer.phoneNumber}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </div>

                                    <p className="mt-2 text-lg font-semibold">
                                        {customer.email || "-"}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Registered
                                    </div>

                                    <p className="mt-2 text-lg font-semibold">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="mb-3 text-sm font-semibold">
                                    Customer Summary
                                </h3>

                                <p className="text-sm leading-6 text-muted-foreground">
                                    This customer profile contains contact information,
                                    purchase history and outstanding orders. Sales staff can
                                    review previous transactions before creating a new order
                                    or continuing an existing payment.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Total Orders
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <ShoppingBag className="h-8 w-8 text-primary" />

                                    <span className="text-3xl font-bold">
                                        {totalOrders}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Total Purchased
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-3xl font-bold">
                                    ฿{totalSpent?.toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Pending Orders
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Badge
                                    variant={
                                        pendingOrders > 0
                                            ? "secondary"
                                            : "default"
                                    }
                                    className="text-base"
                                >
                                    {pendingOrders}
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Order History
                        </CardTitle>

                        <CardDescription>
                            Recent orders associated with this customer.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {customer?.orders?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                                <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />

                                <h3 className="text-lg font-semibold">
                                    No Orders Found
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    This customer has not placed any orders yet.
                                </p>

                                <Button
                                    className="mt-6"
                                >
                                    <Link href="/dashboard/orders/new">
                                        Create First Order
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="py-3 font-medium">
                                                Order
                                            </th>

                                            <th className="py-3 font-medium">
                                                Date
                                            </th>

                                            <th className="py-3 font-medium">
                                                Total
                                            </th>

                                            <th className="py-3 font-medium">
                                                Paid
                                            </th>

                                            <th className="py-3 font-medium">
                                                Remaining
                                            </th>

                                            <th className="py-3 font-medium">
                                                Status
                                            </th>

                                            <th className="py-3 text-right font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {customer?.orders?.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="py-4">
                                                    <div>
                                                        <p className="font-medium">
                                                            #{order.id.slice(0, 8)}
                                                        </p>

                                                        {order.isConsignment && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="mt-2"
                                                            >
                                                                Consignment
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-4">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="py-4 font-medium">
                                                    ฿
                                                    {Number(
                                                        order.totalAmount
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="py-4">
                                                    ฿
                                                    {Number(
                                                        order.paidAmount
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="py-4">
                                                    ฿
                                                    {Number(
                                                        order.remainingAmount
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="py-4">
                                                    <Badge
                                                        variant={
                                                            order.status === "PAID"
                                                                ? "default"
                                                                : order.status === "PARTIAL"
                                                                    ? "secondary"
                                                                    : order.status === "CANCELLED"
                                                                        ? "destructive"
                                                                        : "outline"
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </td>

                                                <td className="py-4 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"

                                                    >
                                                        <Link
                                                            href={`/dashboard/orders/${order.id}`}
                                                        >
                                                            View
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}