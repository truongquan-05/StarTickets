import axios from "axios";
import { Food, User } from "../types/Uses";

const token = localStorage.getItem("token");

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    Authorization: token && `Bearer ${token}`,
  },
});

export type Props = {
  resource: string;
  id?: number | string;
  values?: any;
};

export const getList = async ({resource = "movies"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data
}

export const getDelete = async ({resource = "movies" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreate = async ({resource = "movies" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUsers = () => axiosClient.get<User[]>("users");

export const getUserById = (id: number) => axiosClient.get<User>(`users/${id}`);

export const createUser = (user: Omit<User, "id">) => axiosClient.post("users", user);

export const updateUser = (id: number, user: Partial<User>) => axiosClient.put(`users/${id}`, user);

export const deleteUser = (id: number) => axiosClient.delete(`users/${id}`);
// === Food APIs ===
export const getFoods = () => axiosClient.get<Food[]>("food");

export const getFoodById = (id: number) => axiosClient.get<Food>(`food/${id}`);

export const createFood = (food: Omit<Food, "id">) => axiosClient.post("food", food);

export const updateFood = (id: number, food: Partial<Food>) =>
  axiosClient.put(`food/${id}`, food);

export const deleteFood = (id: number) => axiosClient.delete(`food/${id}`);

// === Soft delete / Restore ===
export const softDeleteFood = (id: number) =>
  axiosClient.patch(`food/${id}`, { deleted: true });

export const restoreFood = (id: number) =>
  axiosClient.patch(`food/${id}`, { deleted: false });

export const getActiveFoods = async () => {
  const { data } = await axiosClient.get<Food[]>("food");
  return data.filter((food) => !food.deleted);
}



