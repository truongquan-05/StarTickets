// pages/Admin/Banner/BannerForm.tsx
import {
  Form,
  Input,
  Button,
  Switch,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getCreateBanner } from "../../../provider/duProvider";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";

export default function BannerForm() {
  const navigate = useNavigate();
  const [fileLists, setFileLists] = useState<UploadFile[][]>([[]]); // mảng các dòng ảnh

  const handleAddUpload = () => {
    setFileLists((prev) => [...prev, []]);
  };

  const handleUploadChange = (index: number, newFileList: UploadFile[]) => {
    const updated = [...fileLists];
    updated[index] = newFileList;
    setFileLists(updated);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("mo_ta", values.mo_ta);
    formData.append("is_active", values.is_active ? "1" : "0");

    fileLists.forEach((list) => {
      if (list.length > 0) {
        list.forEach((file) => {
          formData.append("images[]", file.originFileObj as File);
        });
      }
    });

    try {
      await getCreateBanner({ values: formData });
      message.success("Thêm banner thành công");
      navigate("/admin/banner");
    } catch (err) {
      message.error("Thêm thất bại");
      console.log(err);
      
    }
  };

  return (
    <div>
      <h2>THÊM SLIDE SHOW</h2>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ is_active: true }}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="Tiêu đề" name="tieu_de">
              <Input placeholder="Nhập tên chi nhánh" />
            </Form.Item>

            <div style={{ marginBottom: 8 }}>
              <b>Chọn ảnh</b>{" "}
              <Button onClick={handleAddUpload} type="primary" size="small" style={{ marginLeft: 8 }}>
                Thêm ảnh
              </Button>
            </div>

            {fileLists.map((fileList, index) => (
              <Form.Item key={index}>
                <Upload
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => handleUploadChange(index, fileList)}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                </Upload>
              </Form.Item>
            ))}
          </Col>

          <Col span={8}>
            <Form.Item label="Hoạt động" name="is_active" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Mô tả" name="mo_ta">
              <Input.TextArea rows={6} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
