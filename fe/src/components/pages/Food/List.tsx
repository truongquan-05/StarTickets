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
import type { RcFile } from "antd/es/upload/interface";

const { Title } = Typography;

const FoodList = () => {
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
      setFileList(record.hinh_anh ? [{
        uid: "-1",
        name: "image.png",
        status: "done",
        url: record.hinh_anh,
      }] : []);
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  const handleDelete = (id: number) => {
    deleteFood(id, {
      onSuccess: () => {
        message.success("Xoá món ăn thành công");
        refetch();
      },
      onError: () => {
        message.error("Xoá thất bại");
      },
    });
  };

  const onFinish = (values: Food) => {
    if (fileList.length > 0 && fileList[0].url) {
      values.hinh_anh = fileList[0].url;
    }

    if (editingItem) {
      updateFood(
        { id: editingItem.id, values },
        {
          onSuccess: () => {
            message.success("Cập nhật món ăn thành công");
            refetch();
            setModalOpen(false);
          },
          onError: () => {
            message.error("Cập nhật thất bại");
          },
        }
      );
    } else {
      createFood(values, {
        onSuccess: () => {
          message.success("Thêm món ăn thành công");
          refetch();
          setModalOpen(false);
          form.resetFields();
          setFileList([]);
        },
        onError: () => {
          message.error("Thêm món ăn thất bại");
        },
      });
    }
  };

  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/poster", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: data.url,
          },
        ]);
        onSuccess("Ok");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      message.error("Tải ảnh lên thất bại");
      onError?.(err);
    }
  };
  useEffect(() => {
  if (isModalOpen && editingItem) {
    form.setFieldsValue({ ...editingItem });
  }
}, [isModalOpen, editingItem]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      render: (url: string) =>
        url ? <img src={url} alt="" width={60} /> : "Không có",
    },
    { title: "Tên món", dataIndex: "ten_do_an", key: "ten_do_an" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
    {
      title: "Giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia: number) => gia.toLocaleString() + " đ",
    },
    { title: "Số lượng", dataIndex: "so_luong_ton", key: "so_luong_ton" },
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
    <Card style={{ margin: "15px" ,background: "#fff", height: "95%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Danh sách món ăn
        </Title>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
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
              customRequest={customUpload}
              listType="picture"
              fileList={fileList}
              onRemove={() => setFileList([])}
              beforeUpload={(file: RcFile) => {
                const isImage = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
                if (!isImage) {
                  message.error("Chỉ hỗ trợ JPG/PNG/GIF");
                }
                return isImage || Upload.LIST_IGNORE;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Giá (VND)"
            name="gia"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
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
