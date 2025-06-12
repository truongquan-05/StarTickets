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

export const useListCinemas = ({ resource = "rap" }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListCinemas({ resource }),
  });
};

export const useDeleteCinema = ({ resource = "rap" }: Props) => {
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

export const useCreateCinema = ({ resource = "rap" }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (values: any) => getCreateCinemas({ resource, values }),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/cinemas/list");
    },
    onError: () => {
      message.error("Thêm thất bại");
    },
  });
};

export const useUpdateCinema = ({ resource = "rap" }: Props) => {
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




export const useListVouchers = ({ resource = "voucher" }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListCinemas({ resource }), // Dùng chung API getList
  });
};

export const useDeleteVoucher = ({ resource = "voucher" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string | number) => getDeleteCinemas({ resource, id }), // Dùng chung API delete
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      message.success("Xóa voucher thành công");
    },
    onError: () => {
      message.error("Xóa voucher thất bại");
    },
  });
};

export const useCreateVoucher = ({ resource = "voucher" }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (values: any) => getCreateCinemas({ resource, values }), // Dùng chung API create
    onSuccess: () => {
      message.success("Thêm voucher thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/vouchers/list"); // Điều hướng về trang voucher list
    },
    onError: () => {
      message.error("Thêm voucher thất bại");
    },
  });
};

export const useUpdateVoucher = ({ resource = "voucher" }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateCinemas({ resource, id, values }), // Dùng chung API update
    onSuccess: () => {
      message.success("Cập nhật voucher thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Cập nhật voucher thất bại");
    },
  });
};