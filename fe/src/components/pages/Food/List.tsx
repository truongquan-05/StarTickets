import {
  Table,
  Button,
  Popconfirm,
  Space,
  message,
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EyeFilled,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Food } from "../../types/Uses";
import {
  useListFoods,
  useCreateFood,
  useUpdateFood,
  useDeleteFood,
} from "../../hook/duHook";

const { Title } = Typography;

const FoodList = () => {
  const BASE_URL = "http://127.0.0.1:8000";

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "https://via.placeholder.com/100";
    return `${BASE_URL}/storage/${path}`;
  };

  const { data, isLoading, refetch } = useListFoods();
  const foods = data?.data ?? [];

  const { mutate: deleteFood } = useDeleteFood();
  const { mutate: createFood } = useCreateFood();
  const { mutate: updateFood } = useUpdateFood();

  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Food | undefined>(undefined);
  const [fileList, setFileList] = useState<any[]>([]);

  const openModal = (record?: Food) => {
    setModalOpen(true);
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
      setFileList(
        record.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: getImageUrl(record.image),
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  const handleDelete = (id: number) => {
    deleteFood(id, {
      onError: () => {
        message.error("Xoá thất bại");
      },
    });
  };

  const onFinish = async (values: Food) => {
    const formData = new FormData();
    formData.append("ten_do_an", values.ten_do_an);
    formData.append("mo_ta", values.mo_ta);
    formData.append("gia_nhap", values.gia_nhap.toString());
    formData.append("gia_ban", values.gia_ban.toString());
    formData.append("so_luong_ton", values.so_luong_ton.toString());

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    const mutationFn = editingItem ? updateFood : createFood;
    const payload = editingItem
      ? { id: editingItem.id, values: formData }
      : formData;

    mutationFn(payload, {
      onSuccess: () => {
        setModalOpen(false);
        form.resetFields();
        setFileList([]);
      },
      onError: () => {
        message.error(editingItem ? "Cập nhật thất bại" : "Thêm thất bại");
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <img src={getImageUrl(url)} alt="Ảnh món ăn" width={60} />
      ),
    },
    { title: "Tên món", dataIndex: "ten_do_an", key: "ten_do_an" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
    {
      title: "Giá nhập",
      dataIndex: "gia_nhap",
      key: "gia_nhap",
      render: (gia: number) => gia.toLocaleString() + " đ",
    },
    {
      title: "Giá bán",
      dataIndex: "gia_ban",
      key: "gia_ban",
      render: (gia: number) => gia.toLocaleString() + " đ",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "so_luong_ton",
      key: "so_luong_ton",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Food) => (
        <Space>
          <Button
            icon={<EyeFilled />}
            onClick={() => openModal(record)}
            type="primary"
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá món này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xác nhận"
            cancelText="Huỷ"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: "15px", background: "#fff", height: "95%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh sách món ăn
        </Title>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => openModal()}
        >
          Thêm món ăn
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={foods}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        locale={{ emptyText: "Không có món ăn nào." }}
      />

      <Modal
        title={editingItem ? "Cập nhật món ăn" : "Thêm món ăn"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên món"
            name="ten_do_an"
            rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="mo_ta"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => setFileList([])}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Giá nhập (VND)"
            name="gia_nhap"
            rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Giá bán (VND)"
            name="gia_ban"
            rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số lượng tồn"
            name="so_luong_ton"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Button htmlType="submit" type="primary" block>
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default FoodList;
