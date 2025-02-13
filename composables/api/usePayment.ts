import { usePaymentStore } from "~/stores/payment/paymentStore";

export const usePayment = () => {
  const paymentStore = usePaymentStore();
  const fetchPayment = async () => {
    const { success, message, data } = await apiRequest<PaymentResponse>(
      "/payments",
      { method: "GET" }
    );

    if (success && Array.isArray(data)) {
      paymentStore.setPayment(data);
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const createPayment = async (formData: FormData) => {
    const { success, message, data } = await apiRequest("/payments/store", {
      method: "POST",
      body: formData,
    });

    if (success && data) {
      fetchPayment();
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  };

  const updatePayment = async (id: string, formData: FormData) => {
    const { success, message, data } = await apiRequest(
      `/payments/update/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (success && data) {
      fetchPayment();
      return { success: true, message: "Payment updated successfully!" };
    } else {
      return { success: false, message };
    }
  };

  const fetchById = async (id: string) => {
    const { success, message, data } = await apiRequest(`/payments/${id}`, {
      method: "GET",
    });

    if (success && data) {
      return { success: true, message: "Payment get successfully!", data };
    } else {
      return { success: false, message };
    }
  };

  onMounted(() => {
    fetchPayment();
  });

  return {
    fetchById,
    updatePayment,
    fetchPayment,
    createPayment,
  };
};
