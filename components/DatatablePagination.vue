<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{ table: Table<any> }>();

const totalRowCount = computed(() => {
  const totalRows = props.table.getFilteredRowModel().rows;
  return totalRows.length;
});
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getState().pagination.pageIndex + 1 }} of
      {{ totalRowCount }} row(s) selected.
    </div>

    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select
          :model-value="`${props.table.getState().pagination.pageSize}`"
          @update:model-value="
            (value) => props.table.setPageSize(Number(value))
          "
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue
              :placeholder="`${props.table.getState().pagination.pageSize}`"
            />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        class="flex w-[100px] items-center justify-center text-sm font-medium"
      >
        Page {{ props.table.getState().pagination.pageIndex + 1 }} of
        {{ props.table.getPageCount() }}
      </div>

      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!props.table.getCanPreviousPage()"
          @click="props.table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeftIcon class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!props.table.getCanPreviousPage()"
          @click="props.table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeftIcon class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!props.table.getCanNextPage()"
          @click="props.table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRightIcon class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!props.table.getCanNextPage()"
          @click="props.table.setPageIndex(props.table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRightIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
