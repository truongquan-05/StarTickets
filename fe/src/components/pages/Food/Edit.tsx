import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FoodForm from '../../../components/Food/FoodForm';
import { getFoodById, updateFood } from '../../provider/index';
import { Food } from '../../types/Uses';
import { message } from 'antd'; 

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const { data } = await getFoodById(Number(id));
        setFood(data);
      } catch {
        message.error('Lấy thông tin món ăn thất bại');
      }
    };
    fetchFood();
  }, [id]);

  const handleFinish = async (values: any) => {
    const image = values.image?.file?.name || food?.image || '';
    try {
      await updateFood(Number(id), { ...values, image });
      message.success('Cập nhật món ăn thành công'); 
      navigate('/food');
    } catch {
      message.error('Cập nhật món ăn thất bại'); 
    }
  };

  return (
    <div>
      <h2>Cập nhật đồ ăn</h2>
      {food && <FoodForm initialValues={food} onFinish={handleFinish} isEdit />}
    </div>
  );
};

export default EditFood;
