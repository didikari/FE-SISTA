//composables/api/userSupervisor.ts
import { useSupervisorStore } from "~/stores/supervisor/supervisorStore";
import { apiRequest } from "~/utils/apiRequest";
import type { Supervisor, SupervisorResponse } from "~/types/supervisor";

export const useSupervisor = () => {
  const supervisorStore = useSupervisorStore();

  const fetchSupervisors = async () => {
    if (supervisorStore.supervisors.length > 0) {
      return;
    }

    const { success, message, data } = await apiRequest<SupervisorResponse>(
      "/users/dosen"
    );

    if (success && Array.isArray(data)) {
      supervisorStore.setSupervisors(data || []);
      console.log(supervisorStore.getSupervisors);
      return data;
    } else {
      return { success: false, message };
    }
  };

  return {
    fetchSupervisors,
    supervisors: supervisorStore.getSupervisors,
    getSupervisorById: supervisorStore.getSupervisorById,
    getSupervisorByName: supervisorStore.getSupervisorByName,
  };
};
