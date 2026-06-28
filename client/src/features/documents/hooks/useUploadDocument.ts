import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "../api/documents.api";

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadDocument(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}
