import axios from "axios";

// Lấy token từ localStorage
const token = localStorage.getItem("token");

// Tạo axios client với baseURL và header Authorization
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// Kiểu Props dùng chung
export type Props = {
  resource?: string; // cho phép tùy chỉnh resource, mặc định là "cinemas"
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
  const { data } = await axiosClient.patch(`${resource}/${id}/soft-delete`);
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


// Lấy danh sách voucher
export const getListVouchers = async ({ resource = "voucher" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

// Xóa voucher (soft delete)
export const getDeleteVouchers = async ({ resource = "voucher", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.patch(`${resource}/${id}/soft-delete`);
  return data;
};

// Tạo voucher mới
export const getCreateVouchers = async ({ resource = "voucher", values }: Props) => {
  const { id, ...rest } = values || {};
  const { data } = await axiosClient.post(resource, rest);
  return data;
};

// Cập nhật voucher
export const getUpdateVouchers = async ({ resource = "voucher", id, values }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  return data;
};
