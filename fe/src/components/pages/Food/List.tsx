import React, { useEffect, useState } from 'react';
import { getActiveFoods, deleteFood } from '../../provider/index';
import { Food } from '../../types/Uses';
import FoodTable from '../../../components/Food/FoodTable';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, message } from 'antd';

const { confirm } = Modal;

const FoodList = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const navigate = useNavigate();

  const fetchFoods = async () => {
    const data = await getActiveFoods();
    setFoods(data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = (id: number) => {
    const food = foods.find(f => f.id === id);

    confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa món "${food?.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteFood(id);
          message.success('Xóa món ăn thành công');
          fetchFoods();
        } catch {
          message.error('Xóa món ăn thất bại');
        }
      },
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => navigate('/food/add')} style={{ marginBottom: 16, marginLeft: 1200 }}>
        + Thêm đồ ăn
      </Button>
      <FoodTable
        foods={foods}
        onEdit={(id) => navigate(`/food/edit/${id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FoodList;
