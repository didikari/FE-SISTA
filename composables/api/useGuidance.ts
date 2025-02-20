// composables/api/useGuidance.ts
import { useGuidanceStore } from "~/stores/guidance/guidanceStore";
import { onMounted } from "vue";
import { apiRequest } from "~/utils/apiRequest";
import type { Guidance, History } from "~/types/guidance";

export const useGuidance = () => {
  const guidanceStore = useGuidanceStore();

  const getGuidance = async () => {
    const { success, message, data } = await apiRequest<Guidance>(
      "/guidances",
      { method: "GET" }
    );

    if (success && data) {
      guidanceStore.setGuidance(Array.isArray(data) ? data : [data]);
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const createGuidance = async (formData: FormData) => {
    const { success, message, data } = await apiRequest<Guidance>(
      "/guidances/store",
      {
        method: "POST",
        body: formData,
      }
    );

    if (success) {
      guidanceStore.addGuidance(data!);
      return { success: true, message: "Guidance created successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchGuidanceById = async (id: string) => {
    const { success, message, data } = await apiRequest<Guidance>(
      `/guidances/student/${id}`,
      {
        method: "GET",
      }
    );

    if (success) {
      return { success, message, data };
    } else {
      return { success, message, data: null };
    }
  };

  const fetchHistories = async () => {
    const { success, message, data } = await apiRequest<History[]>(
      "/guidances/histories",
      { method: "GET" }
    );

    if (success && data) {
      guidanceStore.setHistory(data);
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const updateGuidance = async (id: string, formData: FormData) => {
    const { success, message, data } = await apiRequest<Guidance>(
      `/guidances/update/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (success) {
      guidanceStore.updateGuidance(data!);
      return { success: true, message: "Guidance updated successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const deleteGuidance = async (id: string) => {
    const { success, message, data } = await apiRequest(
      `/titles/destroy/${id}`,
      {
        method: "DELETE",
      }
    );

    if (success) {
      guidanceStore.removeGuidance(id);
      return { success: true, message: "Title delete successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const printGuidance = async (id: string) => {
    const { success, message, data } = await apiRequest(
      `/pdf/generate/guidance/${id}`,
      {
        method: "GET",
      }
    );

    if (success && data) {
      return { data, success: true, message: "Generate PDF successfully!" };
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    getGuidance();
  });

  return {
    fetchHistories,
    printGuidance,
    getGuidance,
    createGuidance,
    updateGuidance,
    fetchGuidanceById,
    deleteGuidance,
  };
};
