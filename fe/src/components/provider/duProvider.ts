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

export const getListUsers = async ({resource = "users"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data
}

export const getDeleteUsers = async ({resource = "users" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateUsers = async ({ resource = "users", values }: Props) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};


export const getUpdateUsers = async ({ resource = "users", id, values }: Props) => {
  if (!id) return;
  if (values instanceof FormData) {
    values.append("_method", "PUT");
    const { data } = await axiosClient.post(`${resource}/${id}`, values, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  // Nếu không có file, thì dùng PUT bình thường
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  return data;
};
export const getUserById = async (id: number | string) => {
  const { data } = await axiosClient.get<User>(`users/${id}`);
  return data;
};

// === Food APIs ===

export const getListFoods = async ({ resource = "food" }: Props) => {
  const { data } = await axiosClient.get(`${resource}`);
  return data;
};

export const getDeleteFood = async ({ resource = "food", id }: Props) => {
  return await axiosClient.delete(`${resource}/${id}`);
};

export const getCreateFood = async ({ resource = "food", values }: Props) => {
  return await axiosClient.post(`${resource}`, values);
};

export const getUpdateFood = async ({ resource = "food", id, values }: Props) => {
  return await axiosClient.put(`${resource}/${id}`, values);
};





