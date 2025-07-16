import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkLichChieu,
  deleteDatVe,
  deleteForeverMovie,
  getCheckGheByLichChieuId,
  getCreateCategoryChair,
  getCreateDatVe,
  getCreateGiaVe,
  getCreateLichChieu,
  getCreateMovies,
  getCreateNews,
  getCreatePhanHoiNguoiDung,
  getCreatePhongChieu,
  getCreateThanhToanMoMo,
  getCreateVaiTro,
  getDeleteCategoryChair,
  getDeleteCheckGhe,
  getDeleteLichChieu,
  getDeleteMovies,
  getDeleteNews,
  getDeletePhanHoiNguoiDung,
  getDeletePhongChieu,
  getDeleteVaiTro,
  getDestroyPhongChieu,
  getDestroyVoucher,
  getDetailTinTuc,
  getListCategoryChair,
  getListChair,
  getListCheckGheByGhe,
  getListChuyenNgu,
  getListCinemas,
  getListDatVe,
  getListGhe,
  getListLichChieu,
  getListLichSuDonHang,
  getListLichSuDonHangChiTiet,
  getListMovies,
  getListNews,
  getListPhanHoiNguoiDung,
  getListPhongChieu,
  getListTrashMovies,
  getListTrashPhongChieu,
  getListVaiTro,
  getMovieDetail,
  getRestoreMovies,
  getRestorePhongChieu,
  getSoftDeleteMovies,
  getUpdateCategoryChair,
  getUpdateCheckGhe,
  getUpdateLichChieu,
  getUpdateLoaiGhe,
  getUpdateMovies,
  getUpdateNews,
  getUpdatePhanHoiNguoiDung,
  getUpdatePhongChieu,
  getUpdateTrangThaiGhe,
  getUpdateVaiTro,
} from "../provider/hungProvider";
import { Props } from "../provider/hungProvider";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useListMovies = ({ resource = "phim" }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListMovies({ resource }),
  });
};
export const useDeleteMovies = ({ resource = "phim" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeleteMovies({ resource, id }),
    onSuccess: () => {
      message.success("Xóa thành công");
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
export const useCreateMovies = ({ resource = "phim" }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (values: any) => getCreateMovies({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/movies/list");
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
        message.error(
          "Lỗi nhập liệu: " + JSON.stringify(error.response.data.errors)
        );
      } else {
        message.error("Thêm thất bại");
      }
    },
  });
};

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

export const useListCategoryChair = ({ resource = "loai_ghe" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListCategoryChair({ resource }),
  });
};

export const useDeleteCategoryChair = ({ resource = "loai_ghe" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) =>
      getDeleteCategoryChair({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
export const useCreateCategoryChairs = ({ resource = "loai_ghe" }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (values: any) => getCreateCategoryChair({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/category_chair/list");
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdateCategoryChair = ({ resource = "loai_ghe" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateCategoryChair({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useListVaiTro = ({ resource = "vai_tro" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListVaiTro({ resource }),
  });
};

export const useDeleteVaiTro = ({ resource = "vai_tro" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeleteVaiTro({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
export const useCreateVaiTro = ({ resource = "vai_tro" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: any) => getCreateVaiTro({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdateVaiTro = ({ resource = "vai_tro" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateVaiTro({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};

export const useListPhanHoiNguoiDung = ({ resource = "phan_hoi" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListPhanHoiNguoiDung({ resource }),
  });
};

export const useDeletePhanHoiNguoiDung = ({ resource = "phan_hoi" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) =>
      getDeletePhanHoiNguoiDung({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
export const useCreatePhanHoiNguoiDung = ({ resource = "phan_hoi" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: any) =>
      getCreatePhanHoiNguoiDung({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdatePhanHoiNguoiDung = ({ resource = "phan_hoi" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdatePhanHoiNguoiDung({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useListPhongChieu = ({ resource = "phong_chieu" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListPhongChieu({ resource }),
  });
};
export const useCreatePhongChieu = ({ resource = "phong_chieu" }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: any) => getCreatePhongChieu({ resource, values }),
    onSuccess: () => {
      navigate("/admin/room/list/chuaxuat");
      message.success("Tạo phòng chiếu thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdatePhongChieu = ({ resource = "phong_chieu" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdatePhongChieu({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useDeletePhongChieu = ({ resource = "phong_chieu" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeletePhongChieu({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};

export const useDestroyPhongChieu = ({ resource = "phong_chieu" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) =>
      getDestroyPhongChieu({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};

export const useListTrashPhongChieu = ({ resource = "phong_chieu" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListTrashPhongChieu({ resource }),
  });
};
export const useRestorePhongChieu = ({ resource = "phong_chieu" }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => getRestorePhongChieu({ resource, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/room/list/chuaxuat"); // chỉnh đường dẫn theo cấu trúc bạn dùng
    },
    onError: () => {
      // Bạn có thể thêm message.error ở đây nếu muốn
    },
  });
};

export const useListCinemas = ({ resource = "rap" }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const res = await getListCinemas({ resource });
      return res.data || res;
    },
  });
};

export const useListGhe = ({ resource = "ghe", phong_id }: Props) => {
  return useQuery({
    queryKey: [resource, phong_id], // refetch khi phong_id thay đổi
    queryFn: () => getListGhe({ resource, phong_id }),
    enabled: !!phong_id, // chỉ gọi khi có phong_id
  });
};
export const useListChair = ({ resource = "ghe" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListChair({ resource }),
  });
};

export const useUpdateLoaiGhe = ({ resource = "ghe" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateLoaiGhe({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {},
  });
};
export const useUpdateTrangThaiGhe = ({ resource = "ghe" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateTrangThaiGhe({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {},
  });
};

export const useListLichChieu = ({ resource = "lich_chieu" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListLichChieu({ resource }),
  });
};

export const useDeleteLichChieu = ({ resource = "lich_chieu" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeleteLichChieu({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
export const useCreateLichChieu = ({ resource = "lich_chieu" }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: any) => getCreateLichChieu({ resource, values }),
    onSuccess: () => {
      navigate("/admin/lichchieu/list");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: (error: AxiosError) => {
      const errMsg =
        (error.response?.data as any)?.message?.err[0] ||
        "Đã có lỗi xảy ra, vui lòng thử lại";
      message.error(errMsg);

      // Nếu bạn muốn ném tiếp lỗi ra cho component cũng xử lý, thêm:
      throw error;
    },
  });
};

export const useUpdateLichChieu = ({ resource = "lich_chieu" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateLichChieu({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {},
  });
};

export const useListChuyenNgu = ({
  resource = "chuyen_ngu",
  phimId,
}: Props) => {
  return useQuery({
    queryKey: ["chuyenNgu", phimId || "all"], // tách cache theo phim
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
    queryKey: ["phim", id],
    queryFn: () => getMovieDetail({ resource: "phim", id }),
    enabled: !!id,
  });
};

export const useListNews = ({ resource = "tin_tuc" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListNews({ resource }),
  });
};

export const useDeleteNews = ({ resource = "tin_tuc" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeleteNews({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
      message.success("Xóa thành công");
    },
    onError: () => {},
  });
};
export const useCreateNews = ({ resource = "tin_tuc" }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (values: any) => getCreateNews({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/news");
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdateNews = ({ resource = "tin_tuc" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateNews({ resource, id, values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
export const useDetailTinTuc = ({ id, resource = "tin_tuc" }: Props) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => getDetailTinTuc({ id, resource }),
    enabled: !!id, // chỉ gọi API nếu có id
  });
};

export const useCreateGiaVe = ({ resource = "gia_ve" }: Props) => {
  return useMutation({
    mutationFn: (values: any) => getCreateGiaVe({ resource, values }),
  });
};
export const useListCheckGhe = ({
  id,
  resource = "check_ghe",
}: {
  id?: number;
  resource?: string;
}) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => {
      if (!id) return Promise.resolve([]);
      return getCheckGheByLichChieuId({ id, resource });
    },
    enabled: !!id,
    select: (data) => data.data || [],
  });
};

// ✅ DELETE
export const useDeleteCheckGhe = ({
  resource = "check_ghe",
}: {
  resource?: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => getDeleteCheckGhe({ resource, id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      message.success("Xóa thành công");
    },
    onError: () => {
      message.error("Xóa thất bại");
    },
  });
};

interface UpdateCheckGheVariables {
  id: number | string; // Đây là ID của bản ghi check_ghe cụ thể (ví dụ: 1, 2, 3...)
  values: { trang_thai: string; nguoi_dung_id: any }; // Các giá trị muốn cập nhật (ví dụ: { trang_thai: "dang_dat" })
  lichChieuId: number | null; // Đây là ID của lịch chiếu, quan trọng cho việc làm mất hiệu lực cache
}
// ✅ UPDATE
export const useUpdateCheckGhe = ({
  resource = "check_ghe",
}: {
  resource?: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateCheckGheVariables) => {
      return getUpdateCheckGhe({
        resource,
        id: variables.id,
        values: variables.values,
      });
    },
    onSuccess: (data, variables) => {
      // 'variables' ở đây chính là đối tượng `UpdateCheckGheVariables`
      queryClient.invalidateQueries({
        queryKey: [resource, variables.lichChieuId],
      });
    },
    onError: (err) => {
      if ((err as any)?.response?.data?.message) {
        message.error((err as any).response.data.message);
      }
    },
  });
};
// ✅ XÓA MỀM PHIM
export const useSoftDeleteMovies = ({ resource = "phim" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getSoftDeleteMovies({ resource, id }),
    onSuccess: () => {
      message.success("Xóa mềm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Xóa mềm thất bại");
    },
  });
};

// ✅ DANH SÁCH PHIM ĐÃ XÓA MỀM
export const useListTrashMovies = ({ resource = "phim" }: Props) => {
  return useQuery({
    queryKey: [resource, "trash"],
    queryFn: () => getListTrashMovies({ resource }),
  });
};

// ✅ KHÔI PHỤC PHIM
export const useRestoreMovies = ({ resource = "phim" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => getRestoreMovies({ resource, id }),
    onSuccess: () => {
      message.success("Khôi phục thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Khôi phục thất bại");
    },
  });
};

export const useDeleteForeverMovie = ({ resource = "phim" }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteForeverMovie({ resource, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource, "trash"] });
    },
    onError: () => {
      message.error("Xóa vĩnh viễn thất bại");
    },
  });
};

export const useDeleteDatVe = ({ resource = "dat_ve" }: Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => deleteDatVe({ resource, id }),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: [resource] });
    },
  });
};

export const useCreateDatVe = ({ resource = "dat_ve" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: any) => getCreateDatVe({ resource, values }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      return data?.data; // Trả về toàn bộ response data
    },
  });
};

export const useListDatVe = ({ resource = "dat_ve" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListDatVe({ resource }),
  });
};

export const useCreateThanhToanMoMo = ({ resource = "momo-pay" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: any) => getCreateThanhToanMoMo({ resource, values }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      return data;
    },
  });
};

export const useListThanhToan = ({ resource = "thanh_toan" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListDatVe({ resource }),
  });
};

export const useListCheckGheByGhe = ({
  resource = "show-all-checkghe",
  id,
}: Props) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => getListCheckGheByGhe({ resource, id }),
  });
};

export const useVoucher = ({ resource = "voucher-check" }: Props) => {
  return useMutation({
    mutationFn: (values: any) => getCreateGiaVe({ resource, values }),
  });
};

export const useDestroyVoucher = ({ resource = "voucher" }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values?: any }) =>
      getDestroyVoucher({ resource, id, values }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
};


export const useListLichSuDonHangChiTiet = ({
  resource = "lich-su-ve",
  id,
}: Props) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => getListLichSuDonHangChiTiet({ resource, id }),
  });
};

export const useListLichSuDonHang = ({ resource = "lich-su-ve" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListLichSuDonHang({ resource }),
  });
};