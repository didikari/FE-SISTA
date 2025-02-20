import type { Supervisor } from "./title";

export interface Title {
  id: string;
  title: string;
}

export interface Examiner {
  id: string;
  name: string;
  nidn: string;
}

export interface Student {
  id: string;
  name: string;
  nim: string;
}

export interface PreSeminar {
  id: string;
  pre_seminar_file: string;
  seminar_date: string | null;
  submission_date: string;
  status: string;
  score: number | null;
  title?: Title;
  supervisor: Supervisor;
  examiner: Examiner;
  student?: Student;
}
