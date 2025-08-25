import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  useEffect(() => {
    getAdminProfile(user.id).then((res) => {
      setAdmin(res.data);
      infoForm.setFieldsValue(res.data);
    });
  }, []);

  const handleSaveProfile = async () => {
    try {
      const values = await infoForm.validateFields();

      if (selectedFile) {
        const formData = new FormData();
        formData.append("ten", values.ten);
        formData.append("so_dien_thoai", values.so_dien_thoai || "");
        formData.append("email", values.email || "");
        formData.append("anh_dai_dien", selectedFile);
        const res = await updateAdminProfile(formData, user.id);
        setAdmin(res.data.data);
        infoForm.setFieldsValue(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));

        
      } else {
        const res = await updateAdminProfile(values, user.id);
        setAdmin(res.data.data);
        infoForm.setFieldsValue(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      }

      message.success("Cập nhật thành công");
      setEditing(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi cập nhật thông tin");
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      await changeAdminPassword(values, user.id);
      message.success("Đổi mật khẩu thành công");
      passForm.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi cập nhật thông tin");
    }
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được phép tải ảnh!");
    }
    return isImage;
  };

  const handleChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ margin: "0 auto", padding: "32px 16px" }}>
      <Card
        title={
          <Typography.Title level={4}>👤 Thông tin cá nhân</Typography.Title>
        }
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
        style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Row gutter={24}>
          <Col
            xs={24}
            md={6}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              src={
                imageUrl ||
                `http://127.0.0.1:8000/storage/${admin?.anh_dai_dien}`
              }
              size={100}
              style={{ marginBottom: 16 }}
            />
            {editing && (
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            )}
          </Col>

          <Col xs={24} md={18}>
            <Form layout="vertical" form={infoForm}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="ten"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input
                      disabled={!editing}
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ và tên"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Số điện thoại" name="so_dien_thoai">
                    <Input
                      disabled={!editing}
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Email" name="email">
                <Input
                  disabled={!editing}
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                />
              </Form.Item>
              {editing && (
                <Form.Item style={{ textAlign: "right" }}>
                  <Button type="primary" onClick={handleSaveProfile}>
                    Lưu thông tin
                  </Button>
                  <Button
                    style={{ marginLeft: 12 }}
                    type="default"
                    onClick={() => setEditing(false)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>

      <div style={{ height: 24 }} />

      <Card
        title={
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            <LockOutlined /> Đổi mật khẩu
          </Typography.Title>
        }
        style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Form layout="vertical" form={passForm} onFinish={handleChangePassword}>
          <Form.Item
            label="Mật khẩu cũ"
            name="old_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ" },
              { min: 8, message: "Mật khẩu phải ít nhất 8 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu cũ"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 8, message: "Mật khẩu phải ít nhất 8 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirm_password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button danger type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileAdmin;
