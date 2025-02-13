<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "~/components/ui/toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const selectedFile = ref<string | null>(null);
const { toast } = useToast();
const router = useRouter();

const { createPayment } = usePayment();

const formSchema = toTypedSchema(
  z.object({
    payment_type: z.enum(["stage1", "stage2"], {
      errorMap: () => ({ message: "Please select a valid payment type" }),
    }),
    payment_file: z
      .instanceof(File, { message: "Payment file is required" })
      .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: "Only .doc, .docx, and .pdf files are allowed",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File size must be less than 2MB",
      }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const handleFileChange = (event: Event, field: any) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    const file = target.files[0];
    field.onChange(file);
    selectedFile.value = file.name;
  }
};

const onSubmit = form.handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append("payment_type", values.payment_type);
  formData.append("payment_file", values.payment_file);
  const result = await createPayment(formData);
  if (result.success) {
    toast({
      description: result.message,
    });
    router.push("/payment");
  } else {
    toast({
      description: result.message,
    });
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Add New Payment</h2>
        <form
          @submit="onSubmit"
          enctype="multipart/form-data"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <FormField v-slot="{ field }" name="payment_type">
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <select
                  v-bind="field"
                  class="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="" disabled selected>Pilih Payment Type</option>
                  <option value="stage1">Pembayaran Tahap 1</option>
                  <option value="stage2">Pembayaran Tahap 2</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="payment_file">
            <FormItem>
              <FormLabel>Upload Payment File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  @change="(event : Event) => handleFileChange(event, field)"
                  class="w-full border border-gray-300 rounded-md p-2"
                />
              </FormControl>
              <p v-if="selectedFile" class="text-sm text-gray-500 mt-1">
                📄 Selected file: {{ selectedFile }}
              </p>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="col-span-1 md:col-span-2">
            <Button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
