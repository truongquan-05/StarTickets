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
  Table,
  Typography,
  Card,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { IMovies, MoviesForm } from "../interface/movies";
// import { Link } from "react-router-dom";
import {
  useListMovies,
  useDeleteMovies,
  useUpdateMovies,
} from "../../../hook/hungHook";
import { getGenreList } from "../../../provider/hungProvider";
import moment from "moment";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;
const { Text, Paragraph } = Typography;

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
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === "ngay_cong_chieu") {
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
    if (editingItem === undefined) {
      // Nếu cần thêm phim mới, thêm code ở đây
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

  // Định nghĩa cột cho Ant Design Table
  const columns = [
    {
      title: "#ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a: IMovies, b: IMovies) => a.id - b.id,
      fixed: "left",
    },
    {
      title: "Poster",
      dataIndex: "anh_poster",
      key: "anh_poster",
      width: 210,
      render: (text: string) => (
        <Image
          src={`${BASE_URL}/storage/${text}`}
          width={220}
          height={280}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://via.placeholder.com/100x140?text=No+Image"
          preview={false}
        />
      ),
    },
    {
      title: "Thông tin phim",
      dataIndex: "ten_phim",
      key: "info",
      width: 380,
      render: (_: any, record: IMovies) => (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text strong style={{ fontSize: 16 }}>
              <Link to={`/admin/movies/detail/${record.id}`}>
                🎬 {record.ten_phim}
              </Link>
            </Text>

            <Text>
              <b>Loại suất chiếu:</b> {record.loai_suat_chieu}
            </Text>

            <Text>
              <b>Quốc gia:</b> {record.quoc_gia}
            </Text>

            <Text>
              <b>Thể loại:</b> {getGenreName(record.the_loai_id)}
            </Text>

            <Text>
              <b>Thời lượng:</b> {record.thoi_luong} phút
            </Text>

            <Text>
              <b>Ngày chiếu:</b>{" "}
              {record.ngay_cong_chieu
                ? moment(record.ngay_cong_chieu).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>

            <Text>
              <b>Ngày kết thúc:</b>{" "}
              {record.ngay_ket_thuc
                ? moment(record.ngay_ket_thuc).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>
          </div>

          <div>
            <Text>
              <b>Chuyên ngữ:</b>{" "}
              {(() => {
                try {
                  const chuyenNguArray = JSON.parse(
                    typeof record.chuyen_ngu === "string"
                      ? record.chuyen_ngu
                      : JSON.stringify(record.chuyen_ngu || [])
                  );
                  return Array.isArray(chuyenNguArray) &&
                    chuyenNguArray.length > 0 ? (
                    chuyenNguArray.map((item: any, index: number) => (
                      <Tag
                        key={index}
                        color="geekblue"
                        style={{
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 6,
                          marginBottom: 4,
                        }}
                      >
                        {item.the_loai}
                      </Tag>
                    ))
                  ) : (
                    <span>Không có dữ liệu</span>
                  );
                } catch (e) {
                  return <span>Không có dữ liệu</span>;
                }
              })()}
            </Text>
          </div>

          <div style={{ marginTop: 4 }}>
            <a href={record.trailer} target="_blank" rel="noreferrer">
              Xem Trailer
            </a>
          </div>
        </div>
      ),
    },

    {
      title: "Giới hạn tuổi",
      dataIndex: "do_tuoi_gioi_han",
      key: "do_tuoi_gioi_han",
      width: 100,
      sorter: (a: IMovies, b: IMovies) =>
        a.do_tuoi_gioi_han - b.do_tuoi_gioi_han,
      render: (age: number) => (age > 0 ? `${age}+` : "Tất cả"),
    },
    {
      title: "Tình trạng",
      dataIndex: "trang_thai_phim",
      key: "trang_thai_phim",
      width: 110,
      filters: [
        { text: "Sắp chiếu", value: "Sắp chiếu" },
        { text: "Đang chiếu", value: "Đang chiếu" },
        { text: "Đã chiếu", value: "Đã chiếu" },
      ],
      onFilter: (value: string, record: IMovies) => record.tinh_trang === value,
      render: (text: string) => (
        <Text
          style={{
            color:
              text === "Đang chiếu"
                ? "green"
                : text === "Sắp chiếu"
                ? "orange"
                : "gray",
            fontWeight: "bold",
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_: any, record: IMovies) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => createOrUpdateOpenModal(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa phim này?"
            onConfirm={() => deleteMutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card style={{ margin: "15px" }}>
        <Typography.Title level={3} style={{ marginBottom: 16 }}>
          Danh sách phim
        </Typography.Title>
        <Button
          type="primary"
          icon={<ExportOutlined />}
          style={{ marginBottom: 12 }}
        >
          <Link to={`/admin/movies/add`}>Thêm phim mới</Link>
        </Button>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 6 }}
        />
      </Card>
      <Modal
        open={isModalOpen}
        title={editingItem ? "Sửa phim" : "Thêm phim mới"}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onCreateOrUpdate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        width={1000}
        okText={editingItem ? "Cập nhật" : "Thêm"}
      >
        <Form
          form={form}
          layout="vertical"
          name="movieForm"
          initialValues={{ trang_thai: 1, do_tuoi_gioi_han: 0 }}
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Form.Item
              label="Tên phim"
              name="ten_phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="mo_ta"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <ReactQuill
                theme="snow"
                style={{ height: "300px", marginBottom: "50px" }}
                placeholder="Nhập mô tả phim"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
              />
            </Form.Item>

            <Form.Item
              label="Trailer (URL)"
              name="trailer"
              rules={[
                { type: "url", message: "Đường dẫn trailer không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập link trailer" />
            </Form.Item>

            <Form.Item label="Poster" name="anh_poster">
              <input
                type="file"
                accept="image/*"
                onChange={onAnhPosterChange}
              />
              {anhPosterPreview && (
                <Image
                  src={anhPosterPreview}
                  alt="Preview Poster"
                  style={{ marginTop: 12, borderRadius: 6, maxWidth: "100%" }}
                  preview={false}
                />
              )}
            </Form.Item>

            <Form.Item
              label="Thời lượng (phút)"
              name="thoi_luong"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời lượng phim",
                },
                {
                  type: "number",
                  min: 1,
                  max: 500,
                  message: "Thời lượng phải từ 1 đến 500 phút",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập thời lượng phim"
                min={1}
                max={500}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Ngôn ngữ"
              name="ngon_ngu"
              rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ" }]}
            >
              <Input placeholder="Nhập ngôn ngữ phim" />
            </Form.Item>

            <Form.Item
              label="Quốc gia"
              name="quoc_gia"
              rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
            >
              <Input placeholder="Nhập quốc gia" />
            </Form.Item>

            <Form.Item
              label="Thể loại"
              name="the_loai_id"
              rules={[{ required: true, message: "Chọn thể loại phim" }]}
            >
              <Select placeholder="Chọn thể loại">
                {genre.map((g) => (
                  <Option key={g.id} value={g.id}>
                    {g.ten_the_loai}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default List;