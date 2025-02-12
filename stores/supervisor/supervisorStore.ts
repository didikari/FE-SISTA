import { defineStore } from "pinia";
import type { Supervisor } from "~/types/supervisor";

export const useSupervisorStore = defineStore("supervisor", {
  state: () => ({
    supervisors: [] as Supervisor[],
  }),

  actions: {
    setSupervisors(supervisors: Supervisor[]) {
      this.supervisors = supervisors;
    },
  },

  getters: {
    getSupervisors: (state) => state.supervisors,
    getSupervisorById: (state) => (id: string) =>
      state.supervisors.find((s) => String(s.id) === id) || null,
    getSupervisorByName: (state) => (name: string) =>
      state.supervisors.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      ) || null,
  },

  persist: true,
});
