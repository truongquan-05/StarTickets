import { useEffect } from "react";
import { Form, Input, InputNumber, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateFood } from "../../hook/duHook";
import { Food } from "../../types/Uses";
import axios from "axios";

const FoodEdit = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const updateFood = useUpdateFood();

  useEffect(() => {
    const fetchFood = async () => {
      const { data } = await axios.get<Food>(`http://127.0.0.1:8000/api/do_an/${id}`);
      form.setFieldsValue(data);
    };
    if (id) fetchFood();
  }, [id]);

  const onFinish = (values: Partial<Food>) => {
    if (id) {
      updateFood.mutate(
        { id: Number(id), values },
        {
          onSuccess: () => {
            navigate("/admin/food");
          },
        }
      );
    }
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
          { type: "number", min: 1000, message: "Giá phải lớn hơn 1000" },
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
        <Button type="primary" htmlType="submit">Cập nhật</Button>
      </Form.Item>
    </Form>
  );
};

export default FoodEdit;
