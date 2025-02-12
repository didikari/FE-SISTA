// plugins/apiClient.ts
import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/authStore";
import { navigateTo } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();

  const apiClient = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {};

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }

    const method =
      (options.method?.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE") ||
      "GET";

    try {
      const response = await $fetch<T>(
        `${useRuntimeConfig().public.apiBase}${endpoint}`,
        {
          ...options,
          method,
          headers: {
            ...headers,
            ...(options.headers || {}),
          },
        }
      );

      return response;
    } catch (error: any) {
      const newToken = await refreshToken();
      if (newToken) {
        authStore.setToken(newToken);
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await $fetch<T>(
          `${useRuntimeConfig().public.apiBase}${endpoint}`,
          {
            ...options,
            method,
            headers: {
              ...headers,
              ...(options.headers || {}),
            },
          }
        );

        return retryResponse;
      }

      throw error;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const response = await $fetch<{ access_token: string }>(
        `${useRuntimeConfig().public.apiBase}/auth/refresh`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      return response.access_token;
    } catch (error) {
      authStore.logout();
      navigateTo("/auth/login");
      throw error;
    }
  };

  nuxtApp.provide("apiClient", apiClient);
});
