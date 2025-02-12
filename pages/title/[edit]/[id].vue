<script setup lang="ts">
definePageMeta({
  name: "Edit Title",
});
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

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
import { useTitleStore } from "~/stores/title/titleStore";
import { useTitle } from "~/composables/api/useTitle";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { Supervisor } from "~/types/supervisor";
import type { Title } from "~/types/title";
import TiptapEditor from "~/components/TiptapEditor.vue";
import { useSupervisorStore } from "~/stores/supervisor/supervisorStore";

const { toast } = useToast();
const route = useRoute();
const router = useRouter();
const { fetchSupervisors } = useSupervisor();
const { updateTitle, fetchTitleById } = useTitle();

const titleId = ref<string>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);
const loading = ref(false);
const titleData = ref<Title | null | undefined>(undefined);
const supervisorStore = useSupervisorStore();
const supervisors = ref<Supervisor[]>([]);
const selectedFile = ref<string | null>(null);
const content = ref("");
const supervisorId = ref<string>("");

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Schema validasi
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(20, "Title must be at least 20 characters"),
    abstract: z.string().min(2, "Abstract must be at least 500 characters"),
    supervisor_id: z.string().min(1, "Supervisor is required"),
    proposal_file: z
      .union([
        z
          .instanceof(File)
          .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
            message: "Only .doc, .docx, and .pdf files are allowed",
          })
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "File size must be less than 2MB",
          }),
        z.string(),
      ])
      .optional(),
    status: z.enum(["draft", "submitted"], {
      errorMap: () => ({ message: "Please select a valid status" }),
    }),
  })
);
const form = useForm({
  validationSchema: formSchema,
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
  } else {
    selectedFile.value = null;
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchSupervisors();
  supervisors.value = toRaw(supervisorStore.getSupervisors);
  const response = await fetchTitleById(titleId.value);

  if (response.success) {
    titleData.value = response.data;
    supervisorId.value = titleData.value?.supervisor?.id ?? "";
    content.value = titleData.value?.abstract ?? "";
    form.setValues({
      title: titleData.value?.title ?? "",
      abstract: titleData.value?.abstract ?? "",
      supervisor_id: supervisorId.value,
      proposal_file: titleData.value?.proposal_file ?? "",
      status: titleData.value?.status ?? "draft",
    });
  }
  loading.value = false;
});

const onSubmit = form.handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("abstract", values.abstract);
  formData.append("supervisor_id", supervisorId.value);
  formData.append("status", values.status);

  if (values.proposal_file instanceof File) {
    formData.append("proposal_file", values.proposal_file);
  } else if (typeof values.proposal_file === "string") {
    formData.append("proposal_file", values.proposal_file);
  }
  formData.append("_method", "PATCH");

  const result = await updateTitle(titleId.value, formData);

  if (result.success) {
    toast({ description: result.message });
    router.push("/title");
  } else {
    toast({ description: result.message });
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Edit Title</h2>
        <form
          @submit="onSubmit"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
          enctype="multipart/form-data"
        >
          <!-- Title -->
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

          <!-- Supervisor -->
          <FormField v-slot="{ field }" name="supervisor_id">
            <FormItem>
              <FormLabel>Supervisor</FormLabel>
              <FormControl>
                <Select v-model="supervisorId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="supervisor in supervisors"
                      :key="supervisor.lecturer.id"
                      :value="supervisor.lecturer.id"
                    >
                      {{ supervisor.name }}
                      <!-- Pastikan `name` sudah tersedia -->
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage name="supervisor_id" />
            </FormItem>
          </FormField>

          <!-- Abstract -->
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
                  @change="(event: Event) => handleFileChange(event, field)"
                  class="w-full border border-gray-300 rounded-md p-2"
                />
              </FormControl>
              <p v-if="selectedFile" class="text-sm text-gray-500 mt-1">
                📄 Selected file: {{ selectedFile }}
              </p>
              <!-- Menampilkan file yang sudah ada -->
              <p
                v-if="titleData && titleData.proposal_file"
                class="text-sm text-gray-500 mt-1"
              >
                📄 Existing file:
                <a
                  :href="titleData.proposal_file"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  Download Proposal
                </a>
              </p>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Status -->
          <FormField v-slot="{ field }" name="status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  v-bind="field"
                  class="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                </select>
              </FormControl>
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
