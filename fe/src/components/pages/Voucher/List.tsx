import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  message,
  Space,
  Button,
  Popconfirm,
  Table,
  Card,
  Input,
  Image,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import { useState } from "react";
import { IVoucher } from "../Admin/interface/vouchers";
import {
  useListVouchers,
  useDeleteVoucher,
  useUpdateVoucher,
} from "../../hook/thinhHook";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ListVouchers = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IVoucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useListVouchers({ resource: "ma_giam_gia" });
  const { mutate: deleteMutate } = useDeleteVoucher({ resource: "ma_giam_gia" });
  const { mutate: updateMutate } = useUpdateVoucher({ resource: "ma_giam_gia" });

  const dataSource = data?.data ?? [];

  const openModal = (record: IVoucher) => {
    setEditingItem(record);

    form.setFieldsValue({
      ...record,
      ngay_bat_dau: record.ngay_bat_dau ? dayjs(record.ngay_bat_dau) : null,
      ngay_ket_thuc: record.ngay_ket_thuc ? dayjs(record.ngay_ket_thuc) : null,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (!editingItem) return;
    setIsSubmitting(true);

    const isNotActivated = editingItem.trang_thai === "CHƯA KÍCH HOẠT";

    const payload: any = {};

    if (isNotActivated && values.ma) payload.ma = values.ma;
    if (values.image) payload.image = values.image;

    if (isNotActivated && values.phan_tram_giam !== undefined)
      payload.phan_tram_giam = values.phan_tram_giam;
    if (isNotActivated && values.ngay_bat_dau)
      payload.ngay_bat_dau = values.ngay_bat_dau.format("YYYY-MM-DD");

    if (values.giam_toi_da !== undefined) payload.giam_toi_da = values.giam_toi_da;
    if (values.gia_tri_don_hang_toi_thieu !== undefined)
      payload.gia_tri_don_hang_toi_thieu = values.gia_tri_don_hang_toi_thieu;
    if (values.ngay_ket_thuc)
      payload.ngay_ket_thuc = values.ngay_ket_thuc.format("YYYY-MM-DD");
    if (values.so_lan_su_dung !== undefined)
      payload.so_lan_su_dung = values.so_lan_su_dung;
    if (values.trang_thai) payload.trang_thai = values.trang_thai;

    updateMutate(
      { id: editingItem.id, values: payload },
      {
        onSuccess: () => {
          message.success("Cập nhật voucher thành công");
          closeModal();
        },
        onError: (error: any) => {
          message.error(
            error.response?.data?.thong_bao ||
              error.response?.data?.message ||
              "Cập nhật thất bại"
          );
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
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
    { title: "ID", dataIndex: "id", key: "id", width: "5%" },
    { title: "Mã", dataIndex: "ma", key: "ma", ...getColumnSearchProps("ma") },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <Image
          src={url || "https://via.placeholder.com/100"}
          width={100}
          height={100}
          style={{
            objectFit: "cover",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          fallback="https://via.placeholder.com/100"
          preview={false}
        />
      ),
    },
    { title: "Phần trăm giảm", dataIndex: "phan_tram_giam", key: "phan_tram_giam" },
    { title: "Giảm tối đa", dataIndex: "giam_toi_da", key: "giam_toi_da" },
    {
      title: "Giá trị đơn tối thiểu",
      dataIndex: "gia_tri_don_hang_toi_thieu",
      key: "gia_tri_don_hang_toi_thieu",
    },
    { title: "Ngày bắt đầu", dataIndex: "ngay_bat_dau", key: "ngay_bat_dau" },
    { title: "Ngày kết thúc", dataIndex: "ngay_ket_thuc", key: "ngay_ket_thuc" },
    { title: "Số lần sử dụng", dataIndex: "so_lan_su_dung", key: "so_lan_su_dung" },
    { title: "Đã sử dụng", dataIndex: "so_lan_da_su_dung", key: "so_lan_da_su_dung" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: IVoucher) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách voucher"
      extra={
        <Button icon={<PlusOutlined />} type="primary" onClick={() => navigate("/admin/vouchers/add")}>
          Thêm mới
        </Button>
      }
    >
      <Table rowKey="id" dataSource={dataSource} columns={columns} loading={isLoading} pagination={{ pageSize: 5 }} />

      <Modal title="Chỉnh sửa voucher" open={isModalOpen} onCancel={closeModal} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Link ảnh (URL hoặc base64)" name="image">
            <Input />
          </Form.Item>

          {editingItem?.trang_thai !== "KÍCH HOẠT" && (
            <Form.Item label="Phần trăm giảm" name="phan_tram_giam">
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Form.Item label="Giảm tối đa" name="giam_toi_da">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Giá trị đơn tối thiểu" name="gia_tri_don_hang_toi_thieu">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {editingItem?.trang_thai !== "KÍCH HOẠT" && (
            <Form.Item label="Ngày bắt đầu" name="ngay_bat_dau">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Form.Item label="Ngày kết thúc" name="ngay_ket_thuc">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Số lần sử dụng" name="so_lan_su_dung">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="trang_thai">
            <Select>
              <Option value="CHƯA KÍCH HOẠT">Chưa kích hoạt</Option>
              <Option value="KÍCH HOẠT">Kích hoạt</Option>
              <Option value="HẾT HẠN">Hết hạn</Option>
            </Select>
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Cập nhật
            </Button>
            <Button onClick={closeModal}>Hủy</Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default ListVouchers;
