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
      navigate("/movies/list")
    },
    onError : () => {
      message.error("Thêm thất bại");
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
      queryClient.invalidateQueries({queryKey:[resource]})
    },
    onError: () => {
      message.error("Cập nhật thất bại");
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
      navigate("/category_chair/list")
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