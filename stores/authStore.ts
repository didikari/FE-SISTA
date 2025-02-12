// stores/authStore.ts
import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: useCookie<string | null>("auth_token").value || null,
    redirectPath: "/dashboard",
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      useCookie("auth_token").value = token;
    },

    clearToken() {
      this.token = null;
      useCookie("auth_token").value = null;
    },

    logout() {
      this.clearToken();
      const clearStores = useNuxtApp().$clearStores;
      clearStores();
      navigateTo("/auth/login");
    },
  },

  getters: {
    isAuthenticated(): boolean {
      return this.token !== null;
    },
  },
});
