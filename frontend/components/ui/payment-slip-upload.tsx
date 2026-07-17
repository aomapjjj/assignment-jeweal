import { useRef, useState, type ChangeEvent } from "react";

import Image from "next/image";

import {
    UploadCloud,
    Loader2,
    Trash2,
    RefreshCw,
    AlertCircle,
    ImageIcon,
} from "lucide-react";

import { useUploadThing } from "@/lib/uploadthing";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

interface PaymentSlipUploadProps {
    value?: string;
    disabled?: boolean;
    onChange: (url: string) => void;
    onRemove: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

const ACCEPT_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function PaymentSlipUpload({
    value,
    disabled,
    onChange,
    onRemove,
}: PaymentSlipUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>(
        value ?? null
    );

    const [uploading, setUploading] = useState(false);

    const [progress, setProgress] = useState(0);

    const [dragging, setDragging] = useState(false);

    const [error, setError] = useState("");

    const { startUpload } = useUploadThing(
        "paymentSlip",
        {
            onUploadBegin() {
                setUploading(true);
                setProgress(0);
                setError("");
            },

            onClientUploadComplete(files) {
                setUploading(false);
                setProgress(100);

                if (!files?.length) return;

                setPreview(files[0].ufsUrl);

                onChange(files[0].ufsUrl);
            },

            onUploadError(err) {
                setUploading(false);

                setProgress(0);

                setError(err.message);
            },
        }
    );

    async function uploadFile(file: File) {
        setError("");

        if (!ACCEPT_TYPES.includes(file.type)) {
            setError(
                "Only JPG, PNG and WEBP are supported."
            );
            return;
        }

        if (file.size > MAX_SIZE) {
            setError("Maximum file size is 5 MB.");
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setPreview(objectUrl);

        const interval = window.setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;

                return prev + Math.floor(Math.random() * 8) + 2;
            });
        }, 120);

        try {
            const result = await startUpload([file]);

            clearInterval(interval);

            if (!result?.length) {
                throw new Error("Upload failed.");
            }

            setProgress(100);

            setPreview(result[0].ufsUrl);

            onChange(result[0].ufsUrl);
        } catch (err) {
            clearInterval(interval);

            setProgress(0);

            setUploading(false);

            setPreview(value ?? null);

            setError(
                err instanceof Error
                    ? err.message
                    : "Upload failed."
            );
        }
    }

    async function handleChange(
        e: ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        await uploadFile(file);
    }

    function handleRemove() {
        setPreview(null);

        setProgress(0);

        setError("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        onRemove();
    }

    function openPicker() {
        if (disabled) return;

        inputRef.current?.click();
    }
    return (
        <div className="space-y-4">

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleChange}
            />

            {!preview && (

                <div
                    role="button"
                    tabIndex={0}
                    onClick={openPicker}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => {
                        setDragging(false);
                    }}
                    onDrop={async (e) => {
                        e.preventDefault();

                        setDragging(false);

                        const file =
                            e.dataTransfer.files?.[0];

                        if (!file) return;

                        await uploadFile(file);
                    }}
                    className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all",
                        dragging
                            ? "border-primary bg-primary/5"
                            : "border-muted",
                        disabled &&
                        "cursor-not-allowed opacity-50"
                    )}
                >

                    <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />

                    <p className="text-lg font-semibold">
                        Upload Payment Slip
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Drag & drop your receipt here
                    </p>

                    <p className="text-sm text-muted-foreground">
                        or click to browse
                    </p>

                    <Button
                        type="button"
                        variant="secondary"
                        className="mt-6"
                        disabled={disabled}
                    >
                        Choose Image
                    </Button>

                    <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        JPG • PNG • WEBP
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Maximum 5 MB
                    </div>

                </div>

            )}

            {preview && (

                <div className="space-y-4">

                    <div className="relative overflow-hidden rounded-xl border bg-muted">

                        <Image
                            src={preview}
                            alt="Payment Slip"
                            width={1200}
                            height={1200}
                            className="max-h-[520px] w-full object-contain"
                        />
                        {uploading && (

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">

                                <Loader2 className="mb-4 h-10 w-10 animate-spin" />

                                <p className="font-medium">
                                    Uploading payment slip...
                                </p>

                                <div className="mt-6 w-72">
                                    <Progress value={progress} />
                                </div>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {progress}%
                                </p>

                            </div>

                        )}

                    </div>

                    {!uploading && (

                        <div className="flex flex-wrap gap-2">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={openPicker}
                                disabled={disabled}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Replace
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleRemove}
                                disabled={disabled}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </Button>

                        </div>

                    )}

                </div>

            )}

            {error && (

                <Alert variant="destructive">

                    <AlertCircle className="h-4 w-4" />

                    <AlertDescription>
                        {error}
                    </AlertDescription>

                </Alert>

            )}
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">

                <div>

                    <p className="font-medium">
                        Supported formats
                    </p>

                    <p className="text-sm text-muted-foreground">
                        JPG, PNG, WEBP • Maximum 5 MB
                    </p>

                </div>

                <div className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Secure Upload
                </div>

            </div>

        </div>
    );
}