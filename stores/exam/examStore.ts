import type { Exam } from "~/types/exam";

export const useExamStore = defineStore("exam", {
  state: () => ({
    exams: [] as Exam[],
  }),

  actions: {
    setExam(exam: Exam[]) {
      this.exams = exam;
    },
    updateExam(exam: Exam) {
      const index = this.exams.findIndex((t) => t.id === exam.id);
      if (index !== -1) {
        this.exams[index] = exam;
      }
    },
    clear() {
      this.exams = [];
    },
  },

  getters: {
    getExam: (state) => state.exams,
  },

  persist: true,
});
