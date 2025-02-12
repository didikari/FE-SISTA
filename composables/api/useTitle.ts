// composables/api/useTitle.ts
import { useTitleStore } from "~/stores/title/titleStore";
import { useToast } from "~/components/ui/toast";
import { onMounted } from "vue";
import { apiRequest } from "~/utils/apiRequest";
import type { Title } from "~/types/title";
import type { SupervisorResponse } from "~/types/supervisor";

export const useTitle = () => {
  const titleStore = useTitleStore();
  const { toast } = useToast();

  const showErrorToast = (message: string) => {
    toast({
      description: message,
    });
  };

  const getTitle = async () => {
    const { success, message, data } = await apiRequest<Title[]>(
      "/titles/student",
      { method: "GET" }
    );

    if (success) {
      titleStore.setTitle(data || []);
    } else {
      showErrorToast(message);
    }
  };

  const createTitle = async (formData: FormData) => {
    const { success, message, data } = await apiRequest<Title>(
      "/titles/store",
      {
        method: "POST",
        body: formData,
      }
    );

    if (success) {
      titleStore.addTitle(data!);
      return { success: true, message: "Title created successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchTitleById = async (id: string) => {
    const { success, message, data } = await apiRequest<Title>(
      `/titles/student/${id}`,
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

  const updateTitle = async (id: string, formData: FormData) => {
    const { success, message, data } = await apiRequest<Title>(
      `/titles/update/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (success) {
      titleStore.updateTitle(data!);
      return { success: true, message: "Title updated successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchSupervisors = async () => {
    if (titleStore.supervisors.length > 0) {
      return;
    }

    titleStore.setLoading(true);
    const { success, message, data } = await apiRequest<SupervisorResponse>(
      "/users/dosen"
    );

    if (success && Array.isArray(data)) {
      titleStore.setSupervisors(data || []);
      return data;
    } else {
      showErrorToast(message);
    }

    titleStore.setLoading(false);
  };

  const deleteTitle = async (id: string) => {
    const { success, message, data } = await apiRequest(
      `/titles/destroy/${id}`,
      {
        method: "DELETE",
      }
    );
    if (success) {
      titleStore.removeTitle(id);
      return { success: true, message: "Title delete successfully!" };
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    getTitle();
  });

  return {
    getTitle,
    createTitle,
    fetchSupervisors,
    updateTitle,
    fetchTitleById,
    deleteTitle,
  };
};
