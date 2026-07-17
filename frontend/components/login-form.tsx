"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/services/auth.service";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      localStorage.setItem(
        "accessToken",
        response.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      toast.success("Login successful.");

      router.push("/dashboard/products");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : "Invalid email or password.";

        toast.error(message);
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold">Jewelry Management</h1>
            <FieldDescription className="text-center">
              Don&apos;t have an account?
            </FieldDescription>
            <FieldDescription className="text-center">
              Please contact your administrator.
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">
              Email
            </FieldLabel>

            <Input
              id="email"
              type="email"
              placeholder="staff@company.com"
              autoComplete="email"
              value={email}
              disabled={loading}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              disabled={loading}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </Field>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}