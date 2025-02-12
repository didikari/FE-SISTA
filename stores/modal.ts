//stores/modal.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);
  const modalContent = ref({
    title: "",
    description: "",
    type: "",
    id: null as string | null,
  });

  function openModal({
    title,
    description,
    type,
    id,
  }: {
    title: string;
    description: string;
    type: string;
    id?: string;
  }) {
    modalContent.value = { title, description, type, id: id ?? null };
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
    modalContent.value = { title: "", description: "", type: "", id: null };
  }

  return {
    isOpen,
    modalContent,
    openModal,
    closeModal,
  };
});
