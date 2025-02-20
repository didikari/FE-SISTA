<script lang="ts" setup>
definePageMeta({
  name: "Title List",
});
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTitleStore } from "~/stores/title/titleStore";
import { useTitle } from "~/composables/api/useTitle";
import { ref, onMounted } from "vue";
import { useToast } from "~/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { VisuallyHidden } from "radix-vue";
import { Plus } from "lucide-vue-next";

const titleStore = useTitleStore();
const { getTitle, deleteTitle } = useTitle();
const showModal = ref(false);
const selectedId = ref<string | null>(null);
const { toast } = useToast();
const loading = ref(false);
const router = useRouter();

const titles = computed(() => titleStore.titles);

const isAddDisabled = computed(() =>
  titles.value.some((title) => title.status !== null)
);

const handleAddClick = () => {
  if (!isAddDisabled.value) {
    router.push("/title/create");
  }
};

const confirmDelete = (id: string) => {
  selectedId.value = id;
  showModal.value = true;
};

const deleteAction = async () => {
  if (!selectedId.value) return;
  try {
    const response = await deleteTitle(selectedId.value);
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
    showModal.value = false;
    selectedId.value = null;
  }
};

onMounted(async () => {
  loading.value = true;
  await getTitle();
  loading.value = false;
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Title List</h2>
          <Button
            class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Add"
            :disabled="isAddDisabled"
            @click="handleAddClick"
          >
            <Plus class="w-6 h-6" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Proposal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(titleItem, index) in titles" :key="titleItem.id">
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell class="max-w-[100px] truncate">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="truncate block">{{ titleItem.title }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {{ titleItem.title }}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{{ titleItem.supervisor?.name || "N/A" }}</TableCell>
              <TableCell>
                <a
                  v-if="titleItem.proposal_file"
                  :href="titleItem.proposal_file"
                  download
                  class="text-blue-500 hover:underline"
                >
                  Download
                </a>
                <span v-else>N/A</span>
              </TableCell>
              <TableCell>{{ titleItem.status || "N/A" }}</TableCell>
              <TableCell class="flex gap-2">
                <Button class="bg-yellow-500 text-white py-1 px-3 rounded-md">
                  <RouterLink :to="`/title/edit/${titleItem.id}`">
                    Edit
                  </RouterLink>
                </Button>
                <Button
                  class="bg-red-600 text-white py-1 px-3 rounded-md"
                  @click="confirmDelete(titleItem.id)"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <!-- Modal Delete -->
        <Dialog v-model:open="showModal">
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                <VisuallyHidden asChild> Confirm Deletion </VisuallyHidden>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this title? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" @click="showModal = false"
                >Cancel</Button
              >
              <Button variant="destructive" @click="deleteAction"
                >Delete</Button
              >
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
