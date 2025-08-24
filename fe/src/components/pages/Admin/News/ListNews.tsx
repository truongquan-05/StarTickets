import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  message,
  Space,
  Button,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  Card,
  Image,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import { INews } from "../interface/news";
import {
  useDeleteNews,
  useListNews,
  useUpdateNews,
  useCreateNews,
} from "../../../hook/hungHook";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";

const BASE_URL = "http://127.0.0.1:8000";

const ListNews = () => {
  const [editForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<INews | null>(null);
  const [previewImage, setPreviewImage] = useState<UploadFile[]>([]);

  const { data, isLoading } = useListNews({ resource: "tin_tuc" });
  const dataSource = data?.data ?? [];

  const { mutate: deleteMutate } = useDeleteNews({ resource: "tin_tuc" });
  const { mutate: updateMutate } = useUpdateNews({ resource: "tin_tuc" });
  const { mutate: createMutate } = useCreateNews({ resource: "tin_tuc" });
  

  const openEditModal = (record: INews | null) => {
    setEditingItem(record);
    if (record) {
      const initialFileList: UploadFile[] = record.hinh_anh
        ? [
            {
              uid: "-1",
              name: "image.jpg",
              status: "done",
              url: `${BASE_URL}/storage/${record.hinh_anh}`,
            },
          ]
        : [];
      editForm.setFieldsValue({
        tieu_de: record.tieu_de,
        noi_dung: record.noi_dung,
        hinh_anh: initialFileList,
      });
      
      setPreviewImage(initialFileList);
    } else {
      // Thêm mới
      editForm.resetFields();
      setPreviewImage([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    editForm.resetFields();
    setPreviewImage([]);
  };

  const onUpdate = (values: any) => {
    const formData = new FormData();
    formData.append("tieu_de", values.tieu_de);
    formData.append("noi_dung", values.noi_dung);

    if (
      values.hinh_anh &&
      values.hinh_anh.length > 0 &&
      values.hinh_anh[0].originFileObj
    ) {
      formData.append("hinh_anh", values.hinh_anh[0].originFileObj);
    }

    if (editingItem) {
      updateMutate(
        { id: editingItem.id, values: formData },
        {
          onSuccess: () => {
            message.success("Cập nhật tin tức thành công");
            closeModal();
          },
          onError: () => {
            message.error("Cập nhật thất bại");
          },
        }
      );
    } else {
      createMutate(formData, {
        onSuccess: () => {
          message.success("Thêm mới tin tức thành công");
          closeModal();
        },
        onError: () => {
          message.error("Thêm mới thất bại");
        },
      });
    }
  };

  const onDelete = (id: number) => {
    deleteMutate(id);
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Xoá
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "8%",
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieu_de",
      key: "tieu_de",
      ...getColumnSearchProps("tieu_de"),
      width: "25%",
    },

    {
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      width: "18%",
      render: (text: string) => (
        <Image
          src={`${BASE_URL}/storage/${text}`}
          width={120}
          height={80}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://via.placeholder.com/120x80?text=No+Image"
          preview={false}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      width: "9%",
      render: (_: any, record: INews) => (
        <Space>
          <Button
            title="Chỉnh sửa"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xác nhận xoá tin tức này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => onDelete(record.id)}
          >
            <Button title="Xoá" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Danh sách tin tức</span>
          <Button type="primary">
            <Link to={"/admin/news/add"}>Thêm mới</Link>
          </Button>
        </div>
      }
      bordered={true}
      style={{
        margin: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        background: "#fff",
        height: "95%",
      }}
    >
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        bordered
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có tin tức nào." }}
      />

      <Modal
        title={
          editingItem
            ? `Chỉnh sửa tin tức (ID: ${editingItem.id})`
            : "Thêm mới tin tức"
        }
        width={1200}
        height={"90vh"}
        style={{position:"relative", top:"20px"}}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={onUpdate}>
          <Form.Item
            label="Tiêu đề"
            name="tieu_de"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="noi_dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
             <ReactQuill
            theme="snow"
            style={{ height: "350px", marginBottom: "50px" }} // tăng chiều cao
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

          <Form.Item
            label="Hình ảnh"
            name="hinh_anh"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            
          >
            <Upload
              listType="picture"
              accept="image/*"
              beforeUpload={() => false}
              maxCount={1}
              defaultFileList={previewImage}
            >
              <Button>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              {editingItem ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={closeModal}>Huỷ</Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default ListNews;
