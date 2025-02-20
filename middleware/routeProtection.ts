//middleware/routeProtection.ts
import { useGuidanceStore } from "~/stores/guidance/guidanceStore";
import { usePaymentStore } from "~/stores/payment/paymentStore";
import { useTitleStore } from "~/stores/title/titleStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const guidanceStore = useGuidanceStore();
  const titleStore = useTitleStore();
  const paymentStore = usePaymentStore();

  const guidances = computed(() => guidanceStore.guidances);
  const titles = computed(() => titleStore.titles);

  const isGuidanceAddDisabled = computed(() =>
    guidances.value.some((guidance) => guidance.status !== null)
  );

  const isTitleAddDisabled = computed(() =>
    titles.value.some((title) => title.status !== null)
  );

  if (to.path === "/guidance/create" && isGuidanceAddDisabled.value) {
    return navigateTo("/guidance");
  }

  if (to.path === "/pre-seminar/create" && !paymentStore.firstPayment) {
    return navigateTo("/pre-seminar");
  }

  if (to.path === "/exam/create" && !paymentStore.allPayment) {
    return navigateTo("/exam");
  }

  if (to.path === "/title/create" && isTitleAddDisabled.value) {
    return navigateTo("/title");
  }
});
