import { useToast } from "@/hooks/use-toast";
import { useForm as useReactHookForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface UseFormOptions<T extends z.ZodType> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  endpoint: string;
  successMessage: string;
  errorMessage: string;
  onSuccessCallback?: () => void;
}

export function useForm<T extends z.ZodType>({
  schema,
  defaultValues = {},
  endpoint,
  successMessage,
  errorMessage,
  onSuccessCallback,
}: UseFormOptions<T>): UseFormReturn<z.infer<T>> & {
  isSubmitting: boolean;
  handleFormSubmit: (data: z.infer<T>) => void;
} {
  const { toast } = useToast();
  
  const form = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });
  
  const mutation = useMutation({
    mutationFn: (data: z.infer<T>) => {
      return apiRequest("POST", endpoint, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: successMessage,
      });
      form.reset();
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });
    },
  });
  
  const handleFormSubmit = (data: z.infer<T>) => {
    mutation.mutate(data);
  };
  
  return {
    ...form,
    isSubmitting: mutation.isPending,
    handleFormSubmit,
  };
}
