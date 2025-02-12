<script lang="ts" setup>
definePageMeta({
  name: "Guidance",
});
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ref, onMounted } from "vue";
import { useToast } from "~/components/ui/toast";
import { useGuidanceStore } from "~/stores/guidance/guidanceStore";
import Modal from "~/components/Modal.vue";
import { History, Plus } from "lucide-vue-next";

const guidanceStore = useGuidanceStore();
const { getGuidance, deleteGuidance } = useGuidance();
const { toast } = useToast();
const loading = ref(false);

const modalStore = useModalStore();
const isDeleteModalOpen = computed(
  () => modalStore.isOpen && modalStore.modalContent?.type === "delete"
);

const guidances = computed(() => guidanceStore.guidances);

const confirmDelete = (id: string) => {
  modalStore.openModal({
    title: "Confirm Deletion",
    description:
      "Are you sure you want to delete this item? This action cannot be undone.",
    type: "delete",
    id,
  });
};

const isAddDisabled = computed(() =>
  guidances.value.some((guidance) => guidance.status !== null)
);

// const guidanceId = computed(() => guidances.value[0].id);

// console.log(guidances.value[0].id);
// const router = useRouter();

// const handleAddClick = () => {
//   if (!isAddDisabled.value) {
//     router.push("/guidance/create"); // Atau '/title/create' jika sesuai
//   }
// };
const deleteAction = async () => {
  if (!modalStore.modalContent.id) return;
  try {
    const response = await deleteGuidance(modalStore.modalContent.id);
    if (response.success) {
      toast({
        description: response.message,
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  } finally {
    modalStore.closeModal();
  }
};

onMounted(async () => {
  loading.value = true;
  await getGuidance();
  loading.value = false;
});
</script>

<template>
  <NuxtLayout>
    <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Guidance List</h2>
          <div class="flex gap-2">
            <Button
              class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              title="Add"
              :disabled="isAddDisabled"
            >
              <Plus class="w-6 h-6" />
            </Button>
            <RouterLink to="/guidance/history">
              <Button
                class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                title="History"
              >
                <History class="w-6 h-6" />
              </Button>
            </RouterLink>
          </div>
        </div>

        <Table v-if="guidances.length > 0">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(guidance, index) in guidances" :key="guidance.id">
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell>{{ guidance.title?.title || "No Title" }}</TableCell>
              <TableCell>{{ guidance.supervisor?.name || "N/A" }}</TableCell>
              <TableCell>{{ guidance.status || "N/A" }}</TableCell>
              <TableCell class="flex gap-2">
                <Button class="bg-yellow-500 text-white py-1 px-3 rounded-md">
                  <RouterLink :to="`/guidance/edit/${guidance.id}`"
                    >Edit</RouterLink
                  >
                </Button>
                <Button
                  class="bg-red-600 text-white py-1 px-3 rounded-md"
                  @click="confirmDelete(guidance.id)"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p v-else class="text-center text-gray-500 mt-4">
          No guidance data available
        </p>

        <Modal
          :isOpen="isDeleteModalOpen"
          :onClose="modalStore.closeModal"
          :onConfirm="deleteAction"
          :title="modalStore.modalContent.title"
          :description="modalStore.modalContent.description"
        />
      </CardContent>
    </div>
  </NuxtLayout>
</template>
