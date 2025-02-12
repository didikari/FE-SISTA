<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref, onMounted } from "vue";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "~/components/ui/toast";
import { useTitle } from "~/composables/api/useTitle";
import TiptapEditor from "~/components/TiptapEditor.vue";
import { useSupervisorStore } from "~/stores/supervisor/supervisorStore";

const content = ref("");
const { toast } = useToast();
const router = useRouter();
const supervisorStore = useSupervisorStore();
const { createTitle } = useTitle();
const { fetchSupervisors } = useSupervisor();

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Validasi dengan Zod
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(20, "Title must be at least 20 characters"),
    abstract: z.string().min(100, "Abstract must be at least 100 characters"),
    supervisor_id: z.string().min(1, "Supervisor is required"),
    status: z.enum(["draft", "submitted"], {
      errorMap: () => ({ message: "Please select a valid status" }),
    }),
    proposal_file: z
      .instanceof(File, { message: "Proposal file is required" })
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
const selectedFile = ref<string | null>(null);

onMounted(async () => {
  fetchSupervisors();
});
const { value: abstract } = useField("abstract");

watch(content, (newContent) => {
  abstract.value = newContent;
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
  formData.append("title", values.title);
  formData.append("abstract", values.abstract);
  formData.append("supervisor_id", values.supervisor_id);
  formData.append("proposal_file", values.proposal_file);
  formData.append("status", values.status);
  const result = await createTitle(formData);
  if (result.success) {
    toast({
      description: result.message,
    });
    router.push("/title");
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
        <h2 class="text-2xl font-semibold mb-6">Add New Title</h2>
        <form
          @submit="onSubmit"
          enctype="multipart/form-data"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <FormField v-slot="{ field }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Title"
                  v-bind="field"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="supervisor_id">
            <FormItem>
              <FormLabel>Supervisor</FormLabel>
              <FormControl>
                <select
                  v-bind="field"
                  class="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="" disabled selected>Pilih Supervisor</option>
                  <option
                    v-for="supervisor in supervisorStore.getSupervisors"
                    :key="supervisor.id"
                    :value="supervisor.lecturer.id"
                  >
                    {{ supervisor.name }}
                  </option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="abstract">
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <TiptapEditor v-model="content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="proposal_file">
            <FormItem>
              <FormLabel>Upload Proposal</FormLabel>
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

          <FormField v-slot="{ field }" name="status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  v-bind="field"
                  class="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="" disabled selected>Pilih Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                </select>
              </FormControl>
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
