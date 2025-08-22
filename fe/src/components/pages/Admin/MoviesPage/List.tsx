import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined,
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
  // DatePicker,
  message,
  Table,
  Typography,
  Card,
  Tag,
  Col,
  Row,
} from "antd";
import { useEffect, useState } from "react";
import { IMovies, MoviesForm } from "../interface/movies";
import type { FilterDropdownProps } from "antd/es/table/interface";

// import { Link } from "react-router-dom";
import "./Phim.css";
import {
  useListMovies,
  useUpdateMovies,
  useSoftDeleteMovies,
} from "../../../hook/hungHook";
import { getGenreList } from "../../../provider/hungProvider";
import moment from "moment";
import { Link } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;
const { Text } = Typography;

const List = () => {
  const [form] = Form.useForm();
  const { data } = useListMovies({ resource: "phim" });
  const dataSource = data?.data || [];
  // const { mutate: deleteMutate } = useDeleteMovies({ resource: "phim" });
  const { mutate: updateMutate } = useUpdateMovies({ resource: "phim" });
  const { mutate: softDeleteMovie } = useSoftDeleteMovies({ resource: "phim" });

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
      const the_loai_ids = editingItem.the_loai_id
        ? (typeof editingItem.the_loai_id === "string"
            ? JSON.parse(editingItem.the_loai_id)
            : editingItem.the_loai_id
          ).map((item: any) => item.id)
        : [];

      form.setFieldsValue({
        ...editingItem,
        the_loai_id: the_loai_ids,

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
  const [searchText, setSearchText] = useState("");

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  // const handleReset = (clearFilters:any) => {
  //   clearFilters();
  //   setSearchText("");
  // };
  const datauser = localStorage.getItem("user");
  const user = JSON.parse(datauser || "{}");
  const menu = user.vaitro.menu;

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 50,
      align: "center",
      sorter: (a: IMovies, b: IMovies) => a.id - b.id,
    },
    {
      title: "Poster",
      dataIndex: "anh_poster",
      key: "anh_poster",
      width: 220,
      render: (text: string) => (
        <Image
          src={`${BASE_URL}/storage/${text}`}
          style={{
            objectFit: "cover",
            width: 150,
            height: 220,
          }}
          fallback="https://via.placeholder.com/80x120?text=No+Image"
          preview={false}
        />
      ),
    },
    {
      title: "Thông tin phim",
      dataIndex: "ten_phim",
      key: "info",
      width: 520,

      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: any) =>
        record.ten_phim.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm theo tên phim"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button onClick={() => clearFilters?.()} size="small">
              Xóa
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: any) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (_: any, record: IMovies) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text strong style={{ fontSize: 16 }}>
            <Link to={`/admin/movies/detail/${record.id}`}>
              🎬 {record.ten_phim}
            </Link>
          </Text>
          <Text>
            <span style={{ marginRight: "35px" }}>
              {" "}
              <b>Quốc gia:</b>
            </span>{" "}
            {record.quoc_gia}
          </Text>

          <Text>
            <b style={{ marginRight: "23px" }}>Thời lượng:</b>{" "}
            {record.thoi_luong} phút
          </Text>
          <Text>
            <b style={{ marginRight: "21px" }}>Ngày chiếu:</b>{" "}
            {record.ngay_cong_chieu
              ? moment(record.ngay_cong_chieu).format("DD/MM/YYYY")
              : "Chưa cập nhật"}
          </Text>
          <Text>
            <b style={{ marginRight: "5px" }}>Ngày kết thúc:</b>{" "}
            {record.ngay_ket_thuc
              ? moment(record.ngay_ket_thuc).format("DD/MM/YYYY")
              : "Chưa cập nhật"}
          </Text>
          <Text>
            <b style={{ marginRight: "42px" }}>Thể loại:</b>{" "}
            {(() => {
              try {
                const theLoaiAray = JSON.parse(
                  typeof record.the_loai_id === "string"
                    ? record.the_loai_id
                    : JSON.stringify(record.the_loai_id || [])
                );
                return Array.isArray(theLoaiAray) && theLoaiAray.length > 0 ? (
                  theLoaiAray.map((item: any, index: number) => (
                    <Tag
                      key={index}
                      color="geekblue"
                      style={{
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        marginRight: 4,
                        marginBottom: 4,
                        display: "inline-block",
                      }}
                    >
                      {item.ten_the_loai}
                    </Tag>
                  ))
                ) : (
                  <span>Không có dữ liệu</span>
                );
              } catch {
                return <span>Không có dữ liệu</span>;
              }
            })()}
          </Text>
          <Text>
            <b style={{ marginRight: "15px" }}>Chuyên ngữ:</b>{" "}
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
                      color="volcano"
                      style={{
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        marginRight: 4,
                        marginBottom: 4,
                        display: "inline-block",
                      }}
                    >
                      {item.the_loai}
                    </Tag>
                  ))
                ) : (
                  <span>Không có dữ liệu</span>
                );
              } catch {
                return <span>Không có dữ liệu</span>;
              }
            })()}
          </Text>

          {record.trailer && (
            <div style={{ marginTop: 4 }}>
              <a href={record.trailer} target="_blank" rel="noreferrer">
                Xem Trailer
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 140,
      align: "center",
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
            title="Bạn có chắc muốn xóa mềm phim này?"
            onConfirm={() =>
              softDeleteMovie(record.id, {
                onError: () => {
                  // message.error("Xóa mềm thất bại");
                },
              })
            }
            okText="Xóa mềm"
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
  const Size = Quill.import("formats/size") as any;
  Size.whitelist = ["small", "normal", "large", "huge"];
  Quill.register(Size, true);

  return (
    <>
      <Card style={{ margin: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Title level={3} style={{ marginBottom: 16 }}>
            Danh sách phim
          </Typography.Title>

          {menu != 3 && (
            <Button
              type="primary"
              icon={<ExportOutlined />}
              style={{ marginBottom: 12 }}
            >
              <Link to={`/admin/movies/add`}>Thêm phim mới</Link>
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          // scroll={{ x: 1200 }}
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
            .catch(() => {});
        }}
        width={1200}
        style={{ marginTop: "-60px" }}
        okText={editingItem ? "Cập nhật" : "Thêm"}
      >
        <Form
          form={form}
          layout="vertical"
          name="movieForm"
          initialValues={{ trang_thai: 1, do_tuoi_gioi_han: 0 }}
          style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
          className="custom-scroll"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên phim"
                name="ten_phim"
                rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
              >
                <Input placeholder="Nhập tên phim" />
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
            </Col>

            <Col span={12}>
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
                <Select mode="multiple" placeholder="Chọn thể loại" allowClear>
                  {genre.map((g) => (
                    <Option key={g.id} value={g.id}>
                      {g.ten_the_loai}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="mo_ta"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <ReactQuill
                  theme="snow"
                  style={{ height: "350px", marginBottom: "50px" }}
                  placeholder="Nhập mô tả phim"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      [{ size: ["small", "normal", "large", "huge"] }], // dùng size chuẩn
                      ["bold", "italic", "underline", "strike"],
                      [{ color: [] }, { background: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ indent: "-1" }, { indent: "+1" }],
                      [{ align: [] }],
                      ["blockquote", "code-block"],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default List;
