export interface IDatVe{
  id:number,
  nguoi_dung_id:number,
  lich_chieu_id:number,
  tong_tien:number
}

export interface IDatVeChiTiet{
  id:number,
  ghe_id:number,
  dat_ve_id:number,
  gia_ve:number
}

export interface IDatVeChiTietPayload {
  ghe_id: number;
  gia_ve: number;
}