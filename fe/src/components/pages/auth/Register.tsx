import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  RightOutlined,
  GoogleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useGoogleAuth } from "./GoogleAuth";

const { Text, Link } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const { loginWithGoogle } = useGoogleAuth(); // hook đăng nhập với Google

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={22} md={20} lg={20} xl={18} className="login-box">
          <h2 className="login-title">Đăng ký</h2>

          <Form
            form={form}
            name="registerForm"
            layout="vertical"
            className="login-form"
            scrollToFirstError
          >
            <Row gutter={30}>
              {/* Cột trái */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span style={{ color: "white", fontWeight: 600 }}>
                      Họ và tên{" "}
                    </span>
                  }
                  name="ten"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập tên của bạn"
                    size="large"
                    style={{ borderRadius: "1px" }}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span style={{ color: "white", fontWeight: 600 }}>
                      Email
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Nhập email của bạn"
                    size="large"
                    style={{ borderRadius: "1px" }}
                  />
                </Form.Item>
              </Col>

              {/* Cột phải */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span style={{ color: "white", fontWeight: 600 }}>
                      Số điện thoại
                    </span>
                  }
                  name="so_dien_thoai"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^\d+$/,
                      message: "Số điện thoại chỉ được chứa số",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại"
                    size="large"
                    maxLength={15}
                    style={{ borderRadius: "1px" }}
                  />
                </Form.Item>

                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span style={{ color: "white", fontWeight: 600 }}>
                          Mật khẩu
                        </span>
                      }
                      name="password"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                        { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                      ]}
                      hasFeedback
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu"
                        size="large"
                        style={{ borderRadius: "1px" }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={
                        <span style={{ color: "white", fontWeight: 600 }}>
                          Xác thực mật khẩu
                        </span>
                      }
                      name="confirm"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng xác thực mật khẩu!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Mật khẩu xác thực không khớp!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Xác thực mật khẩu"
                        size="large"
                        style={{ borderRadius: "1px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Chính sách và điều khoản */}
            <Form.Item style={{ textAlign: "left" }}>
              <Link
                href="/privacy-policy"
                target="_blank"
                style={{ color: "yellow" }}
              >
                <RightOutlined />
                ㅤXem chính sách bảo mật
              </Link>
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Vui lòng chấp nhận với các điều khoản của chúng tôi!")
                        ),
                },
              ]}
            >
              <Checkbox className="custom-checkboxx" style={{ color: "white" }}>
                Tôi cam kết tuân theo chính sách bảo mật và điều khoản sử dụng
                của StarTickets.
              </Checkbox>
            </Form.Item>

            {/* Nút đăng ký */}
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={
                      <SolutionOutlined
                        style={{ marginRight: 5, fontSize: 20 }}
                      />
                    }
                    htmlType="submit"
                    block
                    size="large"
                    className="btn-submit-login-effect"
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={
                      <GoogleOutlined
                        style={{ marginRight: 5, fontSize: 20 }}
                      />
                    }
                    size="large"
                    className="btn-submit-gg-effect"
                    block
                    onClick={loginWithGoogle}
                  >
                    Tiếp tục với Google
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ backgroundColor: "yellow" }} />

            <Form.Item style={{ textAlign: "center" }}>
              <Text style={{ color: "white" }}>
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  style={{ color: "yellow", textDecoration: "underline" }}
                >
                  Đăng nhập ngay
                </Link>
              </Text>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
