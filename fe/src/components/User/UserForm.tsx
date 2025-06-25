import { Form, Input, Select, Switch, Button } from "antd";
import { User } from "../types/Uses";
import { useEffect } from "react";

type Props = {
  initialData?: Partial<User>;
  onSubmit: (user: Omit<User, "id">) => void;
  isEdit?: boolean;
};

const UserForm = ({ initialData = {}, onSubmit, isEdit = false }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ten: "",
      email: "",
      password: "",
      so_dien_thoai: "",
      anh_dai_dien: "",
      vai_tro_id: "",
      isActive: true,
      ...initialData,
    });
  }, [initialData, form]);

  const handleFinish = (values: any) => {
    // Loại bỏ confirmPassword trước khi gửi lên
    const { confirmPassword, ...data } = values;
    onSubmit(data);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Tên"
        name="ten"
        rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
      >
        <Input placeholder="Nhập tên" />
      </Form.Item>
       
       
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Vui lòng nhập email" }]}
      >
        <Input placeholder="Nhập email" disabled={isEdit} />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password placeholder="Nhập mật khẩu" disabled={isEdit}  />
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
  <Input.Password placeholder="Nhập lại mật khẩu" disabled={isEdit}/>
</Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="so_dien_thoai"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Ảnh đại diện"
        name="anh_dai_dien"
        rules={[{ required: true, message: "Vui lòng nhập URL ảnh đại diện" }]}
      >
        <Input placeholder="Nhập URL ảnh" />
      </Form.Item>

      <Form.Item label="Vai trò" name="vai_tro_id">
        <Select>
          <Select.Option value={1}>User</Select.Option>
          <Select.Option value={2}>Admin</Select.Option>
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
