import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user/userStore";
import { useAuthStore } from "~/stores/authStore";
import { useNuxtApp } from "#app";
import type { MeResponse } from "~/types/user";

export const useUser = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const { $apiClient } = useNuxtApp();

  const fetchUserData = async () => {
    if (authStore.token) {
      try {
        const { success, message, data } = await apiRequest<MeResponse>(
          "/auth/me",
          { method: "POST" }
        );
        userStore.setUser(data?.user!);
        userStore.setPermissions(data?.permissions || []);
        userStore.setRoles(data?.roles || []);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    }
  };

  onMounted(() => {
    if (!userStore.user) {
      fetchUserData();
    }
  });

  const user = computed(() => userStore.user);

  return { user };
};
