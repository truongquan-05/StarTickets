import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
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
  InputNumber,
  DatePicker,
  Select,
  Card,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { 
  useListVouchers, 
  useUpdateVoucher, 
  useDeleteVoucher,
  useCreateVoucher
} from "../../hook/thinhHook";
import { IVoucher } from "../Admin/interface/vouchers";

const { Option } = Select;
const ListVouchers = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IVoucher | null>(null);
  const { data, isLoading } = useListVouchers({ resource: "voucher" });
  const { mutate: createMutate } = useCreateVoucher({ resource: "voucher" });
  const { mutate: deleteMutate } = useDeleteVoucher({ resource: "voucher" });
  const { mutate: updateMutate } = useUpdateVoucher({ resource: "voucher" });
  const dataSource = data ?? [];

  const openModal = (record?: IVoucher) => {
    setEditingItem(record || null);
    form.setFieldsValue(record ? {
      ...record,
      ngay_bat_dau: dayjs(record.ngay_bat_dau),
      ngay_ket_thuc: dayjs(record.ngay_ket_thuc),
    } : {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    const formatted = {
      ...values,
      ngay_bat_dau: values.ngay_bat_dau?.format("YYYY-MM-DD"),
      ngay_ket_thuc: values.ngay_ket_thuc?.format("YYYY-MM-DD"),
    };
    if (editingItem) {
      updateMutate({ id: editingItem.id, values: formatted }, {
        onSuccess: () => { message.success("Cập nhật thành công"); closeModal(); },
      });
    } else {
      createMutate(formatted, {
        onSuccess: () => { message.success("Thêm thành công"); closeModal(); },
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: "5%" },
    { title: "Mã", dataIndex: "ma", key: "ma" },
    { title: "Ảnh", dataIndex: "image", key: "image", render: (url: string) => <img src={url} width={80} /> },
    { title: "Phần trăm giảm", dataIndex: "phan_tram_giam", key: "phan_tram_giam" },
    { title: "Giảm tối đa", dataIndex: "giam_toi_da", key: "giam_toi_da" },
    { title: "Giá trị đơn tối thiểu", dataIndex: "gia_tri_don_hang_toi_thieu", key: "gia_tri_don_hang_toi_thieu" },
    { title: "Ngày bắt đầu", dataIndex: "ngay_bat_dau", key: "ngay_bat_dau" },
    { title: "Ngày kết thúc", dataIndex: "ngay_ket_thuc", key: "ngay_ket_thuc" },
    { title: "Số lần sử dụng", dataIndex: "so_lan_su_dung", key: "so_lan_su_dung" },
    { title: "Đã sử dụng", dataIndex: "so_lan_da_su_dung", key: "so_lan_da_su_dung" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IVoucher) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm title="Xóa?" onConfirm={() => deleteMutate(record.id)}><Button icon={<DeleteOutlined />} danger /></Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <Card title="Voucher List" extra={<Button icon={<PlusOutlined />} onClick={() => openModal()}>Add</Button>}>
      <Table rowKey="id" dataSource={dataSource} columns={columns} loading={isLoading} pagination={{ pageSize: 5 }} />
      <Modal title={editingItem ? "Edit Voucher" : "Add Voucher"} open={isModalOpen} onCancel={closeModal} footer={null}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="Mã" name="ma" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Ảnh" name="image" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Phần trăm giảm" name="phan_tram_giam"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Giảm tối đa" name="giam_toi_da"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Giá trị đơn tối thiểu" name="gia_tri_don_hang_toi_thieu"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Ngày bắt đầu" name="ngay_bat_dau"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Ngày kết thúc" name="ngay_ket_thuc"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Số lần sử dụng" name="so_lan_su_dung"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Trạng thái" name="trang_thai">
            <Select><Option value="Kích hoạt">Kích hoạt</Option><Option value="Hết hạn">Hết hạn</Option></Select>
          </Form.Item>
          <Space>
            <Button htmlType="submit" type="primary">{editingItem ? "Cập nhật" : "Thêm mới"}</Button>
            <Button onClick={closeModal}>Hủy</Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default ListVouchers;
