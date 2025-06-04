import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  Space,
  Button,
  Popconfirm,
  Image,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { IMovies, MoviesForm } from "../interface/movies";
import { Link } from "react-router-dom";
import {
  useListMovies,
  useDeleteMovies,
  useUpdateMovies,
} from "../../../hook/hungHook";
import { getGenreList } from "../../../provider/hungProvider";
import moment from "moment";
const List = () => {
  const [form] = Form.useForm();
  const { data } = useListMovies({ resource: "phim" });
  const dataSource = data?.data || [];
  const { mutate: deleteMutate } = useDeleteMovies({ resource: "phim" });
  const { mutate: updateMutate } = useUpdateMovies({ resource: "phim" });
  const BASE_URL = "http://127.0.0.1:8000";
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMovies | undefined>(
    undefined
  );
  const [genre, setGenre] = useState<{ id: number; ten_the_loai: string }[]>(
    []
  );
  const [filePoster, setFilePoster] = useState<File | null>(null);
  const [anhPosterPreview, setAnhPosterPreview] = useState<
    string | undefined
  >();
  const { Option } = Select;
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
  useEffect(() => {
    if (isModalOpen && editingItem) {
      form.setFieldsValue({
        ...editingItem,
        the_loai_id: Number(editingItem.the_loai_id), 
        ngay_cong_chieu: editingItem.ngay_cong_chieu
          ? moment(editingItem.ngay_cong_chieu)
          : undefined,
      });
      setAnhPosterPreview(`${BASE_URL}/storage/${editingItem.anh_poster}`);
    } else {
      form.resetFields();
      setAnhPosterPreview(undefined);
      setFilePoster(null);
      setEditingItem(undefined);
    }
  }, [isModalOpen, editingItem, form]);
  const createOrUpdateOpenModal = (record: IMovies | undefined) => {
    setEditingItem(record);
    setModalOpen(true);
  };
  const onAnhPosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilePoster(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setAnhPosterPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const onCreateOrUpdate = async (values: MoviesForm) => {
    if (values.thoi_luong && values.thoi_luong > 500) {
      message.error("Thời lượng không được vượt quá 500 phút");
      console.log(values.the_loai_id);
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === "ngay_cong_chieu") {
          // Chuyển moment object sang chuỗi YYYY-MM-DD
          const dateStr = (val as any).format
            ? (val as any).format("YYYY-MM-DD")
            : val;
          formData.append(key, dateStr);
        } else {
          formData.append(key, String(val));
        }
      }
    });
    if (filePoster) {
      formData.append("anh_poster", filePoster);
    }
    for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
    if (editingItem === undefined) {
    } else {
      updateMutate(
        { id: editingItem.id, values: formData },
        {
          onSuccess: () => {
            setModalOpen(false);
            form.resetFields();
            setAnhPosterPreview(undefined);
            setFilePoster(null);
            setEditingItem(undefined);
          },
        }
      );
    }
  };
  const getGenreName = (id: number) => {
    const item = genre.find((g) => g.id === id);
    return item ? item.ten_the_loai : "Chưa cập nhật";
  };
  return (
    <div className="page-body">
      <div className="container-fluid">
        <h2>Danh sách phim</h2>
        <div className="movie-header">
          <Space>
            <Input.Search placeholder="Tìm kiếm..." allowClear />
          </Space>
          <Space>
            <Button className="btn-export" icon={<ExportOutlined />} />
            <Button type="primary">
              <Link to={"/admin/movies/add"}>+ Tạo phim</Link>
            </Button>
          </Space>
        </div>
        <div className="movie-list">
          <table className="movie-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Thông tin</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataSource?.map((movie: IMovies) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    <Image
                      src={`${BASE_URL}/storage/${movie.anh_poster}`}
                      width={230}
                      style={{
                        height: "300px",
                        objectFit: "cover",
                        display: "block",
                      }}
                      placeholder={
                        <div
                          style={{
                            width: 230,
                            height: 300,
                            backgroundColor: "#f0f0f0",
                          }}
                        />
                      }
                      fallback="https://via.placeholder.com/230x300?text=No+Image"
                    />
                  </td>
                  <td>
                    <h2 className="ten_phim">{movie.ten_phim}</h2>
                    <p>
                      <strong>Quốc gia:</strong> {movie.quoc_gia}
                    </p>
                    <p>
                      <strong>Ngôn ngữ:</strong> {movie.ngon_ngu}
                    </p>
                    <p>
                      <strong>Thể loại:</strong>{" "}
                      {getGenreName(movie.the_loai_id)}
                    </p>
                    <p>
                      <strong>Thời lượng:</strong> {movie.thoi_luong} phút
                    </p>
                    <p>
                      <strong>Ngày chiếu:</strong>{" "}
                      {movie.ngay_cong_chieu
                        ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
                        : "Chưa cập nhật"}
                    </p>
                    <p>
                      <strong>Trailer link:</strong>{" "}
                      <a href={movie.trailer} target="_blank" rel="noreferrer">
                        {movie.trailer}
                      </a>
                    </p>
                  </td>
                  <td>
                    <Space>
                      <Button
                        icon={<EditOutlined />}
                        type="primary"
                        onClick={() => createOrUpdateOpenModal(movie)}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Xác nhận xóa?"
                        onConfirm={() => deleteMutate(movie.id)}
                      >
                        <Button icon={<DeleteOutlined />} danger>
                          Xóa
                        </Button>
                      </Popconfirm>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        title={editingItem ? "Cập nhật phim" : "Thêm phim mới"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onCreateOrUpdate} layout="vertical">
          <Form.Item
            label="Tên phim"
            name="ten_phim"
            rules={[{ required: true, message: "Tên phim là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="mo_ta"
            rules={[{ required: true, message: "Mô tả là bắt buộc" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Thời lượng (phút)"
            name="thoi_luong"
            rules={[
              { required: true, message: "Thời lượng là bắt buộc" },
              {
                type: "number",
                max: 500,
                message: "Thời lượng không được vượt quá 500 phút",
              },
            ]}
          >
            <InputNumber min={1} max={500} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Trailer"
            name="trailer"
            rules={[
              { required: true, message: "Trailer là bắt buộc" },
              { type: "url", message: "Đường dẫn trailer không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngôn ngữ"
            name="ngon_ngu"
            rules={[{ required: true, message: "Ngôn ngữ là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quốc gia"
            name="quoc_gia"
            rules={[{ required: true, message: "Quốc gia là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ảnh Poster" tooltip="Chọn ảnh poster cho phim">
            <input type="file" accept="image/*" onChange={onAnhPosterChange} />
          </Form.Item>
          {anhPosterPreview && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={anhPosterPreview}
                alt="Poster preview"
                style={{
                  width: 230,
                  height: 300,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}
          <Form.Item
            label="Tình trạng"
            name="tinh_trang"
            rules={[{ required: true, message: "Tình trạng là bắt buộc" }]}
          >
            <Select>
              <Option value="Sắp chiếu">Sắp chiếu</Option>
              <Option value="Đang chiếu">Đang chiếu</Option>
              <Option value="Đã chiếu">Đã chiếu</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Giới hạn tuổi"
            name="do_tuoi_gioi_han"
            rules={[{ required: true, message: "Giới hạn tuổi là bắt buộc" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="trang_thai"
            rules={[{ required: true, message: "Trạng thái là bắt buộc" }]}
          >
            <Select>
              <Option value={1}>Hiển thị</Option>
              <Option value={0}>Ẩn</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Thể loại"
            name="the_loai_id"
            rules={[{ required: true, message: "Thể loại là bắt buộc" }]}
          >
            <Select>
              {genre.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.ten_the_loai}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày công chiếu"
            name="ngay_cong_chieu"
            rules={[{ required: true, message: "Ngày công chiếu là bắt buộc" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default List;
