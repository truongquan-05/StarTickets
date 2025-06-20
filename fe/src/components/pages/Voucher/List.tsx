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
  InputNumber,
  DatePicker,
  Select
} from "antd";
import {
  CloseCircleFilled,
  DeleteOutlined,
  EyeFilled,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import {
  useListVouchers,
  useCreateVoucher,
  useDeleteVoucher,
  useUpdateVoucher,
} from "../../hook/thinhHook";

const { Title } = Typography;
const { Option } = Select;

const VouchersList = () => {
  const { data, isLoading, refetch } = useListVouchers({ resource: "ma_giam_gia" });
  const dataSource = data?.data || [];

  const { mutate: deleteVoucher } = useDeleteVoucher({ resource: "ma_giam_gia" });
  const { mutate: createVoucher } = useCreateVoucher({ resource: "ma_giam_gia" });
  const { mutate: updateVoucher } = useUpdateVoucher({ resource: "ma_giam_gia" });

  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(undefined);

  const createOrUpdateOpenModal = (record) => {
    setModalOpen(true);
    setEditingItem(record);
    if (!record) form.resetFields();
  };

  const onCreateOrUpdate = (values) => {
    values.ngay_bat_dau = values.ngay_bat_dau?.format("YYYY-MM-DD");
    values.han_su_dung = values.han_su_dung?.format("YYYY-MM-DD");

    if (!editingItem) {
      createVoucher(values, {
        onSuccess: () => {
          message.success("Thêm voucher thành công");
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

  const handleDelete = (id) => {
    deleteVoucher(id, {
      onSuccess: () => {
        message.success("Xóa voucher thành công");
        refetch();
      },
      onError: () => {
        message.error("Xóa thất bại");
      },
    });
  };

  const handleToggleStatus = (voucher) => {
    const newStatus = voucher.trang_thai === "ACTIVE" ? "PENDING" : "ACTIVE";
    updateVoucher(
      { id: voucher.id, values: { ...voucher, trang_thai: newStatus } },
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
      form.setFieldsValue({
        ...editingItem,
        ngay_bat_dau: editingItem.ngay_bat_dau ? dayjs(editingItem.ngay_bat_dau) : null,
        han_su_dung: editingItem.han_su_dung ? dayjs(editingItem.han_su_dung) : null,
      });
    }
  }, [isModalOpen, editingItem]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>Tìm</Button>
          <Button onClick={() => { clearFilters(); confirm(); }} size="small" style={{ width: 90 }}>Reset</Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Mã", dataIndex: "ma", ...getColumnSearchProps("ma") },
    { title: "Image", dataIndex: "image", ...getColumnSearchProps("image") },
    { title: "Loại", dataIndex: "loai_giam_gia", filters: [
      { text: 'FIXED', value: 'FIXED' },
      { text: 'PERCENT', value: 'PERCENT' },
    ],
      onFilter: (value, record) => record.loai_giam_gia === value
    },
    { title: "Giá trị giảm", dataIndex: "gia_tri_giam" },
    { title: "Giảm tối đa", dataIndex: "giam_toi_da" },
    { title: "Giá trị ĐH tối thiểu", dataIndex: "gia_tri_don_hang_toi_thieu" },
    { title: "Phần trăm giảm", dataIndex: "phan_tram_giam" },
    { title: "Điều kiện", dataIndex: "dieu_kien", ...getColumnSearchProps("dieu_kien") },
    { title: "Ngày bắt đầu", dataIndex: "ngay_bat_dau" },
    { title: "Hạn sử dụng", dataIndex: "han_su_dung" },
    { title: "Số lần sử dụng", dataIndex: "so_lan_su_dung" },
    { title: "Số lần đã sử dụng", dataIndex: "so_lan_da_su_dung" },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      filters: [
        { text: 'ACTIVE', value: 'ACTIVE' },
        { text: 'PENDING', value: 'PENDING' },
        { text: 'EXPIRED', value: 'EXPIRED' },
      ],
      onFilter: (value, record) => record.trang_thai === value,
      render: (trang_thai) => {
        let color = "default";
        if (trang_thai === "ACTIVE") color = "green";
        else if (trang_thai === "PENDING") color = "orange";
        else if (trang_thai === "EXPIRED") color = "red";
        return <Tag color={color}>{trang_thai}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={record.trang_thai === "ACTIVE" ? <CloseCircleFilled /> : <UnlockOutlined />} 
            onClick={() => handleToggleStatus(record)}
          />
          <Popconfirm title="Xóa voucher này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<EyeFilled />} onClick={() => createOrUpdateOpenModal(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Card title="Cinemas List" bordered={true} style={{ margin: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => createOrUpdateOpenModal(undefined)}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        bordered
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? "Cập nhật Voucher" : "Thêm Voucher"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={onCreateOrUpdate} layout="vertical">
          <Form.Item label="Mã" name="ma" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image"><Input /></Form.Item>
          <Form.Item label="Loại giảm giá" name="loai_giam_gia"><Input /></Form.Item>
          <Form.Item label="Giá trị giảm" name="gia_tri_giam"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Giảm tối đa" name="giam_toi_da"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Giá trị đơn hàng tối thiểu" name="gia_tri_don_hang_toi_thieu"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Phần trăm giảm" name="phan_tram_giam"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Điều kiện" name="dieu_kien"><Input /></Form.Item>
          <Form.Item label="Ngày bắt đầu" name="ngay_bat_dau"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Hạn sử dụng" name="han_su_dung"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Số lần sử dụng" name="so_lan_su_dung"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Trạng thái" name="trang_thai">
            <Select>
              <Option value="PENDING">Chưa bắt đầu</Option>
              <Option value="ACTIVE">Đang hoạt động</Option>
              <Option value="EXPIRED">Hết hạn</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default VouchersList;
