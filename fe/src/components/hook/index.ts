import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCreate, getDelete, getList } from "../provider";
import type { Props } from "../provider";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const useList = ({ resource = "movies" } : Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getList({ resource }),
  });
};
export const useDelete = ({resource = "movies"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDelete({resource , id}),
    onSuccess : () => {
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreate = ({resource = "movies"} : Props) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn : (values : any) => getCreate({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      navigate("movies/list")
    },
    onError : () => {
      message.error("Thêm thất bại");
    }
  })
}