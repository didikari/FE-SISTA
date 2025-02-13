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
import type { Payment } from "~/types/payment";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf"];
const route = useRoute();
const selectedFile = ref<string | null>(null);
const paymentData = ref<Payment | null | undefined>(undefined);
const paymentId = ref<string>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);

const { toast } = useToast();
const router = useRouter();

const { updatePayment, fetchById } = usePayment();

const formSchema = toTypedSchema(
  z.object({
    payment_file: z
      .instanceof(File, { message: "Payment file is required" })
      .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: "Only .pdf files are allowed",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File size must be less than 2MB",
      })
      .optional(),
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
  if (values.payment_file instanceof File) {
    formData.append("payment_file", values.payment_file);
  } else if (typeof values.payment_file === "string") {
    formData.append("payment_file", values.payment_file);
  }
  formData.append("_method", "PATCH");

  const result = await updatePayment(paymentId.value, formData);
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

onMounted(async () => {
  const response = await fetchById(paymentId.value);
  if (response.success && response.data) {
    paymentData.value = response.data as Payment;
    selectedFile.value = paymentData.value?.payment_file ?? null;
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Edit Payment</h2>
        <form
          @submit="onSubmit"
          class="grid grid-cols-1 gap-4"
          enctype="multipart/form-data"
        >
          <FormField v-slot="{ field }" name="payment_file">
            <FormItem>
              <FormLabel>Upload Payment File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf"
                  @change="(event: Event) => handleFileChange(event, field)"
                  class="w-full border border-gray-300 rounded-md p-2"
                />
              </FormControl>
              <p v-if="selectedFile" class="text-sm text-gray-500 mt-1">
                📄 Selected file: {{ selectedFile }}
              </p>
              <p
                v-if="paymentData?.payment_file"
                class="text-sm text-gray-500 mt-1"
              >
                📄 Existing file:
                <a
                  :href="paymentData.payment_file"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  Download Proposal
                </a>
              </p>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Submit Button -->
          <div class="col-span-1 md:col-span-2">
            <Button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
