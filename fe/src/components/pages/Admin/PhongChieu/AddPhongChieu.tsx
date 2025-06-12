import { Card, Form, Select, Typography, InputNumber, Input, Button, message } from 'antd';
import React from 'react';
import { useCreatePhongChieu, useListCinemas } from '../../../hook/hungHook';

const { Option } = Select;
const { Title } = Typography;

const AddPhongChieu = () => {
  const [form] = Form.useForm();
  const { mutate: createMutate } = useCreatePhongChieu({ resource: 'phong_chieu' });
  const { data: raps = [], isLoading } = useListCinemas({ resource: 'rap' });

  // Validator chỉ cho loai_so_do
  const validateTotalSeats = (_: any, value: number) => {
    const hangThuong = form.getFieldValue('hang_thuong') || 0;
    const hangVip = form.getFieldValue('hang_vip') || 0;
    const hangDoi = form.getFieldValue('hang_doi') || 0;

    if (value >= 1 && value === hangThuong + hangVip + hangDoi) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Loại sơ đồ phải bằng tổng hàng thường, hàng VIP và hàng đôi.'));
  };

  // Khi các trường hàng thay đổi, validate lại loai_so_do để hiện lỗi (nếu có)
  const onSeatsChange = () => {
    form.validateFields(['loai_so_do']);
  };

  const onCreate = (values: Record<string, any>) => {
    const { loai_so_do, hang_thuong, hang_vip, hang_doi } = values;

    if (loai_so_do !== hang_thuong + hang_vip + hang_doi) {
      message.error('Loại sơ đồ phải bằng tổng hàng thường, hàng VIP và hàng đôi.');
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    createMutate(formData);
    form.resetFields();
  };

  return (
    <div>
      <Card>
        <Title level={3}>Thêm mới phòng chiếu</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onCreate}
          initialValues={{
            trang_thai: 'nhap',
            loai_so_do: 1,
            hang_thuong: 0,
            hang_vip: 0,
            hang_doi: 0,
          }}
        >
          <Form.Item
            label="Tên phòng"
            name="ten_phong"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            label="Rạp"
            name="rap_id"
            rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
          >
            <Select placeholder="Chọn rạp" loading={isLoading}>
              {raps.map((rap: any) => (
                <Option key={rap.id} value={rap.id}>
                  {rap.ten_rap}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Loại sơ đồ"
            name="loai_so_do"
            rules={[
              { required: true, message: 'Vui lòng nhập loại sơ đồ' },
              { type: 'number', min: 1, message: 'Loại sơ đồ phải lớn hơn hoặc bằng 1' },
              { validator: validateTotalSeats },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập loại sơ đồ" />
          </Form.Item>

          <Form.Item
            label="Hàng thường"
            name="hang_thuong"
            rules={[
              { required: true, message: 'Vui lòng nhập hàng thường' },
              { type: 'number', min: 0, message: 'Phải là số không âm' },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={onSeatsChange}
            />
          </Form.Item>

          <Form.Item
            label="Hàng VIP"
            name="hang_vip"
            rules={[
              { required: true, message: 'Vui lòng nhập hàng VIP' },
              { type: 'number', min: 0, message: 'Phải là số không âm' },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={onSeatsChange}
            />
          </Form.Item>

          <Form.Item
            label="Hàng đôi"
            name="hang_doi"
            rules={[
              { required: true, message: 'Vui lòng nhập hàng đôi' },
              { type: 'number', min: 0, message: 'Phải là số không âm' },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={onSeatsChange}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="trang_thai"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select defaultValue="nhap">
              <Option value="nhap">Nháp</Option>
              <Option value="xuat_ban">Xuất bản</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Thêm phòng chiếu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddPhongChieu;
