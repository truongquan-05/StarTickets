import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { GoogleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useGoogleAuth } from "./GoogleAuth";
import { useNavigate } from "react-router-dom";

const { Text, Link } = Typography;

const Login = () => {
  const { loginWithGoogle } = useGoogleAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // để chuyển hướng sau khi đăng nhập

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          message.error(data.message || "Email hoặc mật khẩu không đúng.");
        } else {
          message.error("Đã xảy ra lỗi khi đăng nhập.");
        }
      } else {
        message.success("Đăng nhập thành công!");
        // Lưu token và thông tin người dùng vào localStorage (hoặc context)
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Điều hướng đến trang chính
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={20} md={16} lg={12} xl={10} className="login-box">
          <h2 className="login-title">Đăng nhập</h2>
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập email của bạn"
                size="large"
                style={{ borderRadius: "1px" }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
                style={{ borderRadius: "1px" }}
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="custom-checkboxx" style={{ color: "white" }}>
                      Ghi nhớ đăng nhập
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Link
                    href="/forgot-password"
                    style={{ color: "white", textDecoration: "underline" }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="btn-submit-login-effect"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Divider style={{ backgroundColor: "yellow" }} />

            <Form.Item style={{ textAlign: "center" }}>
              <Text style={{ color: "white" }}>
                Bạn chưa có tài khoản?{" "}
                <Link href="/register" style={{ color: "yellow", textDecoration: "underline" }}>
                  Đăng ký ngay
                </Link>
              </Text>
            </Form.Item>

            {/* Nút đăng nhập nhanh */}
            <Form.Item>
              <Button
                type="primary"
                icon={<GoogleOutlined style={{ marginRight: 5, fontSize: 20 }} />}
                size="large"
                className="btn-submit-gg-effect"
                block
                onClick={loginWithGoogle}
              >
                Đăng nhập với Google
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
