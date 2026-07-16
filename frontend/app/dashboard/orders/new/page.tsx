"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
    Loader2,
    Package,
    User,
    Search,
    Plus,
    ShoppingCart,
} from "lucide-react";

import { toast } from "sonner";

import { useProduct } from "@/hooks/useProduct";
import { productService } from "@/services/product.service";
import axiosInstance from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

import { Badge } from "@/components/ui/Badge";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/Table";

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";

const customerSchema = z.object({
    fullName: z.string().min(1, "Customer name is required"),
    phoneNumber: z.string().min(9, "Phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
});

const orderSchema = z.object({
    quantity: z.number().min(1),
    isConsignment: z.boolean(),
});

type OrderForm = z.infer<typeof orderSchema>;
type CustomerForm = z.infer<typeof customerSchema>;

interface Customer {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
}

interface CustomerResponse {
    data: Customer[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default function NewOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const productId = searchParams.get("productId") ?? "";

    const {
        data: product,
        isLoading,
        isError,
    } = useProduct(productId);

    const orderForm = useForm<OrderForm>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            quantity: 1,
            isConsignment: false,
        },
    });

    const customerForm = useForm<CustomerForm>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
        },
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);

    const [customerSearch, setCustomerSearch] = useState("");

    const [loadingCustomers, setLoadingCustomers] =
        useState(false);

    const [creatingCustomer, setCreatingCustomer] =
        useState(false);

    const [creatingOrder, setCreatingOrder] =
        useState(false);

    const [customerDialogOpen, setCustomerDialogOpen] =
        useState(false);

    const quantity = orderForm.watch("quantity");

    const isConsignment =
        orderForm.watch("isConsignment");

    const totalPrice = useMemo(() => {
        if (!product) return 0;

        return Number(product.price) * quantity;
    }, [product, quantity]);

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadCustomers(customerSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [customerSearch]);

    async function loadCustomers(search?: string) {
        try {
            setLoadingCustomers(true);

            const { data } =
                await axiosInstance.get<CustomerResponse>(
                    "/customers",
                    {
                        params: {
                            search,
                            page: 1,
                            limit: 20,
                        },
                    }
                );

            setCustomers(data.data);
        } catch {
            toast.error("Failed to load customers.");
        } finally {
            setLoadingCustomers(false);
        }
    }
    async function createCustomer(values: CustomerForm) {
        try {
            setCreatingCustomer(true);

            const { data } = await axiosInstance.post(
                "/customers",
                values
            );

            toast.success("Customer created successfully.");

            setSelectedCustomer(data);

            setCustomerDialogOpen(false);

            customerForm.reset();

            loadCustomers(customerSearch);
        } catch (error) {
            toast.error("Failed to create customer.");
        } finally {
            setCreatingCustomer(false);
        }
    }

    async function createOrder() {
        if (!product) return;

        if (!selectedCustomer) {
            toast.error("Please select a customer.");
            return;
        }

        try {
            setCreatingOrder(true);

            const response = await axiosInstance.post("/orders", {
                customerId: selectedCustomer.id,
                isConsignment,
                items: [
                    {
                        productId: product.id,
                        quantity,
                    },
                ],
            });

            toast.success("Order created successfully.");

            router.push(`/dashboard/orders/${response.data.id}`);
        } catch (error) {
            toast.error("Failed to create order.");
        } finally {
            setCreatingOrder(false);
        }
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <Skeleton className="h-10 w-44" />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Skeleton className="h-[520px]" />
                    <Skeleton className="h-[520px]" />
                    <Skeleton className="h-[520px]" />
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                Failed to load product.
            </div>
        );
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
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
                                Order
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <Button
                    variant="outline"
                >
                    <Link
                        href={`/dashboard/products/${product.id}`}
                        className="flex"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Product
                    </Link>
                </Button>

                <div className="grid gap-6 lg:grid-cols-3">

                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>
                                Product Preview
                            </CardTitle>

                            <CardDescription>
                                Review selected product before creating an order.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="relative aspect-square overflow-hidden rounded-lg border">
                                <Image
                                    fill
                                    alt={product.name}
                                    src={
                                        product.imageUrl ??
                                        "https://placehold.co/800x800/png"
                                    }
                                    className="object-cover"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    {product.name}
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>

                            <Separator />

                            <Table>
                                <TableBody>

                                    <TableRow>
                                        <TableCell>SKU</TableCell>
                                        <TableCell className="text-right">
                                            {product.sku}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell className="text-right">
                                            {product.category}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Material</TableCell>
                                        <TableCell className="text-right">
                                            {product.material}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Stock</TableCell>
                                        <TableCell className="text-right">
                                            {product.stock}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Status</TableCell>
                                        <TableCell className="text-right">
                                            <Badge>
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Price</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ฿{Number(product.price).toLocaleString()}
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer
                                </CardTitle>

                                <CardDescription>
                                    Search an existing customer or create a new customer.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                        <Input
                                            className="pl-9"
                                            placeholder="Search by name, phone or email..."
                                            value={customerSearch}
                                            onChange={(e) =>
                                                setCustomerSearch(e.target.value)
                                            }
                                        />
                                    </div>

                                    <Dialog
                                        open={customerDialogOpen}
                                        onOpenChange={setCustomerDialogOpen}
                                    >
                                        <DialogTrigger >
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                New Customer
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Create Customer
                                                </DialogTitle>

                                                <DialogDescription>
                                                    Create a customer before creating the order.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <form
                                                onSubmit={customerForm.handleSubmit(
                                                    createCustomer
                                                )}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label>
                                                        Full Name
                                                    </Label>

                                                    <Input
                                                        {...customerForm.register(
                                                            "fullName"
                                                        )}
                                                    />

                                                    <p className="text-sm text-destructive">
                                                        {
                                                            customerForm.formState.errors
                                                                .fullName?.message
                                                        }
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Phone Number
                                                    </Label>

                                                    <Input
                                                        {...customerForm.register(
                                                            "phoneNumber"
                                                        )}
                                                    />

                                                    <p className="text-sm text-destructive">
                                                        {
                                                            customerForm.formState.errors
                                                                .phoneNumber?.message
                                                        }
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Email</Label>

                                                    <Input
                                                        {...customerForm.register(
                                                            "email"
                                                        )}
                                                    />

                                                    <p className="text-sm text-destructive">
                                                        {
                                                            customerForm.formState.errors
                                                                .email?.message
                                                        }
                                                    </p>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={creatingCustomer}
                                                >
                                                    {creatingCustomer ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Creating...
                                                        </>
                                                    ) : (
                                                        "Create Customer"
                                                    )}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <Separator />

                                {loadingCustomers ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-20" />
                                        <Skeleton className="h-20" />
                                        <Skeleton className="h-20" />
                                    </div>
                                ) : customers.length === 0 ? (
                                    <div className="rounded-lg border border-dashed py-12 text-center">
                                        <User className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                                        <h3 className="font-semibold">
                                            No Customers Found
                                        </h3>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Try another keyword or create a new
                                            customer.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {customers.map((customer) => {
                                            const active =
                                                selectedCustomer?.id === customer.id;

                                            return (
                                                <button
                                                    key={customer.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedCustomer(customer)
                                                    }
                                                    className={`w-full rounded-lg border p-4 text-left transition ${active
                                                        ? "border-primary bg-primary/5"
                                                        : "hover:border-primary"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-semibold">
                                                                {customer.fullName}
                                                            </p>

                                                            <p className="text-sm text-muted-foreground">
                                                                {customer.phoneNumber}
                                                            </p>

                                                            {customer.email && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    {customer.email}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {active && (
                                                            <Badge>
                                                                Selected
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Information
                                </CardTitle>

                                <CardDescription>
                                    Configure this order before submitting.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">
                                            Quantity
                                        </Label>

                                        <Input
                                            id="quantity"
                                            type="number"
                                            min={1}
                                            max={product.stock}
                                            {...orderForm.register("quantity")}
                                        />

                                        <p className="text-xs text-muted-foreground">
                                            Available stock: {product.stock}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <Label>
                                                Consignment
                                            </Label>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Customer takes the jewelry before full payment.
                                            </p>
                                        </div>

                                        <Switch
                                            checked={isConsignment}
                                            onCheckedChange={(checked: boolean) =>
                                                orderForm.setValue(
                                                    "isConsignment",
                                                    checked
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {isConsignment && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <p className="text-sm font-medium text-amber-700">
                                            Consignment Order
                                        </p>

                                        <p className="mt-2 text-sm text-amber-600">
                                            The product will be marked as
                                            <strong> CONSIGNED </strong>
                                            after this order is created. Stock quantity
                                            will not be deducted until the customer
                                            completes the payment.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Order Summary
                                </CardTitle>

                                <CardDescription>
                                    Review all information before creating the
                                    order.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <Table>
                                    <TableBody>

                                        <TableRow>
                                            <TableCell>
                                                Product
                                            </TableCell>

                                            <TableCell className="text-right font-medium">
                                                {product.name}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Customer
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {selectedCustomer
                                                    ? selectedCustomer.fullName
                                                    : "-"}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Quantity
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {quantity}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Unit Price
                                            </TableCell>

                                            <TableCell className="text-right">
                                                ฿
                                                {Number(
                                                    product.price
                                                ).toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Total Amount
                                            </TableCell>

                                            <TableCell className="text-right text-lg font-bold">
                                                ฿
                                                {totalPrice.toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Deposit Paid
                                            </TableCell>

                                            <TableCell className="text-right">
                                                ฿0
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Remaining
                                            </TableCell>

                                            <TableCell className="text-right font-semibold text-primary">
                                                ฿
                                                {totalPrice.toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Status
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Badge variant="secondary">
                                                    PENDING
                                                </Badge>
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>

                                <Separator />

                                <Button
                                    className="h-11 w-full"
                                    disabled={
                                        creatingOrder ||
                                        !selectedCustomer
                                    }
                                    onClick={createOrder}
                                >
                                    {creatingOrder ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Order...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Create Order
                                        </>
                                    )}
                                </Button>

                                {!selectedCustomer && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Please select a customer before creating
                                        the order.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}