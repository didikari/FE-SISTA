<script setup lang="ts">
definePageMeta({
  name: "Exam List",
});
import { NuxtLayout } from "#components";
import { Plus } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { usePaymentStore } from "~/stores/payment/paymentStore";
import { useExamStore } from "~/stores/exam/examStore";

const router = useRouter();
const examStore = useExamStore();
const paymentStore = usePaymentStore();
const { fetchPayment } = usePayment();
const { getExam } = useExam();

const exams = computed(() => examStore.getExam);

const handleAddClick = () => {
  router.push("exam/create");
};

onMounted(async () => {
  fetchPayment;
  getExam;
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Exam List</h2>
          <Button
            class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Add"
            @click="handleAddClick"
            :disabled="!paymentStore.allPayment"
          >
            <Plus class="w-6 h-6" />
          </Button>
        </div>
        <Table v-if="exams > []">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Examiner</TableHead>
              <TableHead>Exam Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
              <TableHead
                v-if="
                  exams.some((exam) =>
                    ['rejected', 'cancelled'].includes(exam.status)
                  )
                "
                >Actions</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, index) in exams" :key="row.id">
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
                  v-if="row.exam_file"
                  :href="row.exam_file"
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
                  <RouterLink :to="`/exam/edit/${row.id}`"> Edit </RouterLink>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p v-else class="text-center text-gray-500 mt-4">
          No Exam data available
        </p>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
