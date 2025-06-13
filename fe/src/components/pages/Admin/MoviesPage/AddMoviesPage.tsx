import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { getGenreList } from "../../../provider/hungProvider";
import { useCreateMovies } from "../../../hook/hungHook";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const AddMoviesPage = () => {
  const [form] = Form.useForm();
  const { mutate: createMutate } = useCreateMovies({ resource: "phim" });
  const [genre, setGenre] = useState<{ id: number; ten_the_loai: string }[]>(
    []
  );

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenreList({ resource: "the_loai" });
        setGenre(data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    };
    fetchGenres();
  }, []);

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onCreateOrUpdate = (values: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "anh_poster" && Array.isArray(value) && value.length > 0) {
        formData.append(key, value[0].originFileObj);
      } else if (key === "ngay_cong_chieu") {
        formData.append(key, (value as any).format("YYYY-MM-DD"));
      } else if (key === "ngay_ket_thuc") {
        formData.append(key, (value as any).format("YYYY-MM-DD"));
      } else {
        formData.append(key, String(value));
      }
    });
    createMutate(formData);

    form.resetFields();
  };

  return (
    <div className="container my-4">
      <Card title="Thêm mới phim" bordered={true} style={{ margin: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onCreateOrUpdate}
          className="row g-3"
        >
          {/* Cột trái */}
          <div className="col-md-6">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Tên phim"
                  name="ten_phim"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên phim" },
                  ]}
                >
                  <Input placeholder="Nhập tên phim" />
                </Form.Item>

                <Form.Item
                  label="Thời lượng (phút)"
                  name="thoi_luong"
                  rules={[
                    { required: true, message: "Vui lòng nhập thời lượng" },
                    { type: "number", min: 1, message: "Thời lượng phải > 0" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="VD: 120"
                  />
                </Form.Item>

                <Form.Item
                  label="Trailer (URL)"
                  name="trailer"
                  rules={[
                    { required: true, message: "Vui lòng nhập link trailer" },
                    { type: "url", message: "Phải là URL hợp lệ" },
                  ]}
                >
                  <Input placeholder="https://youtube.com/..." />
                </Form.Item>

                <Form.Item
                  label="Ngôn ngữ"
                  name="ngon_ngu"
                  rules={[
                    { required: true, message: "Vui lòng nhập ngôn ngữ" },
                  ]}
                >
                  <Input placeholder="VD: Tiếng Việt, English..." />
                </Form.Item>

                <Form.Item
                  label="Thể loại"
                  name="the_loai_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn thể loại" },
                  ]}
                >
                  <Select placeholder="Chọn thể loại">
                    {genre.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.ten_the_loai}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  name="mo_ta"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                  <Input.TextArea rows={5} placeholder="Nhập mô tả phim" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Quốc gia"
                  name="quoc_gia"
                  rules={[
                    { required: true, message: "Vui lòng nhập quốc gia" },
                  ]}
                >
                  <Input placeholder="VD: Việt Nam, Mỹ..." />
                </Form.Item>

                <Form.Item
                  label="Ảnh poster"
                  name="anh_poster"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    name="anh_poster"
                    listType="picture"
                    beforeUpload={(file) => {
                      const isValid = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                      ].includes(file.type);
                      if (!isValid) message.error("Chỉ hỗ trợ JPG/PNG/GIF");
                      return isValid || Upload.LIST_IGNORE;
                    }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  label="Ngày công chiếu"
                  name="ngay_cong_chieu"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày công chiếu",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name="ngay_ket_thuc"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày kết thúc" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                  label="Độ tuổi giới hạn"
                  name="do_tuoi_gioi_han"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập độ tuổi giới hạn",
                    },
                  ]}
                >
                  <Input placeholder="VD: 13+, 18+" />
                </Form.Item>

                <Form.Item
                  label="Tình trạng phim"
                  name="trang_thai_phim"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tình trạng phim",
                    },
                  ]}
                >
                  <Select placeholder="Chọn tình trạng">
                    <Option value="Nháp">Nháp</Option>
                    <Option value="Xuất bản">Xuất bản</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Thêm mới phim
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddMoviesPage;
