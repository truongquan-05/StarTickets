import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Divider } from 'antd';
import { GoogleOutlined, FacebookOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Login = () => {
  // const onFinish = (values) => {
  //   console.log('Login form values:', values);
  //   // TODO: xử lý đăng nhập
  // };

  return (
    <div className="login-background">
      <Row
        justify="center"
        align="middle"
        className="login-container"
      >
        <Col
          xs={22}
          sm={20}
          md={16}
          lg={12}
          xl={10}
          className="login-box"
        >
          <Title level={3} style={{ marginBottom: 24 }}>
            Đăng nhập
          </Title>

          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập email của bạn"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Link href="/forgot-password">Quên mật khẩu?</Link>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ fontWeight: 'bold' }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Divider />

            <Form.Item style={{ textAlign: 'center' }}>
              <Text>
                Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
              </Text>
            </Form.Item>

            {/* Nút đăng nhập nhanh */}
            <Form.Item>
              <Button
                icon={<GoogleOutlined />}
                size="large"
                className="btn-google"
                block
                onClick={() => alert('Đăng nhập Google')}
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
