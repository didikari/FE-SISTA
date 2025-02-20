//stores/lecturer/lecturerStore.ts
import { defineStore } from "pinia";
import type { User } from "~/types/lecturer";

export const useLecturerStore = defineStore("lecturer", {
  state: () => ({
    lecturers: [] as User[],
  }),

  actions: {
    setLecturers(lecturers: User[]) {
      this.lecturers = lecturers;
    },
  },

  getters: {
    getLecturers: (state) => state.lecturers,
    getLecturerById: (state) => (id: string) =>
      state.lecturers.find((s) => String(s.id) === id) || null,
    getLecturerByName: (state) => (name: string) =>
      state.lecturers.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      ) || null,
  },

  persist: true,
});
