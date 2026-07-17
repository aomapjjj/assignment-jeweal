import api from "@/lib/axios";

import { UploadSlipResponse } from "@/types/payment";

export const uploadService = {
    async uploadSlip(file: File): Promise<UploadSlipResponse> {
        const formData = new FormData();

        formData.append("file", file);

        const { data } = await api.post<UploadSlipResponse>(
            "/uploads/slip",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },
};