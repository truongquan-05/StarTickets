import {
  BankOutlined,
  DeleteFilled,
  EyeFilled,
  HolderOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import {
  useAddQuyen,
  useDeleteQuyen,
  useListCinemas,
  useListVaiTro,
  useShowQuyen,
  useShowQuyenHanTheoID,
} from "../../hook/hungHook";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const PhanQuyen = () => {
  const [form] = Form.useForm();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedQuyenIds, setSelectedQuyenIds] = useState<number[]>([]);
  const [openRapModal, setOpenRapAddModal] = useState(false);
  const [selectedRapIds, setSelectedRapIds] = useState<number[]>([]);
  const { data, isLoading } = useListVaiTro({ resource: "quyen_truy_cap" });
  const { data: listRap = [] } = useListCinemas({ resource: "rap" });
  const [openRapDaGanModal, setOpenRapDaGanModal] = useState(false);
  const [rapDaGan, setRapDaGan] = useState<any>([]);

  const { data: quyenData, isLoading: isLoadingQuyen } = useShowQuyen({
    id: selectedRoleId ?? 0,
    resource: "quyen_truy_cap",
  });

  const handleViewQuyenMoTa = (record: any) => {
    setSelectedRoleId(record.id);
    setOpenViewModal(true);
  };

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

  const handleOpenRapModal = (record: any) => {
    setSelectedRoleId(record.id);
    setOpenRapAddModal(true);
  };
  const handleCloseRapModal = () => {
    setOpenRapAddModal(false);
    setSelectedRoleId(null);
  };
  const handleAddRapSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      if (!selectedRoleId) {
        message.error("Chưa chọn vai trò");
        return;
      }

      const payload = {
        vai_tro_id: selectedRoleId,
        rap_id: selectedRapIds,
      };

      await axios.post("http://127.0.0.1:8000/api/add-rap", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Thêm rạp cho vai trò thành công!");
      setOpenRapAddModal(false);
      setSelectedRapIds([]);
      form.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Lỗi khi thêm rạp cho vai trò"
      );
    }
  };
  const handleOpenRapDaGanModal = async (roleId: number) => {
    setSelectedRoleId(roleId);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/add-rap/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRapDaGan(res.data);
    } catch (err) {
      message.error("Lỗi khi tải rạp đã gán");
    }
    setOpenRapDaGanModal(true);
  };
  const columns = [
    {
      title: "Tên vai trò",
      dataIndex: "ten_vai_tro",
      align: "center", // căn giữa luôn nếu muốn
    },
    {
      title: "Thao tác",
      align: "center", // Căn giữa các button
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
          <Button
            shape="circle"
            icon={<HolderOutlined />}
            title="Gán rạp"
            onClick={() => handleOpenRapModal(record)}
          />
          <Button
            shape="circle"
            icon={<BankOutlined />}
            title="Xem rạp"
            onClick={() => handleOpenRapDaGanModal(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card style={{minHeight: "80vh"}}>
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

      <Modal
        open={openRapModal}
        title="Gán Rạp Cho Vai Trò"
        onCancel={handleCloseRapModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddRapSubmit}>
          <Form.Item
            label="Chọn rạp"
            name="raps"
            rules={[{ required: true, message: "Vui lòng chọnrạp" }]}
          >
            <Select
              placeholder="Chọn rạp"
              optionLabelProp="label"
              value={selectedRapIds}
              onChange={(values) => setSelectedRapIds(values)}
              allowClear
              filterOption={(input, option) => {
                const label = option?.label;
                if (typeof label === "string") {
                  return label.toLowerCase().includes(input.toLowerCase());
                }
                return false;
              }}
            >
              {listRap.map((rap: any) => (
                <Option key={rap.id} value={rap.id} label={rap.ten_rap}>
                  <div>
                    <b>{rap.ten_rap}</b> - {rap.dia_chi}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={selectedRapIds.length === 0}
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Danh sách rạp đã được gán"
        open={openRapDaGanModal}
        onCancel={() => setOpenRapDaGanModal(false)}
        footer={null}
      >
        <List
          bordered
          dataSource={[rapDaGan]}
          renderItem={(item) => (
            <List.Item>
              <div>
                <strong>{item.rap?.ten_rap}</strong>
                <br />
                <span>{item.rap?.dia_chi}</span>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default PhanQuyen;
