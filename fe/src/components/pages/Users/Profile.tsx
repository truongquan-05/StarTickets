import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Avatar,
  Typography,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  SafetyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Profile.css";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSendCode = async () => {
    if (countdown > 0) return;

    // Lấy user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    try {
      await axios.post(`http://localhost:8000/api/ma_xac_thuc/${userId}`);
      message.success(`Mã xác nhận đã được gửi đến ${user.email}`);
      setCountdown(60);
    } catch (error) {
      console.error(error);
      message.error("Gửi mã thất bại!");
    }
  };

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Set form default values
      form.setFieldsValue({
        ...parsedUser,
      });
    }
  }, [form]);

  const handleUpdateInfo = async (values: any) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        message.error("Không tìm thấy người dùng.");
        return;
      }

      const user = JSON.parse(storedUser);

      const payload = {
        ...values,
        id: user.id,
        email: user.email, // để đảm bảo email gửi đúng (nếu không sửa)
      };

      await axios.put(
        `http://localhost:8000/api/nguoi_dung/${user.id}`,
        payload
      );

      // 🔁 Gộp user cũ với dữ liệu vừa sửa
      const updatedUser = {
        ...user,
        ten: values.ten,
        so_dien_thoai: values.so_dien_thoai,
        email: values.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      form.resetFields();
      form.setFieldsValue(updatedUser);
      setIsEditing(false);

      message.success("Cập nhật thành công!");
    } catch (error: any) {
      console.error(error);
      message.error(
        error?.response?.data?.error || "Xác thực hoặc cập nhật thất bại!"
      );
    }
  };

  const handleChangePassword = async (values: any) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.error("Không tìm thấy người dùng.");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      await axios.put(
        `http://localhost:8000/api/nguoi_dung/${user.id}`,
        values
      );
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  if (!user) {
    return (
      <div className="profile-loading-container">
        <Card className="profile-loading-card">
          <div className="profile-loading-text">
            Đang tải thông tin người dùng...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <Row gutter={24}>
        {/* Sidebar bên trái - Avatar và Email */}
        <Col xs={24} md={8} lg={6}>
          <Card className="profile-sidebar-card">
            <div className="profile-sidebar-content">
              <Avatar
                size={120}
                src={user.anh_dai_dien || undefined}
                icon={!user.avatar && <UserOutlined />}
                className="profile-avatar"
              />
              <Title level={2} className="profile-username">
                {user.ten || "Chưa cập nhật"}
              </Title>
            </div>
          </Card>
        </Col>

        {/* Nội dung chính bên phải */}
        <Col xs={24} md={16} lg={18}>
          {/* Thông tin cá nhân */}
          <Card className="profile-content-card">
            <div className="profile-card-header">
              <Title level={3} className="profile-card-title">
                <UserOutlined className="profile-form-label-icon" />
                Thông tin cá nhân
              </Title>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
                className={`profile-edit-button ${
                  isEditing ? "profile-edit-button-cancel" : ""
                }`}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </Button>
            </div>

            <Form layout="vertical" form={form} onFinish={handleUpdateInfo}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Text className="profile-form-label">
                        <UserOutlined className="profile-form-label-icon" />
                        Họ và tên
                      </Text>
                    }
                    name="ten"
                  >
                    <Input
                      disabled={!isEditing}
                      className={
                        isEditing
                          ? "profile-input-enabled"
                          : "profile-input-disabled"
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Text className="profile-form-label">
                        <PhoneOutlined className="profile-form-label-icon" />
                        Số điện thoại
                      </Text>
                    }
                    name="so_dien_thoai"
                  >
                    <Input
                      disabled={!isEditing}
                      className={
                        isEditing
                          ? "profile-input-enabled"
                          : "profile-input-disabled"
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <Text className="profile-form-label">
                    <MailOutlined className="profile-form-label-icon" />
                    Email
                  </Text>
                }
                name="email"
              >
                <Input
                  disabled={!isEditing}
                  className={
                    isEditing
                      ? "profile-input-enabled"
                      : "profile-input-disabled"
                  }
                />
              </Form.Item>

              {isEditing && (
                <>
                  <Form.Item
                    label={
                      <Text className="profile-form-label-success">
                        <SafetyOutlined className="profile-form-label-icon" />
                        Mã xác nhận
                      </Text>
                    }
                    required
                  >
                    <Input.Group compact style={{ display: "flex" }}>
                      <Form.Item
                        name="ma_xac_nhan"
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mã xác nhận!",
                          },
                        ]}
                      >
                        <Input
                          className="profile-verification-input"
                          placeholder="Nhập mã xác nhận"
                        />
                      </Form.Item>
                      <Button
                        className={`profile-verification-button ${
                          countdown > 0
                            ? "profile-verification-button-disabled"
                            : "profile-verification-button-active"
                        }`}
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                      >
                        {countdown > 0 ? `${countdown}s` : "Gửi mã"}
                      </Button>
                    </Input.Group>
                  </Form.Item>

                  <Form.Item className="profile-form-actions">
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="profile-button-primary"
                      >
                        Cập nhật thông tin
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="profile-button-secondary"
                      >
                        Hủy
                      </Button>
                    </Space>
                  </Form.Item>
                </>
              )}
            </Form>
          </Card>

          {/* Đổi mật khẩu */}
          <Card className="profile-content-card">
            <Title level={3} className="profile-card-title-password">
              <LockOutlined className="profile-form-label-icon" />
              Đổi mật khẩu
            </Title>

            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={handleChangePassword}
            >
              <Form.Item
                label={
                  <Text className="profile-form-label-danger">
                    <LockOutlined className="profile-form-label-icon" />
                    Mật khẩu cũ
                  </Text>
                }
                name="mat_khau_cu"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                  { min: 8, message: "Mật khẩu tối thiểu 8 ký tự!" },
                ]}
              >
                <Input.Password
                  className="profile-input-danger"
                  placeholder="Nhập mật khẩu cũ"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Text className="profile-form-label-danger">
                        <LockOutlined className="profile-form-label-icon" />
                        Mật khẩu mới
                      </Text>
                    }
                    name="mat_khau_moi"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới!",
                      },
                      { min: 8, message: "Mật khẩu tối thiểu 8 ký tự!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("mat_khau_cu") !== value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Mật khẩu mới không được trùng mật khẩu cũ!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      className="profile-input-danger"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Text className="profile-form-label-danger">
                        <SafetyOutlined className="profile-form-label-icon" />
                        Xác thực mật khẩu
                      </Text>
                    }
                    name="xac_thuc_mat_khau"
                    dependencies={["mat_khau_moi"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng xác thực lại mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("mat_khau_moi") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Xác thực mật khẩu không khớp!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      className="profile-input-danger"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="profile-password-form-actions">
                <Button
                  type="danger"
                  htmlType="submit"
                  className="profile-button-danger"
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
