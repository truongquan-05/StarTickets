
export interface Genre {
  id: number;
  name: string;
}
export interface User {
  id: number;
  ten: string;
  email: string;
  password: string;
  so_dien_thoai: string;
  anh_dai_dien: string; 
  vai_tro_id: "admin" | "user";
  isActive: boolean;
}
export interface Food {
  id: number;
  ten_do_an: string;
  mo_ta: string;
  hinh_anh: string;
  gia: number;
  so_luong_ton: number;
}

