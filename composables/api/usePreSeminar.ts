// composables/api/useGuidance.ts
import { onMounted } from "vue";
import { usePreSeminarStore } from "~/stores/preSeminar/preSeminarStore";
import type { PreSeminar } from "~/types/preSeminar";
import { apiRequest } from "~/utils/apiRequest";

export const usePreSeminar = () => {
  const preSeminarStore = usePreSeminarStore();

  const getPreSeminar = async () => {
    const { success, message, data } = await apiRequest<PreSeminar>(
      "/pre-seminars",
      {
        method: "GET",
      }
    );
    if (success && data) {
      preSeminarStore.setPreSeminar(Array.isArray(data) ? data : [data]);
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const createPreSeminar = async (formData: FormData) => {
    const { success, message, data } = await apiRequest("/pre-seminars/store", {
      method: "POST",
      body: formData,
    });

    if (success && data) {
      getPreSeminar();
      return { success: true, message: "PreSeminar created successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchPreSeminarById = async (id: string) => {
    const { success, message, data } = await apiRequest(`/pre-seminars/${id}`, {
      method: "GET",
    });

    if (success) {
      return { success, message, data };
    } else {
      return { success, message, data: null };
    }
  };

  const updatePreSeminar = async (id: string, formData: FormData) => {
    const { success, message, data } = await apiRequest(
      `/pre-seminars/update/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (success && data) {
      getPreSeminar();
      return { success: true, message: "PreSeminar updated successfully!" };
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    getPreSeminar();
  });

  return {
    updatePreSeminar,
    fetchPreSeminarById,
    getPreSeminar,
    createPreSeminar,
  };
};
