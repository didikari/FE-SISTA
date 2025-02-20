// composables/api/useExam.ts
import { onMounted } from "vue";
import { useExamStore } from "~/stores/exam/examStore";
import type { Exam } from "~/types/exam";
import { apiRequest } from "~/utils/apiRequest";

export const useExam = () => {
  const examStore = useExamStore();

  const getExam = async () => {
    const { success, message, data } = await apiRequest<Exam>("/exams", {
      method: "GET",
    });
    if (success && data) {
      examStore.setExam(Array.isArray(data) ? data : [data]);
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const createExam = async (formData: FormData) => {
    const { success, message, data } = await apiRequest("/exams/store", {
      method: "POST",
      body: formData,
    });

    if (success && data) {
      getExam();
      return { success: true, message: "Exam created successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchExamById = async (id: string) => {
    const { success, message, data } = await apiRequest(`/exams/${id}`, {
      method: "GET",
    });

    if (success) {
      return { success, message, data };
    } else {
      return { success, message, data: null };
    }
  };

  const updateExam = async (id: string, formData: FormData) => {
    const { success, message, data } = await apiRequest(`/exams/update/${id}`, {
      method: "POST",
      body: formData,
    });

    if (success && data) {
      getExam();
      return { success: true, message: "Exam updated successfully!" };
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    getExam();
  });

  return {
    updateExam,
    fetchExamById,
    getExam,
    createExam,
  };
};
