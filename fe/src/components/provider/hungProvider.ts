import axios from "axios";


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
  resource: string;
  id?: number | string;
  values?: any;
  phong_id?: number;
  phimId?: number;
};
export const getListMovies = async ({resource = "phim"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data
}
export const getMovieDetail = async ({ id, resource = "phim" }: Props) => {
  if (!id) throw new Error("Thiếu ID phim");
  const { data } = await axiosClient.get(`${resource}/${id}`);
  return data;
};


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
export const getListVaiTro = async ({resource = "vai_tro"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data;
}

export const getDeleteVaiTro  = async ({resource = "vai_tro" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateVaiTro = async ({resource = "vai_tro" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdateVaiTro = async ({resource = "vai_tro", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}

export const getListPhanHoiNguoiDung = async ({resource = "phan_hoi"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data.data;
}

export const getDeletePhanHoiNguoiDung  = async ({resource = "phan_hoi" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreatePhanHoiNguoiDung = async ({resource = "phan_hoi" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdatePhanHoiNguoiDung= async ({resource = "phan_hoi", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}
export const getListPhongChieu = async ({ resource = "phong_chieu" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};
export const getCreatePhongChieu = async ({resource = "phong_chieu" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdatePhongChieu= async ({resource = "phong_chieu", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}

//xóa mềm phòng chiếu
export const getDeletePhongChieu  = async ({resource = "phong_chieu" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}
//xóa cứng vĩnh viễn
export const getDestroyPhongChieu  = async ({resource = "phong_chieu" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}/delete`)
  return data;
}
export const getListTrashPhongChieu = async ({ resource = "phong_chieu" }: Props) => {
  const { data } = await axiosClient.get(`${resource}/trashed/list`);
  return data;
};
export const getRestorePhongChieu = async ({ resource = "phong_chieu", id }: Props) => {
  const { data } = await axiosClient.post(`${resource}/restore/${id}`);
  return data;
};

export const getListCinemas = async ({ resource = "rap" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};
export const getListChair = async ({ resource = "rap" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

export const getListGhe = async ({
  resource = "ghe",
  phong_id,
  per_page = 1000,  // mặc định lấy 1000 ghế
}: {
  resource?: string;
  phong_id?: number;
  per_page?: number;
}) => {
  const params: Record<string, any> = {};
  if (phong_id) params.phong_id = phong_id;
  if (per_page) params.per_page = per_page;

  const { data } = await axiosClient.get(resource, { params });
  return data.data;
};

export const getUpdateLoaiGhe = async ({resource = "ghe", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}/sua_loai_ghe`,values);
  return data
}
export const getUpdateTrangThaiGhe = async ({resource = "ghe", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}

export const getDeleteLichChieu  = async ({resource = "lich_chieu" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getListLichChieu = async ({ resource = "lich_chieu" }: Props) => {
  const res = await axiosClient.get(resource);
  return res.data.data;  // nếu backend bọc trong data.data
};
export const checkLichChieu = async ({ resource = "lich_chieu/check", values }: Props) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};

export const getCreateLichChieu = async ({resource = "lich_chieu" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdateLichChieu= async ({resource = "lich_chieu", id, values} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.put(`${resource}/${id}`,values);
  return data
}

export const getListChuyenNgu = async ({ phimId, resource = "chuyen_ngu" }: Props) => {
  const url = phimId ? `/lich_chieus/chuyen_ngu/${phimId}` : `/${resource}`;
  const { data } = await axiosClient.get(url);
  return data;
};

export const getListNews = async ({resource = "tin_tuc"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data;
}

export const getDeleteNews  = async ({resource = "tin_tuc" , id} : Props) => {
  if(!id) return;
  const {data} = await axiosClient.delete(`${resource}/${id}`)
  return data;
}

export const getCreateNews = async ({resource = "tin_tuc" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getUpdateNews= async ({ resource = "tin_tuc", id, values }: Props) => {
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

export const getDetailTinTuc = async ({ id, resource = "tin_tuc" }: Props) => {
  if (!id) return;

  const { data } = await axiosClient.get(`${resource}/${id}`);
  return data.data;
};

export const getCreateGiaVe = async ({resource = "gia_ve" , values} : Props) => {
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getCheckGheByLichChieuId = async ({ id, resource = "check_ghe" }: Props) => {
  if (!id) throw new Error("Thiếu lich_chieu_id");
  const { data } = await axiosClient.get(`${resource}/${id}`);
  return data;
};

// Sửa trạng thái ghế theo id check_ghe (id bản ghi check_ghe)
export const getUpdateCheckGhe = async ({ id, values, resource = "check_ghe" }: Props) => {
  if (!id) {
    throw new Error("Thiếu id bản ghi check_ghe để cập nhật");
  }
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  
  return data;
};

// Xóa bản ghi check_ghe theo id
export const getDeleteCheckGhe = async ({ id, resource = "check_ghe" }: Props) => {
  if (!id) throw new Error("Thiếu id bản ghi check_ghe");
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};
// 👇 XÓA MỀM phim (soft-delete)
export const getSoftDeleteMovies = async ({ resource = "phim", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/soft-delete/${id}`);
  return data;
};

// 👇 DANH SÁCH phim đã xóa mềm
export const getListTrashMovies = async ({ resource = "phim" }: Props) => {
  const { data } = await axiosClient.get(`${resource}/trashed/list`);
  return data;
};

// 👇 KHÔI PHỤC phim đã xóa mềm
export const getRestoreMovies = async ({ resource = "phim", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.post(`${resource}/restore/${id}`);
  return data;
};
// xóa vĩnh viễn
// ✅ XÓA VĨNH VIỄN PHIM
export const deleteForeverMovie = async ({ resource = "phim", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};

export const getCreateDatVe = async ({resource = "dat_ve" , values} : Props) => {
  console.log("👉 Dữ liệu gửi đi:", values);
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const deleteDatVe = async ({ resource = "dat_ve", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};

export const getListDatVe = async ({ resource = "dat_ve" }: Props) => {
  const { data } = await axiosClient.get(`${resource}/trashed/list`);
  return data;
};

export const getCreateThanhToanMoMo = async ({resource = "momo-pay" , values} : Props) => {
  console.log("👉 Dữ liệu gửi đi:", values);
  const {data} = await  axiosClient.post(resource,values);
  return data;
}

export const getListThanhToan = async ({resource = "thanh_toan"} : Props) => {
  const {data} = await axiosClient.get(resource);
  return data;
}
