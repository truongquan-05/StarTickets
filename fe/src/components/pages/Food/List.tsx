import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useListFoods, useDeleteFood } from "../../hook/duHook"; // đường dẫn tùy bạn
import FoodTable from "../../../components/Food/FoodTable";

const { confirm } = Modal;

const FoodList = () => {
  const navigate = useNavigate();
  const { data: foods = [] } = useListFoods();
  const deleteFood = useDeleteFood();

  const handleDelete = (id: number, ten_do_an: string) => {
    confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa món "${ten_do_an}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteFood.mutate(id),
    });
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => navigate("/admin/food/add")}
        style={{ marginBottom: 16 }}
      >
        + Thêm món ăn
      </Button>
      <FoodTable
        foods={foods}
        onEdit={(id) => navigate(`/admin/food/edit/${id}`)}
        onDelete={(id) => {
          const food = foods.find((f) => f.id === id);
          if (food) handleDelete(id, food.ten_do_an);
        }}
      />
    </div>
  );
};

export default FoodList;
