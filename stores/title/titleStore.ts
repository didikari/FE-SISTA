// stores/title/titleStore.ts
import { defineStore } from "pinia";
import type { Title } from "~/types/title";
import type { Supervisor } from "~/types/supervisor";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useTitleStore = defineStore("title", {
  state: () => ({
    titles: [] as Title[],
    supervisors: [] as Supervisor[],
    loading: false,
  }),
  actions: {
    setTitle(titles: Title[]) {
      this.titles = titles;
    },
    addTitle(title: Title) {
      this.titles.push(title);
    },
    updateTitle(title: Title) {
      const index = this.titles.findIndex((t) => t.id === title.id);
      if (index !== -1) {
        this.titles[index] = title;
      }
      // this.titles.push(title);
    },
    removeTitle(id: string) {
      this.titles = this.titles.filter((t) => t.id !== id);
    },
    setSupervisors(supervisors: Supervisor[]) {
      this.supervisors = supervisors;
    },
    setLoading(status: boolean) {
      this.loading = status;
    },
    clear() {
      this.titles = [];
      this.supervisors = [];
    },
  },
  getters: {
    getTitles: (state) => state.titles,
    getSupervisors: (state) => state.supervisors,
    isLoading: (state) => state.loading,
  },
  persist: true,
});
