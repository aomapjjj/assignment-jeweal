import { User } from "@/types/user";

export function getCurrentUser(): User | null {
    if (typeof window === "undefined") {
        return null;
    }

    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

export function getAccessToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("accessToken");
}

export function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
}