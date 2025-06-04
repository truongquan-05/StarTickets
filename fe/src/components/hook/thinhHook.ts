// thinhHook.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getListCinemas,
  getCreateCinemas,
  getUpdateCinemas,
  getDeleteCinemas,
} from "../provider/thinhProvider";

import type { Props } from "../provider/thinhProvider";

export const useListCinemas = ({ resource = "cinemas" }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListCinemas({ resource }),
  });
};

export const useDeleteCinema = ({ resource = "cinemas" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeleteCinemas({ resource, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      message.success("Xóa thành công");
    },
    onError: () => {
      message.error("Xóa thất bại");
    },
  });
};

export const useCreateCinema = ({ resource = "cinemas" }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (values: any) => getCreateCinemas({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/cinemas/list");
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdateCinema = ({ resource = "cinemas" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateCinemas({ resource, id, values }),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });
};
