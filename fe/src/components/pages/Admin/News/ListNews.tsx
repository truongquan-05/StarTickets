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
} from "../../../hook/hungHook";

const BASE_URL = "http://127.0.0.1:8000"; // Sửa theo domain bạn chạy backend

const ListNews = () => {
  const [editForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<INews | null>(null);

  const { data, isLoading } = useListNews({ resource: "tin_tuc" });
  const dataSource = data?.data ?? [];

  const { mutate: deleteMutate } = useDeleteNews({ resource: "tin_tuc" });
  const { mutate: updateMutate } = useUpdateNews({ resource: "tin_tuc" });

  const openEditModal = (record: INews) => {
    setEditingItem(record);
    editForm.setFieldsValue({
      ...record,
      hinh_anh: undefined, // reset file để tránh lỗi không đồng bộ Upload
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    editForm.resetFields();
  };

  const onUpdate = (values: any) => {
    if (!editingItem) return;

    const formData = new FormData();
    formData.append("tieu_de", values.tieu_de);
    formData.append("noi_dung", values.noi_dung);

    const fileList = values.hinh_anh?.fileList;
    if (fileList && fileList.length > 0) {
      formData.append("hinh_anh", fileList[0].originFileObj);
    }

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
  };

  const onDelete = (id: number) => {
    deleteMutate(id);
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
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
            Đặt lại
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
      title: "Nội dung",
      dataIndex: "noi_dung",
      key: "noi_dung",
      ...getColumnSearchProps("noi_dung"),
      width: "40%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      width: "18%",
      render: (text: string) => (
        <Image
          src={`${BASE_URL}${text}`}
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
      title="Danh sách tin tức"
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
        title={`Chỉnh sửa tin tức (ID: ${editingItem?.id ?? ""})`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={onUpdate}
          initialValues={editingItem ?? undefined}
        >
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
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="hinh_anh">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              <Button>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button onClick={closeModal}>Huỷ</Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default ListNews;
