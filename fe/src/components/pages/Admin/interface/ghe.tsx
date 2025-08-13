export interface IGhe{
  id:number,
  phong_id:number,
  loai_ghe_id:number,
  so_ghe:string,
  hang:string,
  cot:string,
  trang_thai:boolean
  user_id: number | null;
  nguoi_dung_id: number | null;
}