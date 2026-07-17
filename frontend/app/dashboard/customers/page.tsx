"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
    Users,
    UserPlus,
    Search,
    Eye,
    Phone,
    Mail,
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";

import { Badge } from "@/components/ui/Badge";

import { useCustomers } from "@/hooks/useCustomer";

import type { Customer } from "@/types/customer";

export default function CustomersPage() {
    const [search, setSearch] = useState("");

    const {
        data,
        isLoading,
        isError,
    } = useCustomers({
        search,
        page: 1,
        limit: 20,
    });

    const customers = data?.data ?? [];

    const meta = data?.meta;

    const stats = useMemo(() => {
        return {
            total: meta?.total ?? 0,

            withEmail: customers.filter(
                (customer) => !!customer.email
            ).length,

            withoutEmail: customers.filter(
                (customer) => !customer.email
            ).length,
        };
    }, [customers, meta]);

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
                                    Customers
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="space-y-6 p-6">

                    <div className="grid gap-4 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <Skeleton className="h-5 w-28" />
                                </CardHeader>

                                <CardContent>
                                    <Skeleton className="h-8 w-20" />
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
                                    Customers
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertDescription>
                            Failed to load customers.
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
                                Customers
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Customers
                        </h1>

                        <p className="text-muted-foreground">
                            Manage customer information and purchase history.
                        </p>
                    </div>

                    <Button>
                        <Link href="/dashboard/customers/new" className="flex">
                            <UserPlus className="mr-2 h-4 w-4" />
                            New Customer
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Customers
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.total}
                                </p>
                            </div>

                            <Users className="h-8 w-8 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    With Email
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.withEmail}
                                </p>
                            </div>

                            <Mail className="h-8 w-8 text-blue-500" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Phone Only
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {stats.withoutEmail}
                                </p>
                            </div>

                            <Phone className="h-8 w-8 text-green-600" />
                        </CardContent>
                    </Card>

                </div>

                <Card>

                    <CardContent className="p-6">

                        <div className="relative mb-6">

                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                            <Input
                                placeholder="Search by customer name, phone number or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />

                        </div>

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>Customer</TableHead>

                                    <TableHead>Phone</TableHead>

                                    <TableHead>Email</TableHead>

                                    <TableHead>Orders</TableHead>

                                    <TableHead>Created</TableHead>

                                    <TableHead className="w-[100px]">
                                        Action
                                    </TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>
                                {customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-40 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <Users className="h-10 w-10 text-muted-foreground" />

                                                <div>
                                                    <h3 className="font-semibold">
                                                        No Customers Found
                                                    </h3>

                                                    <p className="text-sm text-muted-foreground">
                                                        Try another keyword or create a new customer.
                                                    </p>
                                                </div>

                                                <Button>
                                                    <Link href="/dashboard/customers/new">
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        Create Customer
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customers.map((customer: Customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        {customer.fullName}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {customer.id.slice(0, 8)}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {customer.phoneNumber}
                                            </TableCell>

                                            <TableCell>
                                                {customer.email ? (
                                                    customer.email
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {customer.orders?.length ?? 0} Orders
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {new Date(
                                                    customer.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                <Button

                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Link
                                                        href={`/dashboard/customers/${customer.id}`}
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
                <div className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm md:flex-row">
                    <div className="text-muted-foreground">
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {customers.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-foreground">
                            {meta?.total ?? 0}
                        </span>{" "}
                        customers
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={meta.page <= 1}
                            >
                                Previous
                            </Button>

                            <span className="text-muted-foreground">
                                Page{" "}
                                <span className="font-semibold text-foreground">
                                    {meta.page}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-foreground">
                                    {meta.totalPages}
                                </span>
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={meta.page >= meta.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}