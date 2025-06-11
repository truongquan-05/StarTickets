
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
  avatar: string; 
  role: "admin" | "user";
  trang_thai: boolean;
}
export interface Food {
  id: number;
  ten_do_an: string;
  mo_ta: string;
  gia: number;
  so_luong_ton: number;
}

