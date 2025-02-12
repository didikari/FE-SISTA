// stores/guidance/guidanceStore.ts
import { defineStore } from "pinia";
import type { Guidance, History } from "~/types/guidance";
import type { Supervisor } from "~/types/supervisor";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useGuidanceStore = defineStore("guidance", {
  state: () => ({
    guidances: [] as Guidance[],
    histories: [] as History[],
    supervisors: [] as Supervisor[],
    loading: false,
  }),
  actions: {
    setGuidance(guidances: Guidance[]) {
      this.guidances = guidances;
    },
    setHistory(histories: History[]) {
      this.histories = histories;
    },
    addGuidance(guidance: Guidance) {
      this.guidances.push(guidance);
    },
    updateGuidance(guidance: Guidance) {
      const index = this.guidances.findIndex((t) => t.id === guidance.id);
      if (index !== -1) {
        this.guidances[index] = guidance;
      }
      // this.guidances.push(title);
    },
    removeGuidance(id: string) {
      this.guidances = this.guidances.filter((t) => t.id !== id);
    },
    setSupervisors(supervisors: Supervisor[]) {
      this.supervisors = supervisors;
    },
    setLoading(status: boolean) {
      this.loading = status;
    },
    clear() {
      this.guidances = [];
      this.supervisors = [];
    },
  },
  getters: {
    getGuidances: (state) => state.guidances,
    getSupervisors: (state) => state.supervisors,
    isLoading: (state) => state.loading,
  },
  persist: true,
});
