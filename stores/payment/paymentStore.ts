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
    firstPayment: (state) => {
      return state.payments.some(
        (payment) =>
          payment.status === "approved" && payment.payment_type === "stage1"
      );
    },

    allPayment: (state) => {
      const hasStage1 = state.payments.some(
        (payment) =>
          payment.status === "approved" && payment.payment_type === "stage1"
      );

      const hasStage2 = state.payments.some(
        (payment) =>
          payment.status === "approved" && payment.payment_type === "stage2"
      );

      return hasStage1 && hasStage2;
    },
  },

  persist: true,
});
