import {
  BankOutlined,
  CheckCircleOutlined,
  DeleteFilled,
  EnvironmentOutlined,
  EyeFilled,
  HolderOutlined,
  KeyOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useMemo, useState } from "react";
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
  const [searchText, setSearchText] = useState("");

  // Filtered data based on search
  const filteredQuyenHanData = useMemo(() => {
    if (!searchText.trim()) {
      return getQuyenHanData;
    }
    return getQuyenHanData.filter(
      (item:any) =>
        item.quyen.toLowerCase().includes(searchText.toLowerCase()) ||
        item.mo_ta.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [getQuyenHanData, searchText]);
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
      // align: "center", // căn giữa luôn nếu muốn
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
      <Card style={{ minHeight: "80vh" }}>
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
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserOutlined style={{ color: "#1890ff" }} />
            <span>Chi tiết mô tả quyền truy cập</span>
          </div>
        }
        footer={null}
        onCancel={() => {
          setOpenViewModal(false);
          setSelectedRoleId(null);
        }}
        width={800}
      >
        <div style={{ padding: "12px 0" }}>
          {isLoadingQuyen ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin size="large" />
              <p style={{ marginTop: 16, color: "#666" }}>
                Đang tải dữ liệu...
              </p>
            </div>
          ) : quyenData?.data?.quyen_truy_cap?.length > 0 ? (
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Row gutter={[16, 16]}>
                {quyenData.data.quyen_truy_cap.map((q: any, index: number) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card
                      size="small"
                      style={{
                        height: "100%",
                        border: "1px solid #f0f0f0",
                        borderRadius: 8,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                      bodyStyle={{ padding: "16px", height: "100%" }}
                      hoverable
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <Tag
                              color="blue"
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: 600,
                              }}
                            >
                              {q.quyen}
                            </Tag>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              color: "#666",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                          >
                            {q.mo_ta}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 12,
                          }}
                        >
                          <Popconfirm
                            title="Xác nhận xóa quyền"
                            description="Bạn có chắc chắn muốn xóa quyền này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            okType="danger"
                            placement="topRight"
                            onConfirm={() => DeleteQuyen(q.pivot.id)}
                          >
                            <Button
                              icon={<DeleteFilled />}
                              size="small"
                              type="text"
                              danger
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                              }}
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <p
                    style={{ color: "#999", fontSize: "16px", marginBottom: 8 }}
                  >
                    Chưa có quyền nào được gán
                  </p>
                  <p style={{ color: "#ccc", fontSize: "14px" }}>
                    Hãy thêm quyền để quản lý truy cập
                  </p>
                </div>
              }
              style={{ padding: "40px 0" }}
            />
          )}
        </div>
      </Modal>

      {/* Modal thêm quyền hạn */}
      <Modal
        open={openAddModal}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PlusCircleOutlined style={{ color: "#52c41a" }} />
            <span>Thêm Quyền Hạn</span>
          </div>
        }
        footer={null}
        onCancel={() => {
          setOpenAddModal(false);
          setSelectedRoleId(null);
          setSelectedQuyenIds([]);
          form.setFieldsValue({ quyen_han: [] });
        }}
        width={800}
        centered
      >
        <div style={{ padding: "12px 0" }}>
          <Form form={form} layout="vertical" onFinish={handleAddQuyenSubmit}>
            <Form.Item
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <KeyOutlined style={{ color: "#1890ff" }} />
                  <span style={{ fontSize: "16px", fontWeight: 500 }}>
                    Chọn quyền hạn
                  </span>
                </div>
              }
              name="quyen_han"
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất 1 quyền" },
              ]}
            >
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#666" }}>
                    Danh sách quyền ({filteredQuyenHanData.length}/
                    {getQuyenHanData.length})
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      size="small"
                      onClick={() => {
                        const allIds = filteredQuyenHanData.map(
                          (item:any) => item.id
                        );
                        setSelectedQuyenIds([
                          ...new Set([...selectedQuyenIds, ...allIds]),
                        ]);
                        form.setFieldsValue({
                          quyen_han: [
                            ...new Set([...selectedQuyenIds, ...allIds]),
                          ],
                        });
                      }}
                    >
                      Chọn tất cả
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedQuyenIds([]);
                        form.setFieldsValue({ quyen_han: [] });
                      }}
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="🔍 Tìm kiếm quyền theo tên hoặc mô tả..."
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    style={{ borderRadius: "6px" }}
                  />
                </div>

                <div
                  style={{
                    maxHeight: "350px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <Row gutter={[16, 12]}>
                    {filteredQuyenHanData.length > 0 ? (
                      filteredQuyenHanData.map((item:any) => (
                        <Col xs={24} sm={12} key={item.id}>
                          <Card
                            size="small"
                            style={{
                              border: selectedQuyenIds.includes(item.id)
                                ? "2px solid #1890ff"
                                : "1px solid #f0f0f0",
                              borderRadius: "8px",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              background: selectedQuyenIds.includes(item.id)
                                ? "#f6ffed"
                                : "white",
                            }}
                            bodyStyle={{ padding: "12px" }}
                            hoverable
                            onClick={() => {
                              const newIds = selectedQuyenIds.includes(item.id)
                                ? selectedQuyenIds.filter(
                                    (id) => id !== item.id
                                  )
                                : [...selectedQuyenIds, item.id];
                              setSelectedQuyenIds(newIds);
                              form.setFieldsValue({ quyen_han: newIds });
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                              }}
                            >
                              <Checkbox
                                checked={selectedQuyenIds.includes(item.id)}
                                style={{ marginTop: 2 }}
                              />
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    color: selectedQuyenIds.includes(item.id)
                                      ? "#1890ff"
                                      : "#333",
                                    fontSize: "14px",
                                    marginBottom: 4,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <KeyOutlined style={{ fontSize: "12px" }} />
                                  {item.quyen}
                                </div>
                                <div
                                  style={{
                                    color: "#666",
                                    fontSize: "13px",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {item.mo_ta}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col span={24}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <span style={{ color: "#999" }}>
                              Không tìm thấy quyền nào phù hợp với "{searchText}
                              "
                            </span>
                          }
                          style={{ padding: "40px 0" }}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </Form.Item>

            {selectedQuyenIds.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  padding: "16px",
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    color: "#52c41a",
                  }}
                >
                  <CheckCircleOutlined />
                  <span style={{ fontWeight: 500 }}>
                    Đã chọn {selectedQuyenIds.length} quyền:
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedQuyenIds.map((id) => {
                    const permission = getQuyenHanData.find(
                      (item:any) => item.id === id
                    );
                    return permission ? (
                      <Tag
                        key={id}
                        color="green"
                        closable
                        onClose={() => {
                          const newIds = selectedQuyenIds.filter(
                            (selectedId) => selectedId !== id
                          );
                          setSelectedQuyenIds(newIds);
                          form.setFieldsValue({ quyen_han: newIds });
                        }}
                        style={{
                          margin: 0,
                          padding: "4px 8px",
                          fontSize: "13px",
                        }}
                      >
                        {permission.quyen}
                      </Tag>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <div
                style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
              >
                <Button
                  onClick={() => {
                    setOpenAddModal(false);
                    setSelectedRoleId(null);
                    setSelectedQuyenIds([]);
                    form.setFieldsValue({ quyen_han: [] });
                  }}
                  style={{ minWidth: 80 }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={selectedQuyenIds.length === 0}
                  icon={<SaveOutlined />}
                  style={{ minWidth: 100 }}
                >
                  Lưu ({selectedQuyenIds.length})
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        open={openRapModal}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShopOutlined style={{ color: "#722ed1" }} />
            <span>Gán Rạp Cho Vai Trò</span>
          </div>
        }
        onCancel={handleCloseRapModal}
        footer={null}
        width={700}
      >
        <div style={{ padding: "12px 0" }}>
          <Form form={form} layout="vertical" onFinish={handleAddRapSubmit}>
            <Form.Item
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <EnvironmentOutlined style={{ color: "#722ed1" }} />
                  <span style={{ fontSize: "16px", fontWeight: 500 }}>
                    Chọn rạp chiếu phim
                  </span>
                </div>
              }
              name="raps"
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất 1 rạp" },
              ]}
            >
              <Select
                placeholder="🎬 Tìm kiếm và chọn rạp chiếu..."
                optionLabelProp="label"
                value={selectedRapIds}
                onChange={(values) => setSelectedRapIds(values)}
                allowClear
                showSearch
                style={{ minHeight: "40px" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                filterOption={(input, option) => {
                  const label = option?.label;
                  const children = option?.children;
                  if (typeof label === "string") {
                    return label.toLowerCase().includes(input.toLowerCase());
                  }
                  if (typeof children === "string") {
                    return (children as string)
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }
                  return false;
                }}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <Tag
                      color="purple"
                      closable={closable}
                      onClose={onClose}
                      style={{
                        margin: "2px 4px 2px 0",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "13px",
                      }}
                    >
                      <ShopOutlined
                        style={{ marginRight: 4, fontSize: "12px" }}
                      />
                      {label}
                    </Tag>
                  );
                }}
              >
                {listRap.map((rap: any) => (
                  <Option key={rap.id} value={rap.id} label={rap.ten_rap}>
                    <div
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          background:
                            "linear-gradient(135deg, #722ed1, #9254de)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          flexShrink: 0,
                        }}
                      >
                        🎬
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#722ed1",
                            fontSize: "14px",
                            marginBottom: 4,
                          }}
                        >
                          {rap.ten_rap}
                        </div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: "13px",
                            lineHeight: "1.4",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <EnvironmentOutlined
                            style={{ fontSize: "12px", color: "#999" }}
                          />
                          {rap.dia_chi}
                        </div>
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedRapIds && selectedRapIds.length > 0 && (
              <div
                style={{
                  marginBottom: 24,
                  padding: "16px",
                  background: "#f9f0ff",
                  border: "1px solid #d3adf7",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    color: "#722ed1",
                  }}
                >
                  <CheckCircleOutlined />
                  <span style={{ fontWeight: 500 }}>
                    Đã chọn {selectedRapIds.length} rạp:
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedRapIds.map((id) => {
                    const rap = listRap.find((item: any) => item.id === id);
                    return rap ? (
                      <div
                        key={id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          background: "white",
                          border: "1px solid #d3adf7",
                          borderRadius: "6px",
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(135deg, #722ed1, #9254de)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                          }}
                        >
                          🎬
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: "#722ed1" }}>
                            {rap.ten_rap}
                          </div>
                          <div style={{ color: "#999", fontSize: "11px" }}>
                            {rap.dia_chi?.length > 30
                              ? rap.dia_chi.substring(0, 30) + "..."
                              : rap.dia_chi}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <Form.Item style={{ marginBottom: 0 }}>
              <div
                style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
              >
                <Button onClick={handleCloseRapModal} style={{ minWidth: 80 }}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!selectedRapIds || selectedRapIds.length === 0}
                  icon={<SaveOutlined />}
                  style={{
                    minWidth: 100,
                    background: "linear-gradient(135deg, #722ed1, #9254de)",
                    borderColor: "#722ed1",
                  }}
                >
                  Lưu
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UnorderedListOutlined style={{ color: "#52c41a" }} />
            <span>Danh sách rạp đã được gán</span>
          </div>
        }
        open={openRapDaGanModal}
        onCancel={() => setOpenRapDaGanModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: "12px 0" }}>
          {rapDaGan.id ? (
            <>
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <Card
                  // key={index}
                  style={{
                    marginBottom: 12,
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: "16px" }}
                  hoverable
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #52c41a, #73d13d)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      🎬
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#52c41a",
                          fontSize: "16px",
                          marginBottom: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <ShopOutlined style={{ fontSize: "14px" }} />
                        {rapDaGan.rap?.ten_rap}
                      </div>

                      <div
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          lineHeight: "1.4",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                        }}
                      >
                        <EnvironmentOutlined
                          style={{
                            fontSize: "14px",
                            color: "#999",
                            marginTop: "2px",
                            flexShrink: 0,
                          }}
                        />
                        <span>{rapDaGan.rap?.dia_chi}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "4px 8px",
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "#52c41a",
                        fontWeight: 500,
                      }}
                    >
                      Đã gán
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{ color: "#999", fontSize: "16px", marginBottom: 8 }}
                  >
                    Chưa có rạp nào được gán
                  </p>
                  <p style={{ color: "#ccc", fontSize: "14px" }}>
                    Hãy gán rạp cho vai trò này để quản lý
                  </p>
                </div>
              }
              style={{ padding: "40px 0" }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default PhanQuyen;
