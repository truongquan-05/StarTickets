
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
export interface DonDoAn{
  id:number,
  do_an_id:number,
  dat_ve_id:number,
  gia_ban:number,
  so_luong:number
}

export interface Food {
  id: number;
  ten_do_an: string;
  mo_ta: string;
  gia_nhap: number;
  gia_ban: number;
  so_luong_ton: number;
  image?: string;
   rap_id: number[];
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
  the_loai_id: TheLoaiObject[]; // ✅ phải là mảng object
  thoi_luong?: number; // nếu bạn dùng
  anh_poster?: string;
}
export interface TheLoaiObject {
  id: number;
}


