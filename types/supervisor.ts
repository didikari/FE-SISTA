export interface Lecturer {
  id: string;
  user_id: number;
}

export interface Supervisor {
  id: number;
  name: string;
  email: string;
  lecturer: Lecturer;
}

export interface SupervisorResponse {
  code: number;
  message: string;
  data: Supervisor[];
}
