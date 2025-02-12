<script setup>
import { defineProps, defineEmits } from "vue";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "radix-vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const emit = defineEmits();

const handleClose = () => {
  props.onClose();
};

const handleConfirm = () => {
  props.onConfirm();
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleClose" class="relative z-50">
    <DialogContent
      class="sm:max-w-md max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <DialogHeader>
        <DialogTitle>
          <VisuallyHidden asChild>{{ title }}</VisuallyHidden>
        </DialogTitle>
        <DialogDescription class="text-gray-600">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex justify-end gap-4">
        <Button
          variant="outline"
          @click="handleClose"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          @click="handleConfirm"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Yes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
