// composables/api/useSeminar.ts
import { onMounted } from "vue";
import { useSeminarStore } from "~/stores/seminar/seminarStore";
import type { Seminar } from "~/types/seminar";
import { apiRequest } from "~/utils/apiRequest";

export const useSeminar = () => {
  const seminarStore = useSeminarStore();

  const getSeminar = async () => {
    const { success, message, data } = await apiRequest<Seminar>("/seminars", {
      method: "GET",
    });
    if (success && data) {
      seminarStore.setSeminar(Array.isArray(data) ? data : [data]);
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const createSeminar = async (formData: FormData) => {
    const { success, message, data } = await apiRequest("/seminars/store", {
      method: "POST",
      body: formData,
    });
    if (success && data) {
      getSeminar();
      return { success: true, message: "Seminar created successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchSeminarById = async (id: string) => {
    const { success, message, data } = await apiRequest(`/seminars/${id}`, {
      method: "GET",
    });

    if (success) {
      return { success, message, data };
    } else {
      return { success, message, data: null };
    }
  };

  const updateSeminar = async (id: string, formData: FormData) => {
    const { success, message, data } = await apiRequest(
      `/seminars/update/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (success && data) {
      getSeminar();
      return { success: true, message: "PreSeminar updated successfully!" };
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    getSeminar();
  });

  return {
    updateSeminar,
    fetchSeminarById,
    getSeminar,
    createSeminar,
  };
};
