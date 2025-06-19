import React from 'react';
import { Form, Input, Button, Typography, Row, Col, Divider } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
const { Title, Text, Link } = Typography;

const Register = () => {
  const [form] = Form.useForm();

  // const onFinish = (values) => {
  //   console.log('Register form values:', values);
  //   // TODO: gửi dữ liệu lên backend
  // };

  return (
    <div className="login-background">
      <Row justify="center" align="middle" className="login-container">
        <Col xs={22} sm={20} md={16} lg={12} xl={10} className="login-box">
          <Title level={3} style={{ marginBottom: 24 }}>
            Đăng ký
          </Title>

          <Form
            form={form}
            name="registerForm"
            // onFinish={onFinish}
            layout="vertical"
            className="login-form"
            scrollToFirstError
          >
            {/* Tên */}
            <Form.Item
              label="Tên"
              name="ten"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên của bạn"
                size="large"
              />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label="Số điện thoại"
              name="so_dien_thoai"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                {
                  pattern: /^\d+$/,
                  message: 'Số điện thoại chỉ được chứa số',
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
                size="large"
                maxLength={15}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
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
              />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label="Mật khẩu"
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
              />
            </Form.Item>

            {/* Xác nhận mật khẩu */}
            <Form.Item
              label="Xác nhận mật khẩu"
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
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ fontWeight: 'bold' }}
              >
                Đăng Ký
              </Button>
            </Form.Item>

            <Divider />

            <Form.Item style={{ textAlign: 'center' }}>
              <Text>
                Bạn đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
              </Text>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
