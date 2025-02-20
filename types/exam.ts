import type { Examiner, Student, Title } from "./preSeminar";
import type { Supervisor } from "./title";

export interface Exam {
  id: string;
  exam_file: string;
  seminar_date: string | null;
  submission_date: string;
  status: string;
  score: number | null;
  title?: Title;
  supervisor: Supervisor;
  examiner: Examiner;
  student?: Student;
}
