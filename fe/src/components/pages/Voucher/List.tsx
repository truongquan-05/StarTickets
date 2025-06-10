import {
  Table,
  Button,
  Popconfirm,
  Space,
  message,
  Tag,
  Card,
  Typography,
  Modal,
  Form,
  Input,
} from "antd";
import {
  CloseCircleFilled,
  DeleteOutlined,
  EyeFilled,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import {
  useListVouchers,
  useCreateVoucher,
  useDeleteVoucher,
  useUpdateVoucher,
} from "../../hook/thinhHook";

const { Title } = Typography;

const VouchersList = () => {
  const { data, isLoading, refetch } = useListVouchers({ resource: "ma_giam_gia" });
  const dataSource = data?.data || [];

  const { mutate: deleteVoucher } = useDeleteVoucher({ resource: "ma_giam_gia" });
  const handleDelete = (id) => {
    deleteVoucher(id, {
      onSuccess: () => {
        message.success("Xoá voucher thành công");
        refetch();
      },
      onError: () => {
        message.error("Xoá voucher thất bại");
      },
    });
  };

  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(undefined);

  const createOrUpdateOpenModal = (record) => {
    setModalOpen(true);
    setEditingItem(record);

    if (!record) form.resetFields();
  };

  const { mutate: createVoucher } = useCreateVoucher({ resource: "ma_giam_gia" });
  const { mutate: updateVoucher } = useUpdateVoucher({ resource: "ma_giam_gia" });

  const onCreateOrUpdate = (values) => {
    if (!editingItem) {
      createVoucher(values, {
        onSuccess: () => {
          message.success("Thêm mới voucher thành công");
          setModalOpen(false);
          form.resetFields();
          refetch();
        },
      });
    } else {
      updateVoucher(
        { id: editingItem.id, values },
        {
          onSuccess: () => {
            message.success("Cập nhật voucher thành công");
            setModalOpen(false);
            form.resetFields();
            refetch();
          },
        }
      );
    }
  };

  const handleToggleStatus = (voucher) => {
    const updated = { ...voucher, trang_thai: voucher.trang_thai === 1 ? 0 : 1 };
    updateVoucher(
      { id: voucher.id, values: updated },
      {
        onSuccess: () => {
          message.success("Đã cập nhật trạng thái");
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (isModalOpen && editingItem) {
      form.setFieldsValue(editingItem);
    }
  }, [isModalOpen, editingItem]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Mã", dataIndex: "ma", key: "ma" },
    { title: "Phần trăm giảm", dataIndex: "phan_tram_giam", key: "phan_tram_giam" },
    { title: "Điều kiện", dataIndex: ["dieu_kien", "dieu_kien"], key: "dieu_kien" },
    { title: "Hạn sử dụng", dataIndex: "han_su_dung", key: "han_su_dung" },
    { title: "Ngày bắt đầu", dataIndex: "ngay_bat_dau", key: "ngay_bat_dau" },
    { title: "Số lần sử dụng", dataIndex: "so_lan_su_dung", key: "so_lan_su_dung" },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (trang_thai) =>
        trang_thai === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Tạm ngừng</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            danger={record.trang_thai === 1}
            type={record.trang_thai === 1 ? "default" : "primary"}
            icon={record.trang_thai === 1 ? <CloseCircleFilled /> : <UnlockOutlined />} 
            onClick={() => handleToggleStatus(record)}
          />
          <Popconfirm
            title="Xác nhận xoá voucher?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="primary"
            icon={<EyeFilled />} 
            onClick={() => createOrUpdateOpenModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 15 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Danh sách voucher</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => createOrUpdateOpenModal(undefined)} />
      </div>

      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        loading={isLoading}
      />

      <Modal
        title={editingItem ? "Cập nhật voucher" : "Thêm voucher"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={onCreateOrUpdate} layout="vertical">
          <Form.Item label="Mã" name="ma" rules={[{ required: true, message: "Nhập mã giảm giá!" }]}> <Input /> </Form.Item>
          <Form.Item label="Phần trăm giảm" name="phan_tram_giam" rules={[{ required: true, message: "Nhập % giảm!" }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Điều kiện" name={["dieu_kien", "dieu_kien"]}> <Input /> </Form.Item>
          <Form.Item label="Hạn sử dụng" name="han_su_dung"> <Input /> </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="ngay_bat_dau"> <Input /> </Form.Item>
          <Form.Item label="Số lần sử dụng" name="so_lan_su_dung"> <Input type="number" /> </Form.Item>
          <Button type="primary" htmlType="submit" block>{editingItem ? "Cập nhật" : "Thêm mới"}</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default VouchersList;