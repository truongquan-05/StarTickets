import {
  Form,
  Input,
  Button,
  // Checkbox,
  Typography,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { GoogleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useGoogleAuth } from "./GoogleAuth";
import axios from "axios";
const { Text, Link } = Typography;

const Login = () => {
  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      const { user, access_token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);

      // Phân quyền chuyển hướng
      const vaiTroId = user?.vai_tro_id;
      if (vaiTroId === 2 || vaiTroId === null) {
        window.location.href = "/"; // Không có quyền admin
      } else {
        window.location.href = "/admin"; // Có quyền admin
      }
    } catch (err: any) {
      
      message.error(err?.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  const { loginWithGoogle } = useGoogleAuth();
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
              label={
                <span style={{ color: "white", fontWeight: 100, fontFamily: "Alata, sans-serif" }}>Email</span>
              }
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
                style={{
                  borderRadius: "1px",
                  fontFamily: "Alata, sans-serif",
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: "white", fontWeight: 100, fontFamily: "Alata, sans-serif" }}>
                  Mật khẩu
                </span>
              }
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
                style={{
                  borderRadius: "1px",
                  fontFamily: "Alata, sans-serif",
                }}
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Col>
                  {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox
                      className="custom-checkboxx"
                      style={{ color: "white" }}
                    >
                      Ghi nhớ đăng nhập
                    </Checkbox>
                  </Form.Item> */}
                </Col>
                <Col>
                  <Link
                    href="/forgot-password"
                    style={{ color: "white", textDecoration: "underline", fontFamily: "Alata, sans-serif" }}
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
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Divider style={{ backgroundColor: "yellow" }} />

            <Form.Item style={{ textAlign: "center" }}>
              <Text style={{ color: "white", fontFamily: "Alata, sans-serif" }}>
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  style={{ color: "yellow", textDecoration: "underline", fontFamily: "Alata, sans-serif" }}
                >
                  Đăng ký ngay
                </Link>
              </Text>
            </Form.Item>

            {/* Nút đăng nhập nhanh */}
            <Form.Item>
              <Button
                type="primary"
                icon={
                  <GoogleOutlined style={{ marginRight: 5, fontSize: 20 }} />
                }
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
