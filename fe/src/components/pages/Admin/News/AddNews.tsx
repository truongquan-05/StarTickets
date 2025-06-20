import React from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Space,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useCreateNews } from "../../../hook/hungHook";

const BASE_URL = "http://127.0.0.1:8000";

const AddNews = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: createMutate,  } = useCreateNews({ resource: "tin_tuc" });

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append("tieu_de", values.tieu_de);
    formData.append("noi_dung", values.noi_dung);

    if (values.hinh_anh && values.hinh_anh.length > 0 && values.hinh_anh[0].originFileObj) {
      formData.append("hinh_anh", values.hinh_anh[0].originFileObj);
    }

    createMutate(formData, {
      onSuccess: () => {
        navigate("/admin/news"); // Chuyển về trang danh sách
      },
      onError: () => {
        message.error("Thêm tin tức thất bại");
      },
    });
  };

  return (
    <Card title="Thêm mới tin tức" style={{ maxWidth: 700, margin: "20px auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ tieu_de: "", noi_dung: "" }}
      >
        <Form.Item
          label="Tiêu đề"
          name="tieu_de"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="hinh_anh"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <Button>Chọn ảnh</Button>
          </Upload>
        </Form.Item>


        <Form.Item
          label="Nội dung"
          name="noi_dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          valuePropName="value"
          trigger="onChange"
        >
          <ReactQuill
            theme="snow"
            style={{ height: 300, marginBottom: 50 }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            }}
          />
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

export default AddNews;
