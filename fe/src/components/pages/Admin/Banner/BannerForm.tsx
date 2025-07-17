import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Switch,
  Upload,
  message,
  Card,
  Row,
  Col,
  Typography,
  Space,
  UploadFile,
  Image,
  Divider,
  Alert
} from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { createBanner, updateBanner } from "../../../provider/duProvider";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Dragger } = Upload;

export default function BannerForm({
  initialValues,
}: {
  initialValues?: any;
}) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        range: [
          dayjs(initialValues.start_date),
          dayjs(initialValues.end_date),
        ],
      });
      
      if (initialValues.image_url) {
        setFileList([{
          uid: '-1',
          name: 'banner.jpg',
          status: 'done',
          url: `http://localhost:8000/storage/${initialValues.image_url}`,
        }]);
        setPreviewImage(`http://localhost:8000/storage/${initialValues.image_url}`);
      }
    }
  }, [initialValues]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("link_url", values.link_url || "");
    formData.append("start_date", values.range[0].format("YYYY-MM-DD"));
    formData.append("end_date", values.range[1].format("YYYY-MM-DD"));
    formData.append("is_active", values.is_active ? "1" : "0");

    if (values.image_url?.file) {
      formData.append("image", values.image_url.file);
    } else if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      if (initialValues) {
        await updateBanner(initialValues.id, formData);
        message.success("Cập nhật banner thành công!");
      } else {
        await createBanner(formData);
        message.success("Thêm banner thành công!");
      }
      
      // Chuyển hướng về trang danh sách sau khi thành công
      navigate("/admin/banner");
      
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi gửi dữ liệu banner!");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false;
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setPreviewImage(undefined);
    }
  };

  return (
    <Card 
      title={
        <Text strong style={{ fontSize: 18 }}>
          {initialValues ? "CẬP NHẬT BANNER" : "THÊM BANNER MỚI"}
        </Text>
      }
      bordered={false}
      style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
      headStyle={{ borderBottom: 'none', padding: '24px 24px 0' }}
      bodyStyle={{ padding: '16px 24px 24px' }}
      extra={
        <Button onClick={() => navigate("/admin/banner")}>
          Quay lại danh sách
        </Button>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{ is_active: true }}
      >
        <Row gutter={24}>
          <Col span={24} lg={14}>
            <Form.Item
              name="title"
              label={<Text strong>Tiêu đề banner</Text>}
              rules={[
                { required: true, message: 'Vui lòng nhập tiêu đề banner' },
                { max: 100, message: 'Tiêu đề không quá 100 ký tự' }
              ]}
            >
              <Input 
                size="large" 
                placeholder="Nhập tiêu đề banner" 
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="link_url"
              label={<Text strong>Đường dẫn liên kết</Text>}
              rules={[
                { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
              ]}
            >
              <Input 
                size="large" 
                placeholder="https://example.com" 
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="range"
              label={<Text strong>Thời gian hiển thị</Text>}
              rules={[{ required: true, message: 'Vui lòng chọn thời gian hiển thị' }]}
            >
              <RangePicker 
                size="large" 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  return current && current < dayjs().startOf('day');
                }}
              />
            </Form.Item>

            <Form.Item
              name="is_active"
              label={<Text strong>Trạng thái</Text>}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Hiển thị" 
                unCheckedChildren="Ẩn" 
              />
            </Form.Item>
          </Col>

          <Col span={24} lg={10}>
            <Form.Item
              label={<Text strong>Ảnh banner</Text>}
              required
              rules={[{ required: true, message: 'Vui lòng tải lên ảnh banner' }]}
            >
              <Dragger
                name="image_url"
                multiple={false}
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                showUploadList={false}
                accept="image/*"
                style={{ 
                  padding: 16,
                  background: '#fafafa',
                  border: '1px dashed #d9d9d9',
                  borderRadius: 8
                }}
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Banner preview"
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      marginBottom: 16
                    }}
                    preview={false}
                  />
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">Nhấn hoặc kéo thả ảnh vào đây</p>
                    <p className="ant-upload-hint">
                      Hỗ trợ file JPG, PNG với kích thước nhỏ hơn 5MB
                    </p>
                  </>
                )}
                <Button 
                  icon={<UploadOutlined />} 
                  type="primary" 
                  ghost
                >
                  Chọn ảnh
                </Button>
              </Dragger>
              
              {fileList.length > 0 && (
                <Alert
                  message={`Đã chọn: ${fileList[0].name}`}
                  type="info"
                  showIcon
                  closable
                  onClose={() => {
                    setFileList([]);
                    setPreviewImage(undefined);
                  }}
                  style={{ marginTop: 16 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={loading}
              style={{ minWidth: 120 }}
            >
              {initialValues ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button 
              size="large"
              onClick={() => navigate("/admin/banner")}
            >
              Huỷ bỏ
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}