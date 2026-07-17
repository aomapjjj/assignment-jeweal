"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            router.replace("/dashboard/products");
        } else {
            router.replace("/auth/login");
        }
    }, [router]);

    return null;
}