import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeleteCinema, getListCinema } from "../provider/cinema"; //  Sửa dòng này
import type { Props } from "../provider";

//lấy danh sách rạp
export const useListCinema = ({ resource = "cinemas" }: Props) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getListCinema({ resource }),
  });
};

//xóa rạp
export const useDeleteCinema = ({ resource = "cinemas" }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id?: string | number) => getDeleteCinema({ resource, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
