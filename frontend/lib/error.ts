import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Unexpected error occurred.";
  }

  const message = error.response?.data?.message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return error.message || "Request failed.";
}