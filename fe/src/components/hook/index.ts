import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDelete, getList } from "../provider";
import type { Props } from "../provider";
import { message } from "antd";

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