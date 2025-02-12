export type Supervisor = {
  id: string;
  name: string;
  nidn: string;
};

export type Title = {
  id: string;
  student_id: string;
  title: string;
  abstract: string;
  proposal_file: string;
  supervisor: Supervisor | null;
  status: "draft" | "submitted";
  created_at: string;
  updated_at: string;
};

export type TitleList = Title[];
