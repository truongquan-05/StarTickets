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