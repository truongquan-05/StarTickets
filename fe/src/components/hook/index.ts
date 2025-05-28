import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCreate, getDelete, getList, getUpdate } from "../provider";
import type { Props } from "../provider";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const useList = ({ resource = "phim" } : Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getList({ resource }),
  });
};
export const useDelete = ({resource = "phim"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDelete({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreate = ({resource = "phim"} : Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn : (values : any) => getCreate({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
      navigate("")
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}

export const useUpdate = ({ resource = "phim" }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdate({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({queryKey:[resource]})
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};