export interface Lecturer {
  id: string;
  user_id: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  lecturer: Lecturer;
}

export interface UserResponse {
  code: number;
  message: string;
  data: User[];
}
