import { DeleteFilled, EyeFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  useAddQuyen,
  useDeleteQuyen,
  useListVaiTro,
  useShowQuyen,
  useShowQuyenHanTheoID,
} from "../../hook/hungHook";

const { Title } = Typography;
const { Option } = Select;

const PhanQuyen = () => {
  const [form] = Form.useForm();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedQuyenIds, setSelectedQuyenIds] = useState<number[]>([]);

  const { data: quyenData, isLoading: isLoadingQuyen } = useShowQuyen({
    id: selectedRoleId ?? 0,
    resource: "quyen_truy_cap",
  });

  const handleViewQuyenMoTa = (record: any) => {
    setSelectedRoleId(record.id);
    setOpenViewModal(true);
  };
  const { data, isLoading } = useListVaiTro({ resource: "quyen_truy_cap" });
  const { data: getQuyenHan } = useShowQuyenHanTheoID({
    id: selectedRoleId ?? 0,
    resource: "get-quyen",
  });
  const getQuyenHanData = getQuyenHan?.data || [];

  const { mutate: deleteQuyenHan } = useDeleteQuyen({
    resource: "quyen_truy_cap",
  });

  const DeleteQuyen = (pivotId: number) => {
    deleteQuyenHan(pivotId);
  };

  // Mở modal thêm quyền
  const handleOpenAddModal = (record: any) => {
    setSelectedRoleId(record.id);
    setSelectedQuyenIds([]); // reset chọn quyền
    setOpenAddModal(true);
  };
  const { mutate: addQuyen } = useAddQuyen({
    resource: "quyen_truy_cap",
  });
  // Xử lý submit form thêm quyền (cần bạn bổ sung API gọi)
  const handleAddQuyenSubmit = () => {
    if (!selectedRoleId || selectedQuyenIds.length === 0) return;

    addQuyen(
      {
        vai_tro_id: selectedRoleId,
        quyen_han: selectedQuyenIds,
      },
      {
        onSuccess: () => {
          message.success("Thêm quyền hạn thành công");
          setOpenAddModal(false);
          setSelectedRoleId(null);
          setSelectedQuyenIds([]);
          form.resetFields();
          // Optional: refetch lại danh sách quyền đã có
        },
        onError: () => {
          message.error("Thêm quyền hạn thất bại");
        },
      }
    );
  };

  const columns = [
    {
      title: "Tên vai trò",
      dataIndex: "ten_vai_tro",
    },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="default"
            shape="circle"
            icon={<EyeFilled />}
            title="Xem mô tả quyền"
            onClick={() => handleViewQuyenMoTa(record)}
          />
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            title="Thêm quyền"
            onClick={() => handleOpenAddModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Row justify="space-between" align="middle">
          <Col span={24}>
            <Title level={3}>Phân quyền truy cập</Title>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          loading={isLoading}
          dataSource={data?.data}
          pagination={false}
        />
      </Card>

      {/* Modal xem mô tả quyền */}
      <Modal
        open={openViewModal}
        title="Chi tiết mô tả quyền truy cập"
        footer={null}
        onCancel={() => {
          setOpenViewModal(false);
          setSelectedRoleId(null);
        }}
      >
        {isLoadingQuyen ? (
          <p>Đang tải...</p>
        ) : quyenData?.data?.quyen_truy_cap?.length > 0 ? (
          <ul style={{ paddingLeft: 20 }}>
            {quyenData.data.quyen_truy_cap.map((q: any, index: number) => (
              <li
                key={index}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="motaquyen">
                  <b>{q.quyen}</b>: {q.mo_ta}{" "}
                </div>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa quyền này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => DeleteQuyen(q.pivot.id)}
                >
                  <Button icon={<DeleteFilled />} size="small" type="text" />
                </Popconfirm>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có quyền nào được gán.</p>
        )}
      </Modal>

      {/* Modal thêm quyền hạn */}
      <Modal
        open={openAddModal}
        title="Thêm Quyền Hạn"
        footer={null}
        onCancel={() => {
          setOpenAddModal(false);
          setSelectedRoleId(null);
          setSelectedQuyenIds([]);
          form.setFieldsValue({ quyen_han: [] });
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleAddQuyenSubmit}>
          <Form.Item
            label="Chọn quyền hạn"
            name="quyen_han"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 quyền" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn quyền hạn"
              optionLabelProp="label"
              value={selectedQuyenIds}
              onChange={(values) => setSelectedQuyenIds(values)}
              allowClear
              filterOption={(input, option) => {
                const label = option?.label;
                if (typeof label === "string") {
                  return label.toLowerCase().includes(input.toLowerCase());
                }
                return false;
              }}
            >
              {getQuyenHanData.map((item: any) => (
                <Option key={item.id} value={item.id} label={item.quyen}>
                  <div>
                    <b>{item.quyen}</b> - {item.mo_ta}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={selectedQuyenIds.length === 0}
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PhanQuyen;
