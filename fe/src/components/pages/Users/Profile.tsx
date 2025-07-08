import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import "./Profile.css";
import axios from "axios";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
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

  if (!user) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <div className="profile-container">
      <h2 className="title">👤 THÔNG TIN KHÁCH HÀNG</h2>

      <Card className="profile-card" bodyStyle={{ padding: 24 }}>
        <h3 className="section-title">Thông tin cá nhân</h3>
        <Form layout="vertical" form={form} onFinish={handleUpdateInfo}>
          <div className="form-row">
            <Form.Item label="Họ và tên" name="ten" className="form-item">
              <Input />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              label="Số điện thoại"
              name="so_dien_thoai"
              className="form-item"
            >
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" className="form-item">
              <Input />
            </Form.Item>
          </div>

          <Form.Item label="Mã xác nhận" required>
            <Input.Group compact>
              <Form.Item
                name="ma_xac_nhan"
                noStyle
                rules={[
                  { required: true, message: "Vui lòng nhập mã xác nhận!" },
                ]}
              >
                <Input style={{ width: "70%" }} />
              </Form.Item>
              <Button
                style={{ width: "30%" }}
                onClick={handleSendCode}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi mã"}
              </Button>
            </Input.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="save-btn">
            LƯU THÔNG TIN
          </Button>
        </Form>
      </Card>

      <Card className="profile-card" bodyStyle={{ padding: 24 }}>
        <h3 className="section-title">Đổi mật khẩu</h3>
        <Form
          layout="vertical"
          form={passwordForm}
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="mat_khau_cu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="mat_khau_moi"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("mat_khau_cu") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu mới không được trùng mật khẩu cũ!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác thực mật khẩu"
            name="xac_thuc_mat_khau"
            dependencies={["mat_khau_moi"]}
            rules={[
              { required: true, message: "Vui lòng xác thực lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("mat_khau_moi") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Xác thực mật khẩu không khớp!")
                  );
                },
              }),
            ]}
          >
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
