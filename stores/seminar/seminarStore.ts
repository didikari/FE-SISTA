import type { Seminar } from "~/types/seminar";

export const useSeminarStore = defineStore("seminar", {
  state: () => ({
    seminars: [] as Seminar[],
  }),

  actions: {
    setSeminar(seminar: Seminar[]) {
      this.seminars = seminar;
    },
    updateSeminar(seminar: Seminar) {
      const index = this.seminars.findIndex((t) => t.id === seminar.id);
      if (index !== -1) {
        this.seminars[index] = seminar;
      }
    },
    clear() {
      this.seminars = [];
    },
  },

  getters: {
    getSeminar: (state) => state.seminars,
  },

  persist: true,
});
