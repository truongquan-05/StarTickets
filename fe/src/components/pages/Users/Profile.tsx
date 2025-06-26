// pages/User/Profile.tsx
import { Card, Form, Input, Button, DatePicker, message } from "antd";
import dayjs from "dayjs";
import "./Profile.css"; // 👉 import CSS tùy chỉnh

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const user = {
    ho_va_ten: "Nguyễn Hoàng Du",
    email: "hoangdu1109k5@gmail.com",
    so_dien_thoai: "0988616635",
    ngay_sinh: "2005-11-09",
  };

  const handleUpdateInfo = (values: any) => {
    message.success("Cập nhật thành công!");
  };

  const handleChangePassword = (values: any) => {
    if (values.mat_khau_moi !== values.xac_thuc_mat_khau) {
      message.error("Mật khẩu xác thực không khớp!");
      return;
    }
    message.success("Đổi mật khẩu thành công!");
  };

  return (
    <div className="profile-container">
      <h2 className="title">THÔNG TIN KHÁCH HÀNG</h2>

      <Card className="profile-card" bodyStyle={{ padding: 24 }}>
        <h3 className="section-title">Thông tin cá nhân</h3>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpdateInfo}
          initialValues={{
            ...user,
            ngay_sinh: dayjs(user.ngay_sinh),
          }}
        >
          <div className="form-row">
            <Form.Item label="Họ và tên" name="ho_va_ten" className="form-item">
              <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="ngay_sinh" className="form-item">
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item label="Số điện thoại" name="so_dien_thoai" className="form-item">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" className="form-item">
              <Input disabled />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" className="save-btn">
            LƯU THÔNG TIN
          </Button>
        </Form>
      </Card>

      <Card className="profile-card" bodyStyle={{ padding: 24 }}>
        <h3 className="section-title">Đổi mật khẩu</h3>
        <Form layout="vertical" form={passwordForm} onFinish={handleChangePassword}>
          <Form.Item label="Mật khẩu cũ" name="mat_khau_cu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="mat_khau_moi" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Xác thực mật khẩu" name="xac_thuc_mat_khau" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="save-btn">
            ĐỔI MẬT KHẨU
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
