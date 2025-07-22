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
  EditOutlined,
  StarOutlined,
  HistoryOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Profile.css";
import { useListDiem } from "../../hook/hungHook";
import { Link, useNavigate } from "react-router-dom";
import { color } from "framer-motion";
import { useGoogleAuth } from "../auth/GoogleAuth";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const { data: listDiem } = useListDiem({ resource: "diem_thanh_vien" });
  const { logout } = useGoogleAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
          <Card className="profile-sidebar-card" style={{ position: "sticky", top: "130px" }}>
            <div
              className="profile-sidebar-content"
              style={{ textAlign: "center" }}
            >
              <div className="thongtinavtten">
                <Avatar
                  size={50}
                  src={user.anh_dai_dien || undefined}
                  icon={!user.avatar && <UserOutlined />}
                  className="profile-avatar"
                />
                <h2 className="profile-username">
                  {user.ten || "Chưa cập nhật"}
                </h2>
              </div>
              <button className="profile-role-button">
                {user.vaitro}
              </button>
              <div className="profile-poin-wrapper">
                <p className="profile-poin">Tích điểm:</p>
                <p className="profile-poin2">Thành viên</p>
              </div>
              <p className="profile-total-poin">{listDiem?.data?.diem}</p>
            </div>
            {/* Menu Navigation */}
            <div className="profile-menu">
              <Link
                to="/profile"
                className="profile-menu-item profile-menu-textttkh"
              >
                <UserOutlined
                  className="profile-menu-icon"
                  style={{ color: "yellow" }}
                />
                <span className="profile-menu-text" style={{ color: "yellow" }}>
                  Thông tin khách hàng
                </span>
              </Link>

              <Link to="#" className="profile-menu-item">
                <StarOutlined className="profile-menu-icon" />
                <span className="profile-menu-text">
                  Thành viên StarTickets
                </span>
              </Link>

              <Link
                to="/history-all"
                className="profile-menu-item profile-menu-textht"
              >
                <HistoryOutlined className="profile-menu-icon" />
                <span className="profile-menu-text">Lịch sử mua hàng</span>
              </Link>

              {[1, 3, 4, 99].includes(user?.vai_tro_id) && (
                <Link
                  to="/admin"
                  className="profile-menu-item profile-logout"
                >
                  <SettingOutlined className="profile-menu-icon" />
                  <span className="profile-menu-logout">Trang quản trị</span>
                </Link>
              )}
              <div
                className="profile-menu-item profile-logout"
                onClick={handleLogout}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && logout()} // hỗ trợ accessibility
              >
                <LogoutOutlined className="profile-menu-icon" />
                <span className="profile-menu-logout">Đăng xuất</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Nội dung chính bên phải */}

        <Col xs={24} md={16} lg={18}>
          <h1 className="profile-title-ttkh">THÔNG TIN KHÁCH HÀNG</h1>
          {/* Thông tin cá nhân */}
          <Card className="profile-content-card">
            <div className="profile-card-header">
              <Title level={3} className="profile-card-title">
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
                      <Text className="profile-form-label">Họ và tên</Text>
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
                      <Text className="profile-form-label">Số điện thoại</Text>
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
                label={<Text className="profile-form-label">Email</Text>}
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
                      <Text className="profile-form-label">Mã xác nhận</Text>
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
                        {countdown > 0 ? `GỬI LẠI (${countdown}s)` : "GỬI MÃ"}
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
                        LƯU THÔNG TIN
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="profile-button-secondary"
                      >
                        HỦY
                      </Button>
                    </Space>
                  </Form.Item>
                </>
              )}
            </Form>
          </Card>

          {/* Đổi mật khẩu */}
          <Card className="profile-content-card">
            <div className="profile-card-header">
              <Title level={3} className="profile-card-title">
                Đổi mật khẩu
              </Title>
            </div>

            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={handleChangePassword}
            >
              <Form.Item
                label={<Text className="profile-form-label">Mật khẩu cũ</Text>}
                name="mat_khau_cu"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                  { min: 8, message: "Mật khẩu tối thiểu 8 ký tự!" },
                ]}
              >
                <Input.Password className="profile-input-danger" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Text className="profile-form-label">Mật khẩu mới</Text>
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
                    <Input.Password className="profile-input-danger" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Text className="profile-form-label">
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
                    <Input.Password className="profile-input-danger" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="profile-password-form-actions">
                <Button htmlType="submit" className="profile-button-primary">
                  ĐỔI MẬT KHẨU
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
