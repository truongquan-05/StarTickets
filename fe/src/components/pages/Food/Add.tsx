import FoodForm from '../../../components/Food/FoodForm';
import { createFood } from '../../provider/duProvider';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; 

const AddFood = () => {
  const navigate = useNavigate();

  const handleFinish = async (values: any) => {
    const image = values.image?.file?.name || '';
    try {
      await createFood({ ...values, image });
      message.success('Thêm món ăn thành công'); 
      navigate('/food');
    } catch {
      message.error('Thêm món ăn thất bại'); 
    }
  };

  return (
    <div>
      <h2>Thêm đồ ăn</h2>
      <FoodForm onFinish={handleFinish} />
    </div>
  );
};

export default AddFood;
