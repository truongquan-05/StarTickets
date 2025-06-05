import { Form, Input, InputNumber, Switch, Upload, Select, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Food } from '../types/Uses';
import React from 'react';

interface Props {
  initialValues?: Partial<Food>;
  onFinish: (values: any) => void;
  isEdit?: boolean;
}

const { TextArea } = Input;

const FoodForm: React.FC<Props> = ({ initialValues, onFinish, isEdit }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Tên đồ ăn"
        rules={[{ required: true, message: 'Vui lòng nhập tên đồ ăn!' }]}
      >
        <Input placeholder="Nhập tên đồ ăn" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Loại đồ ăn"
        rules={[{ required: true, message: 'Vui lòng chọn loại đồ ăn!' }]}
      >
        <Select placeholder="--- Chọn loại đồ ăn ---">
          <Select.Option value="Luộc">Luộc</Select.Option>
          <Select.Option value="Nướng">Nướng</Select.Option>
          <Select.Option value="Nước">Nước</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
      >
        <InputNumber min={1000} style={{ width: '100%' }} placeholder="Nhập giá" />
      </Form.Item>

      <Form.Item name="image" label="Hình ảnh">
        <Upload maxCount={1} beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Chọn tệp</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="status" label="Trạng thái" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <TextArea placeholder="Nhập mô tả" rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Cập nhật' : 'Thêm'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FoodForm;