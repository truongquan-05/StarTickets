// src/components/AddCinemaForm.tsx

import { Button, Form, Input } from "antd";
import { useCreateCinema } from "../../hook/thinhHook";

export interface CinemasForm {
  name: string;
  address: string;
}

const AddCinemasPage = () =>{
  const [form] = Form.useForm<CinemasForm>();
  const { mutate: createMutate } = useCreateCinema({ resource: "rap" });

  const onFinish = (values: CinemasForm) => {
    createMutate(values);
    form.resetFields();
    // Bạn có thể thêm thông báo hoặc chuyển hướng ở đây
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Add Cinema</h2>
      <Form<CinemasForm> form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Name"
          name="ten_rap"
          rules={[{ required: true, message: "Please enter cinema name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="dia_chi"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Create
        </Button>
      </Form>
    </div>
  );
};

export default AddCinemasPage;
