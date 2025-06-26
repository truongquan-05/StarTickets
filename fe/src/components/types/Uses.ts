
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
  anh_dai_dien?: string; 
  vai_tro_id: "admin" | "user";
  isActive: boolean;
  trang_thai: boolean;
}
export interface Food {
  id: number;
  ten_do_an: string;
  mo_ta: string;
  hinh_anh: string;
  gia: number;
  so_luong_ton: number;
}
export interface Rap {
  id: number;
  ten_rap: string;
}

export interface TheLoai {
  id: number;
  ten_the_loai: string;
}

export interface Phim {
  id: number;
  ten_phim: string;
  mo_ta: string;
  hinh_anh: string;
  ngay_cong_chieu: string;
  the_loai_id: number;
}

