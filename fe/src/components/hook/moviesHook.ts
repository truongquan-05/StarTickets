import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCreateMovies, getDeleteMovies, getListMovies, getUpdateMovies } from "../provider/moviesProvider";
import type { Props } from "../provider/moviesProvider";
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