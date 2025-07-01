export interface ILichChieu {
  id: number;
  phim_id: number;
  phong_id: number;
  gio_chieu: string; // Giả định là chuỗi ISO
  gio_ket_thuc: string; // Giả định là chuỗi ISO
  chuyen_ngu_id: string; // Hoặc number tùy API

  // Đây là phần quan trọng, giả định API đã join sẵn:
  gia_ve: Array<{
    id: number; // ID của bản ghi giá vé (loại ghế)
    ten_loai_ghe: string; // Tên loại ghế, ví dụ: "Ghế Thường"
    pivot: { // Thông tin từ bảng trung gian
      lich_chieu_id: number;
      loai_ghe_id: number;
      id: number; // ID của bản ghi pivot
      gia_ve: string; // Giá tiền cụ thể, thường là chuỗi "100000.00"
    };
  }>;
}

// src/Admin/interface/giave.ts (Hoặc tạo file mới nếu chưa có)
export interface IGiaVe {
  id: number;
  lich_chieu_id: number;
  loai_ghe_id: number;
  gia_ve: number; // Đảm bảo là number
}