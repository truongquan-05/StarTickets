// provider/cinema.ts
import { axiosClient } from ".";
import type { Props } from ".";

//lấy danh sách rạp
export const getListCinema = async ({ resource = "cinemas" }: Props) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

//xóa rạp
export const getDeleteCinema = async ({ resource = "cinemas", id }: Props) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};
