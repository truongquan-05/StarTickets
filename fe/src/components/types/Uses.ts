
export interface Genre {
  id: number;
  name: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string; // URL ảnh đại diện
  role: "admin" | "user";
  isActive: boolean;
}