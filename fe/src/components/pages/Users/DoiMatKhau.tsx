import {
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const DoiMatKhau = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const nav = useNavigate();

  // Lấy email và token từ state truyền sang (có thể dùng query nếu muốn)
  const { email, token } = location.state || {};

  const onFinish = async (values: any) => {
    

    try {
      await axios.post("http://localhost:8000/api/reset-password", {
        email,
        token,
        password: values.password,
      });

      message.success("Đổi mật khẩu thành công!");
      nav("/login");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={20} md={16} lg={12} xl={10} className="login-box">
          <h2 className="login-title">Đặt lại mật khẩu</h2>
          <Form
            form={form}
            name="resetPasswordForm"
            layout="vertical"
            onFinish={onFinish}
            className="login-form"
          >
            <Form.Item
              label={<span style={{ color: "white" }}>Mật khẩu mới</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "white" }}>Nhập lại mật khẩu</span>}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
                size="large"
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
                Đổi Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default DoiMatKhau;
