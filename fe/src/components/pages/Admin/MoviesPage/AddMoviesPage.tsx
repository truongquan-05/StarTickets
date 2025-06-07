import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { getGenreList } from "../../../provider/hungProvider";
import { useCreateMovies } from "../../../hook/hungHook";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;
const AddMoviesPage = () => {
  const [form] = Form.useForm();
  const { mutate: createMutate } = useCreateMovies({ resource: "phim" });
  const [genre, setGenre] = useState<{ id: number; ten_the_loai: string }[]>([]);
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
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const onCreateOrUpdate = (values: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (key === "anh_poster") {
      if (Array.isArray(value) && value.length > 0) {
        formData.append(key, value[0].originFileObj);
      }
    } else if (key === "ngay_cong_chieu") {
      formData.append(key, (value as any).format("YYYY-MM-DD"));
    } else {
      formData.append(key, String(value));
    }
  });
  createMutate(formData);
  console.log(formData);
  form.resetFields();
};
  return (
    <div className="container">
      <h2 className="title-page">Thêm mới</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreateOrUpdate}
      >
        <div className="form-row">
          {/* Cột trái */}
          <div className="form-col">
            <Form.Item
              label="Name"
              name="ten_phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="mo_ta"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Time"
              name="thoi_luong"
              rules={[
                { required: true, message: "Vui lòng nhập thời lượng" },
                { type: "number", min: 1, message: "Thời lượng phải lớn hơn 0" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Trailer"
              name="trailer"
              rules={[
                { required: true, message: "Vui lòng nhập link trailer" },
                { type: "url", message: "Phải là đường link hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Language"
              name="ngon_ngu"
              rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Category"
              name="the_loai_id"
              rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            >
              <Select placeholder="Chọn thể loại">
                {genre.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.ten_the_loai}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          {/* Cột phải */}
          <div className="form-col">
            <Form.Item
              label="Country"
              name="quoc_gia"
              rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Poster"
              name="anh_poster"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              // rules={[{ required: true, message: "Vui lòng chọn ảnh poster" }]}
            >
              <Upload
                name="anh_poster"
                listType="picture"
                beforeUpload={(file) => {
                  const isValidType =
                    file.type === "image/jpeg" ||
                    file.type === "image/png" ||
                    file.type === "image/gif";
                  if (!isValidType) {
                    message.error("Chỉ hỗ trợ file JPG/PNG/GIF!");
                  }
                  return isValidType || Upload.LIST_IGNORE; // chặn upload nếu sai định dạng
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>
                  Click để tải ảnh poster
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Ngày công chiếu"
              name="ngay_cong_chieu"
              rules={[{ required: true, message: "Vui lòng chọn ngày công chiếu" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="Age limit"
              name="do_tuoi_gioi_han"
              rules={[{ required: true, message: "Vui lòng nhập độ tuổi giới hạn" }]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Tình Trạng"
              name="tinh_trang"
              rules={[{ required: true, message: "Vui lòng chọn tình trạng phim" }]}
            >
              <Select placeholder="Select status">
                <Option value={"Sắp Chiếu"}>Sắp Chiếu</Option>
                <Option value={"Đang Chiếu"}>Đang Chiếu</Option>
                <Option value={"Đã Chiếu"}>Đã Chiếu</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="trang_thai"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Select status">
                <Option value={1}>Available</Option>
                <Option value={0}>Unavailable</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-add">
                Thêm mới
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddMoviesPage;
