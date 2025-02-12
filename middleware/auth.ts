import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (
    !authStore.isAuthenticated &&
    !["/auth/login", "/auth/register"].includes(to.path)
  ) {
    authStore.redirectPath = to.fullPath;
    return navigateTo("/auth/login");
  }

  if (
    authStore.isAuthenticated &&
    ["/auth/login", "/auth/register"].includes(to.path)
  ) {
    return navigateTo("/dashboard");
  }
});
