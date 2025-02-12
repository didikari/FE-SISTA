export type Supervisor = {
  id: string;
  name: string;
  nidn: string;
};

export type Title = {
  id: string;
  title: string;
  abstract: string;
};

export type Guidance = {
  id: string;
  student_id: string;
  title: Title; // Menambahkan tipe title sesuai response
  proposal_file: string;
  supervisor: Supervisor | null;
  status: "pending" | "revision" | "rejected" | "approved"; // Tambahkan kemungkinan lain jika ada
  guidance_date: string;
  created_at: string;
  updated_at: string;
};

export type History = {
  id: string;
  guidance_id: string;
  guidance_date: string;
  notes: string;
  feedback: string;
  status: "pending" | "completed";
  created_at: string;
  updated_at: string;
};

export type GuidanceList = Guidance[];

export type GuidanceResponse = {
  code: number;
  message: string;
  data: Guidance;
};
