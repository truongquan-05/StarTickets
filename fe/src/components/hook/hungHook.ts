import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  checkLichChieu, getCreateCategoryChair, getCreateLichChieu, getCreateMovies, getCreatePhanHoiNguoiDung, getCreatePhongChieu, getCreateVaiTro, getDeleteCategoryChair, getDeleteLichChieu, getDeleteMovies, getDeletePhanHoiNguoiDung, getDeletePhongChieu, getDeleteVaiTro, getDestroyPhongChieu, getListCategoryChair, getListChair, getListChuyenNgu, getListCinemas, getListGhe, getListLichChieu, getListMovies, getListPhanHoiNguoiDung, getListPhongChieu, getListTrashPhongChieu, getListVaiTro, getMovieDetail, getRestorePhongChieu, getUpdateCategoryChair, getUpdateMovies, getUpdatePhanHoiNguoiDung, getUpdatePhongChieu, getUpdateVaiTro } from "../provider/hungProvider";
import type { Props } from "../provider/hungProvider";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const useListMovies = ({ resource = "phim" } : Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListMovies({ resource }),
  });
};
export const useDeleteMovies = ({resource = "phim"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeleteMovies({resource , id}),
    onSuccess : () => {
      message.success("Xóa thành công")
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreateMovies = ({resource = "phim"} : Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn : (values : any) => getCreateMovies({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
      navigate("/admin/movies/list")
    },
    onError: (error: any) => {
  if (error.response?.data?.errors) {
    console.error("Validation errors:", error.response.data.errors);
    message.error("Lỗi nhập liệu: " + JSON.stringify(error.response.data.errors));
  } else {
    message.error("Thêm thất bại");
  }
}
  })
}

export const useUpdateMovies = ({ resource = "phim" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateMovies({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: (error: any) => {
  console.error("Update movie error:", error.response?.data || error);
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const messages = Object.values(errors).flat().join("\n");
    message.error(messages);
  } else {
    message.error("Cập nhật thất bại");
  }
},

  });
};


export const useListCategoryChair = ({resource = "loai_ghe"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListCategoryChair({resource})
  })
}

export const useDeleteCategoryChair = ({resource = "loai_ghe"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeleteCategoryChair({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreateCategoryChairs = ({resource = "loai_ghe"} : Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn : (values : any) => getCreateCategoryChair({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
      navigate("/admin/category_chair/list")
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}

export const useUpdateCategoryChair = ({ resource = "loai_ghe" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateCategoryChair({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({queryKey:[resource]})
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useListVaiTro = ({resource = "vai_tro"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListVaiTro({resource})
  })
}

export const useDeleteVaiTro = ({resource = "vai_tro"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeleteVaiTro({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreateVaiTro = ({resource = "vai_tro"} : Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (values : any) => getCreateVaiTro({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}

export const useUpdateVaiTro = ({ resource = "vai_tro" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateVaiTro({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({queryKey:[resource]})
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};

export const useListPhanHoiNguoiDung = ({resource = "phan_hoi"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListPhanHoiNguoiDung({resource})
  })
}

export const useDeletePhanHoiNguoiDung = ({resource = "phan_hoi"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeletePhanHoiNguoiDung({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreatePhanHoiNguoiDung = ({resource = "phan_hoi"} : Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (values : any) => getCreatePhanHoiNguoiDung({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}



export const useUpdatePhanHoiNguoiDung = ({ resource = "phan_hoi" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdatePhanHoiNguoiDung({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[resource]})
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useListPhongChieu = ({resource = "phong_chieu"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListPhongChieu({resource})
  })
}
export const useCreatePhongChieu = ({resource = "phong_chieu"} : Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (values : any) => getCreatePhongChieu({resource,values}),
    onSuccess: () => {
      navigate("/admin/room/list/chuaxuat")
      message.success("Tạo phòng chiếu thành công")
      queryClient.invalidateQueries({queryKey:[resource]});
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}

export const useUpdatePhongChieu = ({ resource = "phong_chieu" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdatePhongChieu({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[resource]})
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useDeletePhongChieu = ({resource = "phong_chieu"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeletePhongChieu({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}

export const useDestroyPhongChieu = ({resource = "phong_chieu"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDestroyPhongChieu({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}

export const useListTrashPhongChieu = ({resource = "phong_chieu"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListTrashPhongChieu({resource})
  })
}
export const useRestorePhongChieu = ({ resource = "phong_chieu" }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => getRestorePhongChieu({ resource, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/phongchieu/list"); // chỉnh đường dẫn theo cấu trúc bạn dùng
    },
    onError: () => {
      // Bạn có thể thêm message.error ở đây nếu muốn
    },
  });
};

export const useListCinemas = ({ resource = 'rap' }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const res = await getListCinemas({ resource });
      return res.data || res; 
    },
  });
};

export const useListGhe = ({ resource = 'ghe', phong_id }: Props) => {
  return useQuery({
    queryKey: [resource, phong_id], // refetch khi phong_id thay đổi
    queryFn: () => getListGhe({ resource, phong_id }),
    enabled: !!phong_id, // chỉ gọi khi có phong_id
  });
};
export const useListChair = ({resource = "ghe"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListChair({resource})
  })
}

export const useListLichChieu = ({resource = "lich_chieu"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListLichChieu({resource})
  })
}

export const useDeleteLichChieu = ({resource = "lich_chieu"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeleteLichChieu({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreateLichChieu = ({resource = "lich_chieu"} : Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (values : any) => getCreateLichChieu({resource,values}),
    onSuccess: () => {
      navigate("/admin/lichchieu/list")
      queryClient.invalidateQueries({queryKey:[resource]});
    },
    onError : () => {
    }
  })
}

export const useListChuyenNgu = ({ resource = "chuyen_ngu", phimId }: Props) => {
  return useQuery({
    queryKey: ['chuyenNgu', phimId || 'all'], // tách cache theo phim
    queryFn: () => getListChuyenNgu({ resource, phimId }),
    enabled: phimId !== undefined || resource !== "chuyen_ngu", // chỉ gọi nếu có phimId hoặc resource custom
  });
};

export const useCheckLichChieu = ({ resource = "lich_chieu/check" }: Props) => {
  return useMutation({
    mutationFn: (values: any) => checkLichChieu({ resource, values }),
  });
};

export const useMovieDetail = (id?: string | number) => {
  return useQuery({
    queryKey: ['phim', id],
    queryFn: () => getMovieDetail({ resource: "phim", id }),
    enabled: !!id,
  });
};
