<script setup lang="ts">
definePageMeta({
  name: "Pre-Seminar List",
});
import { NuxtLayout } from "#components";
import { Plus } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { usePaymentStore } from "~/stores/payment/paymentStore";
import { usePreSeminarStore } from "~/stores/preSeminar/preSeminarStore";

const router = useRouter();
const preSeminarStore = usePreSeminarStore();
const paymentStore = usePaymentStore();
const { getPreSeminar } = usePreSeminar();
const { fetchPayment } = usePayment();

const preSeminars = computed(() => preSeminarStore.getPreSeminar);

const handleAddClick = () => {
  router.push("pre-seminar/create");
};

onMounted(async () => {
  fetchPayment;
  getPreSeminar;
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Pre-Seminar List</h2>
          <Button
            class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Add"
            :disabled="!paymentStore.firstPayment"
            @click="handleAddClick"
          >
            <Plus class="w-6 h-6" />
          </Button>
        </div>
        <Table v-if="preSeminars">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Examiner</TableHead>
              <TableHead>Pre Seminar Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
              <TableHead
                v-if="
                  preSeminars.some((preSeminar) =>
                    ['rejected', 'cancelled'].includes(preSeminar.status)
                  )
                "
                >Actions</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, index) in preSeminars" :key="row.id">
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell class="max-w-[100px] truncate">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="truncate block">{{ row.title?.title }}</span>
                  </TooltipTrigger>
                  <TooltipContent> {{ row.title?.title }} </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{{ row.supervisor?.name || "N/A" }}</TableCell>
              <TableCell>{{ row.examiner?.name || "N/A" }}</TableCell>
              <TableCell>{{ row.seminar_date || "N/A" }}</TableCell>
              <TableCell>{{ row.status }}</TableCell>
              <TableCell>
                <a
                  v-if="row.pre_seminar_file"
                  :href="row.pre_seminar_file"
                  download
                  class="text-blue-500 hover:underline"
                >
                  Download
                </a>
                <span v-else>N/A</span>
              </TableCell>
              <TableCell
                v-if="row.status === 'rejected' || row.status === 'cancelled'"
                class="flex gap-2"
              >
                <Button class="bg-yellow-500 text-white py-1 px-3 rounded-md">
                  <RouterLink :to="`/pre-seminar/edit/${row.id}`">
                    Edit
                  </RouterLink>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p v-else class="text-center text-gray-500 mt-4">
          No PreSeminar data available
        </p>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
