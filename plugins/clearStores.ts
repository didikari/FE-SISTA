// plugins/clearStores.js
import { useGuidanceStore } from "~/stores/guidance/guidanceStore";
import { usePaymentStore } from "~/stores/payment/paymentStore";
import { usePreSeminarStore } from "~/stores/preSeminar/preSeminarStore";
import { useTitleStore } from "~/stores/title/titleStore";
import { useUserStore } from "~/stores/user/userStore";

export default defineNuxtPlugin((nuxtApp) => {
  const stores = [
    useGuidanceStore,
    useTitleStore,
    useUserStore,
    usePaymentStore,
    usePreSeminarStore,
  ];

  const clearStores = () => {
    stores.forEach((store) => {
      const storeInstance = store();
      if (storeInstance.clear) storeInstance.clear();
    });
  };

  nuxtApp.provide("clearStores", clearStores);
});
