import axios from "axios";

// Lấy token từ localStorage
const token = localStorage.getItem("token");

// Tạo axios client với baseURL và header Authorization
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/",
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
export const getListCinemas = async ({ resource = "cinemas" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

// Xóa một rạp chiếu
export const getDeleteCinemas = async ({ resource = "cinemas", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};

// Tạo mới rạp chiếu
export const getCreateCinemas = async ({ resource = "cinemas", values }: Props) => {
  // Loại bỏ id nếu có
  const { id, ...rest } = values || {};
  const { data } = await axiosClient.post(resource, rest);
  return data;
};


// Cập nhật rạp chiếu
export const getUpdateCinemas = async ({ resource = "cinemas", id, values }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  return data;
};
