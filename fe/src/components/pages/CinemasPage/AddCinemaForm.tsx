// src/components/AddCinemaForm.tsx

import { Button, Card, Form, Input, message } from "antd";
import { useCreateCinema } from "../../hook/thinhHook";

export interface CinemasForm {
  ten_rap: string;
  dia_chi: string;
}

const AddCinemasPage = () => {
  const [form] = Form.useForm<CinemasForm>();
  const { mutate: createMutate } = useCreateCinema({ resource: "rap" });

  const onFinish = (values: CinemasForm) => {
    createMutate(values, {
      onSuccess: () => {
        message.success("Cinema created successfully");
        form.resetFields();
      },
      onError: () => {
        message.error("Create cinema failed");
      },
    });
  };

  return (
    <Card
      title="Thêm mới rạp"
      bordered={true}
      style={{ margin: "10px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
    >
      <Form<CinemasForm> form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Name"
          name="ten_rap"
          rules={[{ required: true, message: "Please enter cinema name" }]}
        >
          <Input placeholder="Enter cinema name" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="dia_chi"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Create
        </Button>
      </Form>
    </Card>
  );
};

export default AddCinemasPage;