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
export const getListMovies = async ({resource = "phim"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data
}

export const getDeleteMovies = async ({resource = "phim" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateMovies = async ({ resource = "phim", values }: Props) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};


export const getUpdateMovies = async ({ resource = "phim", id, values }: Props) => {
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

export const getGenreList = async ({ resource = "the_loai" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

export const getListCategoryChair = async ({resource = "loai_ghe"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data;
}

export const getDeleteCategoryChair  = async ({resource = "loai_ghe" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateCategoryChair = async ({resource = "loai_ghe" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdateCategoryChair  = async ({resource = "loai_ghe", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}