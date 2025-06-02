import { Button, Form, Input, InputNumber, Select } from "antd";
import  { useEffect, useState } from "react";


import {  MoviesForm } from "../interface/movies";
import { getGenreList } from "../../../provider/hungProvider";
import { useCreateMovies } from "../../../hook/hungHook";

const { Option } = Select;

const AddMoviesPage = () => {
  const [form] = Form.useForm();
  const { mutate: createMutate } = useCreateMovies({ resource: "phim" });
  const [genre, setGenre] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenreList({ resource: "the_loai" });
        setGenre(data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    };
    fetchGenres();
  }, []);

  const onCreateOrUpdate = (values: MoviesForm) => {
    createMutate(values);
    form.resetFields();

  };
  return (
    <div className="container">
      <h2 className='title-page'>Thêm mới</h2>
    <Form
  form={form}
  layout="vertical"
  onFinish={(values) => {
    onCreateOrUpdate(values);
  }}
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
        name="the_loai"
        rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
      >
        <Select placeholder="Chọn thể loại">
          {genre.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
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
        rules={[{ required: true, message: "Vui lòng nhập link ảnh poster" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date"
        name="ngay_cong_chieu"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái ngày" }]}
      >
        <Select placeholder="Select state">
          <Option value="Sắp chiếu">Coming Soon</Option>
          <Option value="Đang chiếu">Now Showing</Option>
          <Option value="Đã chiếu">Finished Showing</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Age limit"
        name="do_tuoi_gioi_han"
        rules={[
          { required: true, message: "Vui lòng nhập độ tuổi giới hạn" },
          { type: "number", min: 0, message: "Phải là số >= 0" },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Status"
        name="trang_thai"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select placeholder="Select status">
          <Option value={true}>Available</Option>
          <Option value={false}>Unavailable</Option>
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
