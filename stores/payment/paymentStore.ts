import type { Payment } from "~/types/payment";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    payments: [] as Payment[],
  }),

  actions: {
    setPayment(payments: Payment[]) {
      this.payments = payments;
    },
    clear() {
      this.payments = [];
    },
  },

  getters: {
    getPayment: (state) => state.payments,
  },

  persist: true,
});
