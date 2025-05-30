import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  message,
  Typography,
  Space,
  Button,
  Popconfirm,
  Table,
  Image,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useCreateMovies,
  useDeleteMovies,
  useListMovies,
  useUpdateMovies,
} from "../../hook/hungHook";
import axios from "axios";
import { getGenreList } from "../../provider/hungProvider";
import { IMovies, MoviesForm } from "../interface/movies";

const List = () => {
  const [form] = Form.useForm();
  const { data, isLoading } = useListMovies({ resource: "phim" });
  const { mutate: deleteMutate } = useDeleteMovies({
    resource: "phim",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMovies | undefined>(
    undefined
  );
  const createOrUpdateOpenModal = (record: IMovies | undefined) => {
    setModalOpen(true);
    setEditingItem(record);
  };
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
        the_loai: editingItem.the_loai_id,
      });
    }
  }, [isModalOpen, editingItem]);
  const { mutate: createMutate } = useCreateMovies({ resource: "phim" });
  const { mutate: updateMutate } = useUpdateMovies({ resource: "phim" });
  const onCreateOrUpdate = (values: MoviesForm) => {
    if (editingItem === undefined) {
      createMutate(values);
    } else {
      updateMutate({ id: editingItem.id, values });
    }
    setModalOpen(false);
    form.resetFields();
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "ten_phim",
      key: "ten_phim",
      sorter: (a: IMovies, b: IMovies) => a.ten_phim.localeCompare(b.ten_phim),
    },
    {
      title: "Description",
      dataIndex: "mo_ta",
      key: "mo_ta",
    },
    {
      title: "Poster",
      dataIndex: "anh_poster",
      key: "anh_poster",
      render: (src: any) => <Image src={src} width={110} height={110} />,
    },
    {
      title: "Trailer",
      dataIndex: "trailer",
      key: "trailer",
      render: (url: string) => {
        const videoId = url.split("v=")[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            width="210"
            height="110"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              title="Sửa"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => createOrUpdateOpenModal(record)}
            />
            <Popconfirm
              title="Are you sure to delete this movie?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteMutate(record.id);
                message.success("Deleted movie : " + record.title);
              }}
            >
              <Button title="Xóa" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <div className="container">
      <h2 className="title-page">Danh sách</h2>
      <div className="action-movie">
        <Button className="export-file" icon={<ExportOutlined />}></Button>
        <Button className="add-movies">
          <Link to={"/movies/add"}>Thêm mới</Link>
        </Button>
      </div>
      <div className="table">
        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          loading={isLoading}
          bordered
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No products found." }}
        />
      </div>
      <Modal
        title={"Movies Detail"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) => {
            onCreateOrUpdate(values);
          }}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="ten_phim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="mo_ta"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Time"
            name="thoi_luong"
            rules={[
              { required: true, message: "Vui lòng nhập thời lượng!" },
              { type: "number", min: 1, message: "Thời lượng phải lớn hơn 0!" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Trailer"
            name="trailer"
            rules={[
              { required: true, message: "Vui lòng nhập trailer!" },
              { type: "url", message: "Đường dẫn trailer không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Language"
            name="ngon_ngu"
            rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="quoc_gia"
            rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Poster"
            name="anh_poster"
            rules={[
              { required: true, message: "Vui lòng nhập đường dẫn poster!" },
              { type: "url", message: "Đường dẫn poster không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="ngay_cong_chieu"
            rules={[
              { required: true, message: "Vui lòng chọn ngày công chiếu!" },
            ]}
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
              { required: true, message: "Vui lòng nhập độ tuổi giới hạn!" },
              { type: "number", min: 0, message: "Độ tuổi phải >= 0!" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Status"
            name="trang_thai"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Select status">
              <Option value={true}>Available</Option>
              <Option value={false}>Unavailable</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="the_loai_id"
            rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
          >
            <Select placeholder="Chọn thể loại" style={{ width: 200 }}>
              {genre.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editingItem == undefined ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default List;
