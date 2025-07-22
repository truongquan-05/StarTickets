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
import {  UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/xac-nhan-ma",
        {
          email: values.email,
          token:values.token
        }
      );
     if (response) {
        nav("/change-password", {
          state: {
            email: values.email,
            token: values.token, // giả sử token có trong response
          },
        });
      }
    } catch (err: any) {
      message.error("Nhập sai mã xác minh!");
    }
  };
  const handleSendCode = async () => {
    const email = form.getFieldValue("email");
    

    if (!email) {
      message.warning("Vui lòng nhập email trước!");
      return;
    }

    if (countdown > 0) return;

    try {
      await axios.post("http://localhost:8000/api/forget-password", {
      email: email,
    });

      message.success(`Mã xác nhận đã gửi đến ${email}`);
      
      setCountdown(120);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      message.error("Gửi mã thất bại!");
    }
  };

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={20} md={16} lg={12} xl={10} className="login-box">
          <h2 className="login-title">Quên Mật Khẩu</h2>
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
            form={form}
          >
            <Form.Item
              label={
                <span
                  style={{
                    color: "white",
                    fontWeight: 100,
                    fontFamily: "Alata, sans-serif",
                  }}
                >
                  Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Row gutter={8}>
                <Col flex="auto">
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập email của bạn"
                    size="large"
                    style={{
                      fontFamily: "Alata, sans-serif",
                    }}
                  />
                </Col>
                <Col>
                  <Button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    size="large"
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {countdown > 0 ? `GỬI LẠI (${countdown}s)` : "GỬI MÃ"}
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label={
                <span
                  style={{
                    color: "white",
                    fontWeight: 100,
                    fontFamily: "Alata, sans-serif",
                  }}
                >
                  Mã Xác Minh
                </span>
              }
              name="token"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác minh!" },
              ]}
            >
              <Input
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
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="btn-submit-login-effect"
              >
                Tiếp Tục
              </Button>
            </Form.Item>

            <Divider style={{ backgroundColor: "yellow" }} />
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
