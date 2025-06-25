import axios from "axios";
import { User } from "../types/Uses";

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

export const getListUsers = async ({resource = "nguoi_dung"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data
}
export const getListVaiTro = async ({resource = "vai_tro"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data;
}

export const getDeleteUsers = async ({resource = "nguoi_dung" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateUsers = async ({ resource = "nguoi_dung", values }: Props) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};


export const getUpdateUsers = async ({ resource = "nguoi_dung", id, values }: Props) => {
  if (!id || !values) return;

  if (values instanceof FormData) {
    // gửi POST với _method=PUT giả lập PUT để upload file
    values.append("_method", "PUT");
    const { data } = await axiosClient.post(`${resource}/${id}`, values, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response from update user API:", data);
    return data;
    
  } else {
    // gửi PUT hoặc PATCH với JSON
    const { data } = await axiosClient.put(`${resource}/${id}`, values);
    return data;
  }
};

export const getUserById = async (id: number | string) => {
  const { data } = await axiosClient.get<User>(`nguoi_dung/${id}`);
  return data;
};

// === Food APIs ===

export const getListFoods = async ({ resource = "do_an" }: Props) => {
  const { data } = await axiosClient.get(`${resource}`);
  return data;
};

export const getDeleteFood = async ({ resource = "do_an", id }: Props) => {
  return await axiosClient.delete(`${resource}/${id}`);
};

export const getCreateFood = async ({ resource = "do_an", values }: Props) => {
  return await axiosClient.post(`${resource}`, values);
};

export const getUpdateFood = async ({ resource = "do_an", id, values }: Props) => {
  return await axiosClient.put(`${resource}/${id}`, values);
};

export const getCurrentMovies = async () => {
  const res = await axiosClient.get("phim-dang-chieu");
  return res.data;
};
export const getUpcomingMovies = async () => {
  const res = await axiosClient.get("phim-sap-chieu");
  return res.data;
};

export const getMovieDetail = async (id: number | string) => {
  const res = await axiosClient.get(`/chi-tiet-phim/${id}`);
  return res.data;
};
export const searchMovies = async (keyword: string) => {
  const res = await axiosClient.get("/search", {
    params: { keyword },
  });
  return res;
};
// lọc phim











