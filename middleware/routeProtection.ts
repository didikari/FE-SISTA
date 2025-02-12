import { useGuidanceStore } from "~/stores/guidance/guidanceStore";
import { useTitleStore } from "~/stores/title/titleStore"; // Import store untuk title

export default defineNuxtRouteMiddleware((to, from) => {
  const guidanceStore = useGuidanceStore();
  const titleStore = useTitleStore(); // Ambil store untuk title

  const guidances = computed(() => guidanceStore.guidances);
  const titles = computed(() => titleStore.titles); // Ambil data title

  const isGuidanceAddDisabled = computed(() =>
    guidances.value.some((guidance) => guidance.status !== null)
  );

  const isTitleAddDisabled = computed(() =>
    titles.value.some((title) => title.status !== null)
  );

  // Cek untuk /guidance/create, akses diblokir jika ada guidance dengan status !== null
  if (to.path === "/guidance/create" && isGuidanceAddDisabled.value) {
    return navigateTo("/guidance");
  }

  // Cek untuk /title/create, akses diblokir jika ada title dengan status !== null
  if (to.path === "/title/create" && isTitleAddDisabled.value) {
    return navigateTo("/title");
  }
});
