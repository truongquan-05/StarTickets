import axios from "axios";
import { User } from "../types/Uses";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Props = {
  resource?: string;
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

export const getUpdateFood = async ({ id, values }: any) => {
  values.append("_method", "PUT"); 
  return await axiosClient.post(`http://127.0.0.1:8000/api/do_an/${id}`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Hiển thị phim
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
// duProvider.ts
export const getRaps = () =>
  axiosClient.get("/client/rap").then((res) => {
    return res.data.data || [];
  });

export const getTheLoais = () =>
  axiosClient.get("/the_loai").then((res) => {
    return res.data.data || [];
  });

export const searchPhim = (params: any) => {
  return axiosClient.post("/loc", params);
};
//Banner
// duProvider.ts

// Lấy danh sách banner công khai hiển thị ra trang chủ
export const getPublicBanners = async () => {
  const { data } = await axiosClient.get("/banners");
  return data;
};

export const getListBanners = async () => {
  const { data } = await axiosClient.get("/banners");
  return data;
};
export const getListBannersHetHan = async () => {
  const { data } = await axiosClient.get("/banners/list/het_han");
  return data;
};
export const createBanner = async (values: FormData) => {
  const { data } = await axiosClient.post("/banners", values);
  return data;
};
// Lấy thông tin chi tiết banner theo id
export const getBannerById = async (id: number) => {
  const { data } = await axiosClient.get(`/banners/${id}`);
  return data;
};

export const updateBanner = async (id: number, values: FormData) => {
  values.append("_method", "PUT");
  const { data } = await axiosClient.post(`/banners/${id}`, values);
  return data;
};

// Toggle hoạt động
export const toggleBanner = async (id: number) => {
  const { data } = await axiosClient.patch(`/banners/${id}/active`);
  return data;
};

// Xoá mềm banner
export const deleteBanner = async (id: number) => {
  const { data } = await axiosClient.delete(`/banners/${id}`);
  return data;
};
export const getListTrashBanners = async () => {
  const { data } = await axiosClient.get("/banners/list/trash");
  return { data };
};

export const restoreBanner = async (id: number) => {
  const { data } = await axiosClient.post(`/banners/${id}/restore`);
  return data;
};

export const forceDeleteBanner = async (id: number) => {
  const { data } = await axiosClient.delete(`/banners/${id}/force`);
  return data;
};


// Đơn vé
export const getListDonVe = async () => {
  const res = await axiosClient.get("/admin/don-ve");
  return res.data.data; // ✅ đúng
};

export const getDonVeById = async (id: number | string) => {
  const res = await axiosClient.get(`/admin/don-ve/${id}`);
  return res.data.data;
};


export const locDonVe = async (values: any) => {
  const { data } = await axiosClient.post("/admin/don-ve/loc", values);
  return data;
};

export const getPhimCoLichChieu = async () => {
  const { data } = await axiosClient.get("/admin/don-ve-phim");
  return data;
};
// thông tin cá nhân bên admin
export const getAdminProfile = () => axios.get("/admin/profile");
export const updateAdminProfile = (data: any) => axios.put("/admin/profile", data);
export const changeAdminPassword = (data: any) => axios.post("/admin/change-password", data);














