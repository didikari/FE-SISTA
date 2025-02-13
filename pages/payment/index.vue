<script setup lang="ts">
import { NuxtLayout } from "#components";
import { Plus } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { usePaymentStore } from "~/stores/payment/paymentStore";

const router = useRouter();
const paymentStore = usePaymentStore();
const { fetchPayment } = usePayment();

const payments = computed(() => paymentStore.getPayment);

const handleAddClick = () => {
  router.push("payment/create");
};

onMounted(async () => {
  fetchPayment;
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Payment List</h2>
          <Button
            class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Add"
            @click="handleAddClick"
          >
            <Plus class="w-6 h-6" />
          </Button>
        </div>
        <Table v-if="payments">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>VerifiedBy</TableHead>
              <TableHead>PaymentFile</TableHead>
              <TableHead
                v-if="payments.some((payment) => payment.status === 'rejected')"
                >Actions</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, index) in payments" :key="row.id">
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell class="max-w-[100px] truncate">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="truncate block">{{ row.payment_type }}</span>
                  </TooltipTrigger>
                  <TooltipContent> {{ row.payment_type }} </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{{ row.created_at }}</TableCell>
              <TableCell>{{ row.status }}</TableCell>
              <TableCell>{{ row.verified_by?.name || "N/A" }}</TableCell>
              <TableCell>
                <a
                  v-if="row.payment_file"
                  :href="row.payment_file"
                  download
                  class="text-blue-500 hover:underline"
                >
                  Download
                </a>
                <span v-else>N/A</span>
              </TableCell>
              <TableCell v-if="row.status === 'rejected'" class="flex gap-2">
                <Button class="bg-yellow-500 text-white py-1 px-3 rounded-md">
                  <RouterLink :to="`/payment/edit/${row.id}`">
                    Edit
                  </RouterLink>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p v-else class="text-center text-gray-500 mt-4">
          No payment data available
        </p>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
