<script setup lang="ts">
definePageMeta({
  name: "Edit Guidance",
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
import { useTitle } from "~/composables/api/useTitle";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { Supervisor } from "~/types/supervisor";
import TiptapEditor from "~/components/TiptapEditor.vue";
import { useSupervisorStore } from "~/stores/supervisor/supervisorStore";
import type { Guidance } from "~/types/guidance";

const { toast } = useToast();
const route = useRoute();
const router = useRouter();
const { fetchSupervisors } = useSupervisor();
const { updateGuidance, fetchGuidanceById } = useGuidance();

const guidanceId = ref<string>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);

const loading = ref(false);
const guidanceData = ref<Guidance | null | undefined>(undefined);
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
  const response = await fetchGuidanceById(guidanceId.value);

  if (response.success) {
    guidanceData.value = response.data;
    supervisorId.value = guidanceData.value?.supervisor?.id ?? "";
    form.setValues({
      supervisor_id: supervisorId.value,
      proposal_file: guidanceData.value?.proposal_file ?? "",
    });
  }
  loading.value = false;
});

const onSubmit = form.handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append("supervisor_id", supervisorId.value);
  formData.append("status", values.status);

  if (values.proposal_file instanceof File) {
    formData.append("proposal_file", values.proposal_file);
  } else if (typeof values.proposal_file === "string") {
    formData.append("proposal_file", values.proposal_file);
  }
  formData.append("_method", "PATCH");

  const result = await updateGuidance(guidanceId.value, formData);

  if (result.success) {
    toast({ description: result.message });
    router.push("/guidance");
  } else {
    toast({ description: result.message });
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Edit Guidance</h2>
        <form
          @submit="onSubmit"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
          enctype="multipart/form-data"
        >
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
                v-if="guidanceData && guidanceData.proposal_file"
                class="text-sm text-gray-500 mt-1"
              >
                📄 Existing file:
                <a
                  :href="guidanceData.proposal_file"
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
