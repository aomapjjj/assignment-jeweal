"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    ArrowLeft,
    Loader2,
    Save,
    UserPlus,
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

import { Input } from "@/components/ui/input";

import { customerService } from "@/services/customer.service";
import { Label } from "@/components/ui/label";

const customerSchema = z.object({
    fullName: z
        .string()
        .min(2, "Customer name is required"),

    phoneNumber: z
        .string()
        .min(9, "Phone number is invalid"),

    email: z
        .string()
        .email("Invalid email")
        .optional()
        .or(z.literal("")),
});

type CustomerForm = z.infer<typeof customerSchema>;

export default function NewCustomerPage() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const form = useForm<CustomerForm>({
        resolver: zodResolver(customerSchema),

        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
        },
    });

    const createCustomer = useMutation({
        mutationFn: customerService.createCustomer,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customers"],
            });

            toast.success("Customer created successfully.");

            router.push("/dashboard/customers");
        },

        onError: (error: { response: { data: { message: string } } }) => {
            toast.error(
                error?.response?.data?.message ??
                "Unable to create customer."
            );
        },
    });


    const onSubmit = (values: CustomerForm) => {
        createCustomer.mutate({
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            email: values.email || undefined,
        });
    };

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
                                New Customer
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="mx-auto max-w-3xl space-y-6 p-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Create Customer
                        </h1>

                        <p className="text-muted-foreground">
                            Add a new customer to the jewelry management system.
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

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Customer Information
                            </CardTitle>

                            <CardDescription>
                                Enter customer details before creating the customer.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">
                                    Full Name
                                </Label>

                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    {...form.register("fullName")}
                                />

                                {form.formState.errors.fullName && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">
                                    Phone Number
                                </Label>

                                <Input
                                    id="phoneNumber"
                                    placeholder="0812345678"
                                    {...form.register("phoneNumber")}
                                />

                                {form.formState.errors.phoneNumber && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.phoneNumber.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email
                                    <span className="ml-1 text-muted-foreground">
                                        (Optional)
                                    </span>
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="customer@email.com"
                                    {...form.register("email")}
                                />

                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <h3 className="text-sm font-semibold">
                                    Notes
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Customer information will be available for future Orders,
                                    Deposits, Consignments and Sales. Phone numbers should be
                                    unique to avoid duplicate customer records.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                >
                                    <Link href="/dashboard/customers">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={createCustomer.isPending}
                                >
                                    {createCustomer.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Create Customer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}