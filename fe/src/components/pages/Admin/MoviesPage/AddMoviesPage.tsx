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
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className="container my-4" >
      <h2 className="mb-4 text-center">Thêm mới</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreateOrUpdate}
        className="row g-3"
      >
        {/* Cột trái */}
        <div className="col-md-6">
          <Form.Item
            label="Name"
            name="ten_phim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            className="mb-3"
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="mo_ta"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            className="mb-3"
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            label="Time"
            name="thoi_luong"
            rules={[
              { required: true, message: "Vui lòng nhập thời lượng" },
              { type: "number", min: 1, message: "Thời lượng phải lớn hơn 0" },
            ]}
            className="mb-3"
          >
            <InputNumber className="form-control" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Trailer"
            name="trailer"
            rules={[
              { required: true, message: "Vui lòng nhập link trailer" },
              { type: "url", message: "Phải là đường link hợp lệ" },
            ]}
            className="mb-3"
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            label="Language"
            name="ngon_ngu"
            rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ" }]}
            className="mb-3"
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="the_loai_id"
            rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            className="mb-3"
          >
            <Select placeholder="Chọn thể loại" className="form-select">
              {genre.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.ten_the_loai}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        {/* Cột phải */}
        <div className="col-md-6">
          <Form.Item
            label="Country"
            name="quoc_gia"
            rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
            className="mb-3"
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            label="Poster"
            name="anh_poster"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mb-3"
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
                return isValidType || Upload.LIST_IGNORE;
              }}
              maxCount={1}
            >
              <Button
                icon={<UploadOutlined />}
                className="btn btn-outline-secondary"
              >
                Click để tải ảnh poster
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Ngày công chiếu"
            name="ngay_cong_chieu"
            rules={[{ required: true, message: "Vui lòng chọn ngày công chiếu" }]}
            className="mb-3"
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              className="form-control"
            />
          </Form.Item>
          <Form.Item
            label="Age limit"
            name="do_tuoi_gioi_han"
            rules={[{ required: true, message: "Vui lòng nhập độ tuổi giới hạn" }]}
            className="mb-3"
          >
            <Input className="form-control" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Tình Trạng"
            name="tinh_trang"
            rules={[{ required: true, message: "Vui lòng chọn tình trạng phim" }]}
            className="mb-3"
          >
            <Select placeholder="Select status" className="form-select">
              <Option value="Sắp Chiếu">Sắp Chiếu</Option>
              <Option value="Đang Chiếu">Đang Chiếu</Option>
              <Option value="Đã Chiếu">Đã Chiếu</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="trang_thai"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            className="mb-3"
          >
            <Select placeholder="Select status" className="form-select">
              <Option value={1}>Available</Option>
              <Option value={0}>Unavailable</Option>
            </Select>
          </Form.Item>
          <Form.Item className="mb-3">
            <Button
              type="primary"
              htmlType="submit"
              className="btn btn-primary w-100"
            >
              Thêm mới
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddMoviesPage;