import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import type { Props } from "../provider/duProvider";
import {   getCreateFood, getCreateUsers, getDeleteFood, getDeleteUsers, getListFoods, getListUsers, getListVaiTro, getUpdateFood, getUpdateUsers } from "../provider/duProvider";
import { Food } from "../types/Uses";


export const useListUsers = ({ resource = "nguoi_dung" } : Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListUsers({ resource }),
  });
};
export const useListVaiTro = ({resource = "vai_tro"}) => {
  return useQuery({
    queryKey:[resource],
    queryFn: () => getListVaiTro({resource})
  })
}
export const useDeleteUser = ({resource = "nguoi_dung"} : Props) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (id ? : string | number ) => getDeleteUsers({resource , id}),
    onSuccess : () => {
      message.success("Xóa thành công")
      queryclient.invalidateQueries({queryKey:[resource]})
    }
  })
}
export const useCreateUser = ({resource = "nguoi_dung"} : Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (values : any) => getCreateUsers({resource,values}),
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({queryKey:[resource]});
    },
    onError: (error: any) => {
  // if (error.response?.data?.errors) {
  //   console.error("Validation errors:", error.response.data.errors);
  // } else {
  //   message.error("Thêm thất bại");
  // }
}
  })
}

export const useUpdateUser = ({ resource = "nguoi_dung" }) => {
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, values }: { id: number | string; values: any }) =>
      getUpdateUsers({ resource, id, values }),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[resource]});
      navigate("/admin/users");
    },

    onError: (error: any) => {
      console.error("Update user error:", error.response?.data || error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // errors có thể là object dạng { field: [msg1, msg2], ... }
        const messages = Object.values(errors)
          .flat()
          .join("\n");
        // message.error(messages);
      } else {
        message.error("Cập nhật thất bại");
      }
    },
  });
};


// Food
const resource = "do_an";  // Giữ nguyên đường dẫn 'food' ở đây.

export const useListFoods = () => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListFoods({ resource }),
  });
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => getDeleteFood({resource,id}),
    onSuccess: () => {
      message.success("Xóa món ăn thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
    onError: () => {
      message.error("Xóa món ăn thất bại");
    }
  });
};

export const useCreateFood = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Omit<Food, "id">) => getCreateFood({resource,values}),
    onSuccess: () => {
      message.success("Thêm món ăn thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/food");
      
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        message.error("Lỗi nhập liệu: " + JSON.stringify(error.response.data.errors));
      } else {
        message.error("Thêm món ăn thất bại");
      }
    }
  });
};

export const useUpdateFood = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<Food> }) => getUpdateFood({resource, id, values}),
    onSuccess: () => {
      message.success("Cập nhật món ăn thành công");
      queryClient.invalidateQueries({ queryKey: [resource] });
      navigate("/admin/food");
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const messages = Object.values(errors).flat().join("\n");
        message.error(messages);
      } else {
        message.error("Cập nhật món ăn thất bại");
      }
    }
  });
};

