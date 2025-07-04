import React from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Text, Link } = Typography;

const Register = () => {
  const [form] = Form.useForm();

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={20} md={16} lg={12} xl={10} className="login-box">
          <h2 className="login-title">Đăng ký</h2>

          <Form
            form={form}
            name="registerForm"
            layout="vertical"
            className="login-form"
            scrollToFirstError
          >
            {/* Tên */}
            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Tên</span>}
              name="ten"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên của bạn"
                size="large"
                style={{ borderRadius: "1px" }}
              />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Số điện thoại</span>}
              name="so_dien_thoai"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^\d+$/, message: 'Số điện thoại chỉ được chứa số' },
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

            {/* Email */}
            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email của bạn"
                size="large"
                style={{ borderRadius: "1px" }}
              />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Mật khẩu</span>}
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
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

            {/* Xác nhận mật khẩu */}
            <Form.Item
              label={<span style={{ color: "white", fontWeight: 600 }}>Xác nhận mật khẩu</span>}
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu xác nhận không khớp!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu"
                size="large"
                style={{ borderRadius: "1px" }}
              />
            </Form.Item>

            {/* Nút Đăng ký */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="btn-submit-login-effect"
              >
                <span>Đăng ký</span>
              </Button>
            </Form.Item>

            <Divider style={{ backgroundColor: "yellow" }} />

            {/* Link quay lại đăng nhập */}
            <Form.Item style={{ textAlign: 'center' }}>
              <Text style={{ color: "white" }}>
                Bạn đã có tài khoản?{" "}
                <Link href="/login" style={{ color: "yellow", textDecoration: "underline" }}>
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
