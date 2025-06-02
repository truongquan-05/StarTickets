import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  message,
  Space,
  Button,
  Popconfirm,
  Image,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  useCreateMovies,
  useDeleteMovies,
  useListMovies,
  useUpdateMovies,
} from "../../hook/hungHook";
import { getGenreList } from "../../provider/hungProvider";
import { IMovies, MoviesForm } from "../interface/movies";
import { Link } from "react-router-dom";

const List = () => {
  const [form] = Form.useForm();
  const { data, isLoading } = useListMovies({ resource: "phim" });
  const { mutate: deleteMutate } = useDeleteMovies({ resource: "phim" });
  const { mutate: createMutate } = useCreateMovies({ resource: "phim" });
  const { mutate: updateMutate } = useUpdateMovies({ resource: "phim" });

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMovies | undefined>(
    undefined
  );
  const [genre, setGenre] = useState<{ id: number; name: string }[]>([]);

  const { Option } = Select;

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

  useEffect(() => {
    if (isModalOpen && editingItem) {
      form.setFieldsValue({
        ...editingItem,
        the_loai_id: editingItem.the_loai_id,
      });
    }
  }, [isModalOpen, editingItem]);

  const createOrUpdateOpenModal = (record: IMovies | undefined) => {
    setModalOpen(true);
    setEditingItem(record);
  };

  const onCreateOrUpdate = (values: MoviesForm) => {
    if (editingItem === undefined) {
      createMutate(values);
    } else {
      updateMutate({ id: editingItem.id, values });
    }
    setModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="page-body">
      <div className="container-fluid">
        <h2>Danh sách phim</h2>

        {/* Header filter */}
        <div className="movie-header">
          <Space>
            <Input.Search  placeholder="Tìm kiếm..." allowClear></Input.Search>
          </Space>
          <Space>
          <Button className="btn-export" icon={<ExportOutlined/>}></Button>
          <Button
            type="primary"
          >
            <Link to={"/admin/movies/add"}>+ Tạo phim</Link>
          </Button>
          </Space>
        </div>

        {/* Danh sách phim */}
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
              {data?.map((movie: IMovies) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    <Image
                      src={movie.anh_poster}
                      width={230}
                      style={{
                        height: "300px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </td>
                  <td>
                    <h3>{movie.ten_phim}</h3>
                    <p>
                      <strong>Quốc gia:</strong> {movie.quoc_gia}
                    </p>
                    <p>
                      <strong>Ngôn ngữ:</strong> {movie.ngon_ngu}
                    </p>
                    <p>
                      <strong>Thể loại:</strong> {movie.the_loai_id}
                    </p>
                    <p>
                      <strong>Thời lượng:</strong> {movie.thoi_luong} phút
                    </p>
                    <p>
                      <strong>Ngày chiếu:</strong> {movie.ngay_cong_chieu}
                    </p>
                    <p>
                      <strong>Trailer link:</strong> {movie.trailer}
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

      {/* Modal thêm/sửa */}
      <Modal
        title={editingItem ? "Cập nhật phim" : "Thêm phim mới"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={onCreateOrUpdate} layout="vertical">
          <Form.Item
            label="Tên phim"
            name="ten_phim"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="mo_ta" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Thời lượng"
            name="thoi_luong"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Trailer"
            name="trailer"
            rules={[{ required: true, type: "url" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngôn ngữ"
            name="ngon_ngu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quốc gia"
            name="quoc_gia"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Poster URL"
            name="anh_poster"
            rules={[{ required: true, type: "url" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tình trạng"
            name="ngay_cong_chieu"
            rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="trang_thai"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={true}>Hiển thị</Option>
              <Option value={false}>Ẩn</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Thể loại"
            name="the_loai_id"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn thể loại">
              {genre.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default List;
