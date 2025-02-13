export interface VerifiedBy {
  id: number;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  user_id: number;
  study_program_id: string;
  nim: string;
}

export interface Payment {
  id: string;
  payment_type: string;
  payment_file: string;
  student_id: string;
  verified_by?: VerifiedBy;
  status: string;
  created_at: string;
  verified_at?: string;
  student?: Student;
}

export interface PaymentResponse {
  code: number;
  message: string;
  data: Payment[];
}
