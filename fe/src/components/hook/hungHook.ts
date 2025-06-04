import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  getCreateCategoryChair, getCreateMovies, getDeleteCategoryChair, getDeleteMovies, getListCategoryChair, getListMovies, getUpdateCategoryChair, getUpdateMovies } from "../provider/hungProvider";
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


export const useListCategoryChair = ({resource = "loai-ghe"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListCategoryChair({resource})
  })
}

export const useDeleteCategoryChair = ({resource = "loai-ghe"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeleteCategoryChair({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreateCategoryChairs = ({resource = "loai-ghe"} : Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn : (values : any) => getCreateCategoryChair({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
      navigate("/category_chair/list")
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}

export const useUpdateCategoryChair = ({ resource = "loai-ghe" }) => {
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