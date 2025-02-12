<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { useGuidanceStore } from "~/stores/guidance/guidanceStore";

const { fetchHistories } = useGuidance();
const guidanceStore = useGuidanceStore();

const guidances = computed(() => guidanceStore.histories);

onMounted(async () => {
  await fetchHistories();
});
</script>
<template>
  <NuxtLayout>
    <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
      <CardContent class="w-full bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Guidance Histories</h2>
          <div class="flex gap-2">
            <RouterLink to="/guidance">
              <Button
                class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                title="Back Guidance"
              >
                <ArrowLeft class="w-6 h-6" />
              </Button>
            </RouterLink>
          </div>
        </div>

        <Table v-if="guidances.length > 0">
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(guidance, index) in guidances" :key="guidance.id">
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell>{{ guidance.notes || "N/A" }}</TableCell>
              <TableCell>{{ guidance.feedback || "N/A" }}</TableCell>
              <TableCell>{{ guidance.created_at || "N/A" }}</TableCell>
              <TableCell>{{ guidance.status || "N/A" }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p v-else class="text-center text-gray-500 mt-4">
          No guidance data available
        </p>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
