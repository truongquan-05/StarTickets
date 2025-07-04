import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Space,
  InputNumber,
  DatePicker,
  Select,
  Col,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateVoucher } from "../../hook/thinhHook";

const { Option } = Select;

const AddVoucher = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: createMutate } = useCreateVoucher({
    resource: "ma_giam_gia",
  });

  const onFinish = (values: any) => {
    // Chuyển ngày thành chuỗi YYYY-MM-DD
    const payload = {
      ...values,
      ngay_bat_dau: values.ngay_bat_dau?.format("YYYY-MM-DD"),
      ngay_ket_thuc: values.ngay_ket_thuc?.format("YYYY-MM-DD"),
    };

    createMutate(payload, {
      onSuccess: () => {
        navigate("/admin/vouchers/list");
      },
      onError: (error) => {
        console.error("Thêm voucher lỗi:", error);
        message.error("Thêm voucher thất bại");
      },
    });
  };

  return (
    <Card title="Thêm mới Voucher" style={{ margin: "15px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          phan_tram_giam: 0,
          giam_toi_da: 0,
          gia_tri_don_hang_toi_thieu: 0,
          so_lan_su_dung: 1,
          trang_thai: "CHƯA KÍCH HOẠT",
          image: "",
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mã voucher"
              name="ma"
              rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phần trăm giảm (%)"
              name="phan_tram_giam"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm!" },
                { type: "number", min: 0, max: 100, message: "0-100%" },
              ]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Giảm tối đa (VNĐ)"
              name="giam_toi_da"
              rules={[
                { required: true, message: "Vui lòng nhập giảm tối đa!" },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Số lần sử dụng"
              name="so_lan_su_dung"
              rules={[
                { required: true, message: "Vui lòng nhập số lần sử dụng!" },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[
                { required: true, message: "Vui lòng nhập đường dẫn ảnh!" },
              ]}
            >
              <Input placeholder="Nhập URL hoặc chuỗi ảnh base64" />
            </Form.Item>

            <Form.Item
              label="Giá trị đơn hàng tối thiểu (VNĐ)"
              name="gia_tri_don_hang_toi_thieu"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị tối thiểu!" },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Ngày bắt đầu"
              name="ngay_bat_dau"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              label="Ngày kết thúc"
              name="ngay_ket_thuc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Trạng thái"
          name="trang_thai"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value="CHƯA KÍCH HOẠT">Chưa kích hoạt</Option>
            <Option value="KÍCH HOẠT">Kích hoạt</Option>
            <Option value="HẾT HẠN">Hết hạn</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
            <Button onClick={() => navigate(-1)}>Huỷ</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddVoucher;
