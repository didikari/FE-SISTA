//composables/api/userLecturer.ts
import { apiRequest } from "~/utils/apiRequest";
import type { UserResponse } from "~/types/lecturer";
import { useLecturerStore } from "~/stores/lecturer/lecturerStore";

export const useLecturer = () => {
  const lecturerStore = useLecturerStore();

  const fetchLecturers = async () => {
    if (lecturerStore.lecturers.length > 0) {
      return;
    }

    const { success, message, data } = await apiRequest<UserResponse>(
      "/users/dosen"
    );

    if (success && Array.isArray(data)) {
      lecturerStore.setLecturers(data || []);
      console.log(lecturerStore.getLecturers);
      return data;
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    fetchLecturers();
  });

  return {
    fetchLecturers,
    lecturers: lecturerStore.getLecturers,
    getLecturerById: lecturerStore.getLecturerById,
    getLecturerByName: lecturerStore.getLecturerByName,
  };
};
