// pages/Food/FoodAdd.tsx

import { Form, Input, InputNumber, Button } from "antd";
import { useCreateFood } from "../../hook/duHook";
import { Food } from "../../types/Uses";


const FoodAdd = () => {
  
  const [form] = Form.useForm();
  const createFood = useCreateFood();

  const onFinish = (values: Omit<Food, "id">) => {
    createFood.mutate(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="ten_do_an" label="Tên món ăn" rules={[{ required: true, message: "Không được để trống" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="mo_ta" label="Mô tả" rules={[{ required: true, message: "Không được để trống" }]}>
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="gia"
        label="Giá"
        rules={[
          { required: true, message: "Không được để trống" },
          { type: "number", min: 100, message: "Giá phải lớn hơn 100" },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="so_luong_ton"
        label="Số lượng tồn"
        rules={[
          { required: true, message: "Không được để trống" },
          { type: "number", min: 0, message: "Số lượng tồn phải từ 0 trở lên" },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Thêm</Button>
      </Form.Item>
    </Form>
    
  );
};

export default FoodAdd;
