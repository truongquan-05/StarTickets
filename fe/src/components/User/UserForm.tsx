import { Form, Input, Select, Switch, Button } from "antd";
import { User } from "../types/Uses";
import { useEffect } from "react";

type Props = {
  initialData?: Partial<User>;
  onSubmit: (user: Omit<User, "id">) => void;
};

const UserForm = ({ initialData = {}, onSubmit }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: "",
      email: "",
      password: "",
      phone: "",
      avatar: "",
      role: "user",
      isActive: true,
      ...initialData,
    });
  }, [initialData, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ isActive: true }}
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
      >
        <Input placeholder="Nhập tên" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Vui lòng nhập email" }]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password placeholder="Nhập mật khẩu" />
      </Form.Item>
      <Form.Item
        label="Nhập lại mật khẩu"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
        { required: true, message: "Vui lòng nhập lại mật khẩu" },
        ({ getFieldValue }) => ({
        validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error("Mật khẩu nhập lại không khớp")
        );
      },
    }),
  ]}
>
  <Input.Password placeholder="Nhập lại mật khẩu" />
</Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Ảnh đại diện"
        name="avatar"
        rules={[{ required: true, message: "Vui lòng nhập URL ảnh đại diện" }]}
      >
        <Input placeholder="Nhập URL ảnh" />
      </Form.Item>

      <Form.Item label="Vai trò" name="role">
        <Select>
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
