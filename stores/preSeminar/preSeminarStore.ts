import type { PreSeminar } from "~/types/preSeminar";

export const usePreSeminarStore = defineStore("preSeminar", {
  state: () => ({
    preSeminars: [] as PreSeminar[],
  }),

  actions: {
    setPreSeminar(preSeminar: PreSeminar[]) {
      this.preSeminars = preSeminar;
    },
    updatePreSeminar(preSeminar: PreSeminar) {
      const index = this.preSeminars.findIndex((t) => t.id === preSeminar.id);
      if (index !== -1) {
        this.preSeminars[index] = preSeminar;
      }
    },
    clear() {
      this.preSeminars = [];
    },
  },

  getters: {
    getPreSeminar: (state) => state.preSeminars,
  },

  persist: true,
});
