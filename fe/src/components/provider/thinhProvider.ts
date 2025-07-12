import axios from "axios";


const token = localStorage.getItem("token");

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export type Props = {
  resource: string; 
  id?: number | string;
  values?: any;
};

// Lấy danh sách rạp chiếu
export const getListCinemas = async ({ resource = "rap" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

// Xóa một rạp chiếu
export const getDeleteCinemas = async ({ resource = "rap", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}/soft-delete`);
  return data;
};

// Tạo mới rạp chiếu
export const getCreateCinemas = async ({ resource = "rap", values }: Props) => {
  // Loại bỏ id nếu có
  const { id, ...rest } = values || {};
  const { data } = await axiosClient.post(resource, rest);
  return data;
};


// Cập nhật rạp chiếu
export const getUpdateCinemas = async ({ resource = "rap", id, values }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  return data;
};

// Voucher APIs...
export const getListVouchers = async ({ resource = "ma_giam_gia" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

export const getDeleteVoucher = async ({ resource = "ma_giam_gia", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};


export const getCreateVoucher = async ({ resource = "ma_giam_gia", values }: Props) => {
  // Loại bỏ id nếu có
  const { id, ...rest } = values || {};
  const { data } = await axiosClient.post(resource, rest);
  return data;
};


// Cập nhật rạp chiếu
export const getUpdateVoucher = async ({ resource = "ma_giam_gia", id, values }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  return data;
};
