import axios from "axios";
import { Food, User } from "../types/Uses";

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

export const getUsers = () => axiosClient.get<User[]>("users");

export const getUserById = (id: number) => axiosClient.get<User>(`users/${id}`);

export const createUser = (user: Omit<User, "id">) => axiosClient.post("users", user);

export const updateUser = (id: number, user: Partial<User>) => axiosClient.put(`users/${id}`, user);

export const deleteUser = (id: number) => axiosClient.delete(`users/${id}`);
// === Food APIs ===


export const getFoodById = (id: number) => axiosClient.get<Food>(`do_an/${id}`);

export const createFood = (food: Omit<Food, "id">) => axiosClient.post("do_an", food);

export const updateFood = (id: number, food: Partial<Food>) =>
  axiosClient.put(`do_an/${id}`, food);

export const deleteFood = (id: number) => axiosClient.delete(`do_an/${id}`);

// === Soft delete / Restore ===
export const softDeleteFood = (id: number) =>
  axiosClient.patch(`do_an/${id}`, { deleted: true });

export const restoreFood = (id: number) =>
  axiosClient.patch(`do_an/${id}`, { deleted: false });

export const getActiveFoods = async () => {
  const { data } = await axiosClient.get<Food[]>("do_an");
  return data.filter((food) => !food.deleted);
}



