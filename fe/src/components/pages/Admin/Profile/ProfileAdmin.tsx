import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Typography, message } from "antd";
import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../../../provider/duProvider";

const ProfileAdmin = () => {
  const [infoForm] = Form.useForm();
  const [passForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [admin, setAdmin] = useState<any>({});

  useEffect(() => {
    getAdminProfile().then((res) => {
      setAdmin(res.data);
      infoForm.setFieldsValue(res.data);
    });
  }, []);

  const handleSaveProfile = async () => {
    try {
      const values = await infoForm.validateFields();
      await updateAdminProfile(values);
      message.success("Cập nhật thành công");
      setEditing(false);
    } catch (err) {
      message.error("Lỗi cập nhật");
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      await changeAdminPassword(values);
      message.success("Đổi mật khẩu thành công");
      passForm.resetFields();
    } catch (err) {
      message.error("Lỗi đổi mật khẩu");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingTop: 32 }}>
      <Card
        title={<Typography.Title level={4}>👤 Thông tin cá nhân</Typography.Title>}
        extra={
          !editing && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )
        }
      >
        <Form layout="vertical" form={infoForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<><UserOutlined /> Họ và tên</>}
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input disabled={!editing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><PhoneOutlined /> Số điện thoại</>}
                name="phone"
              >
                <Input disabled={!editing} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={<><MailOutlined /> Email</>}
            name="email"
          >
            <Input disabled />
          </Form.Item>
          {editing && (
            <Button type="primary" onClick={handleSaveProfile}>
              Lưu thông tin
            </Button>
          )}
        </Form>
      </Card>

      <div style={{ height: 24 }}></div>

      <Card
        title={<Typography.Title level={4}><LockOutlined /> Đổi mật khẩu</Typography.Title>}
      >
        <Form layout="vertical" form={passForm} onFinish={handleChangePassword}>
          <Form.Item
            label="🔒 Mật khẩu cũ"
            name="old_password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="🔒 Mật khẩu mới"
            name="new_password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>

          <Button danger type="primary" htmlType="submit">
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileAdmin;
