import axios from "axios";

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
export const getListMovies = async ({resource = "phim"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data
}

export const getDeleteMovies = async ({resource = "phim" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateMovies = async ({resource = "phim" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdateMovies = async ({resource = "phim", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}
export const getGenreList = async ({ resource = "the_loai" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

export const deleteGenre = async ({ resource = "the_loai", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};

export const createGenre = async ({ resource = "the_loai", values }: Props) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};
