import { useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Spin,
  Image,
  Space,
  Descriptions,
  Tag,
  Card,
  Row,
  Col,
  Typography,
  Empty,
} from "antd";
import {
  EyeOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  useListLichSuDonHang,
  useListLichSuDonHangChiTiet,
} from "../../../hook/hungHook";

const { Title, Text } = Typography;

const LichSuTatCaVe = () => {
  const { data: lichSu, isLoading: loadingLichSu } = useListLichSuDonHang({
    resource: "lich-su-ve",
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalChiTietVisible, setModalChiTietVisible] = useState(false);
  const [modalQRVisible, setModalQRVisible] = useState(false);

  const {
    data: chiTietData,
    isLoading: loadingChiTiet,
    refetch,
  } = useListLichSuDonHangChiTiet({
    resource: "lich-su-ve",
    id: selectedId ?? undefined,
  });
  console.log(chiTietData);

  const showModalChiTiet = (id: number) => {
    setSelectedId(id);
    setModalChiTietVisible(true);
    refetch();
  };

  const showModalQR = (id: number) => {
    setSelectedId(id);
    setModalQRVisible(true);
    refetch();
  };

  const handleCloseChiTiet = () => {
    setModalChiTietVisible(false);
    setSelectedId(null);
  };

  const handleCloseQR = () => {
    setModalQRVisible(false);
    setSelectedId(null);
  };

  const mergedData = useMemo(() => {
    if (!lichSu?.data) return [];

    return lichSu.data.map((don: any) => {
      const datVe = don.dat_ve;
      const lichChieu = datVe?.lich_chieu;
      const phim = lichChieu?.phim;
      const phong = lichChieu?.phong_chieu;
      const rap = phong?.rap;

      return {
        id: don.id,
        ma_giao_dich: don.ma_giao_dich,
        created_at: don.created_at,
        tong_tien: datVe?.tong_tien ? parseFloat(datVe.tong_tien) : 0,
        ten_phim: phim?.ten_phim || "",
        ten_rap: rap?.ten_rap || "Không rõ",
        thanh_toan_id: don.id,
      };
    });
  }, [lichSu]);

  const columns = [
    {
      title: (
        <Space>
          <FileTextOutlined />
          <span>Mã đơn</span>
        </Space>
      ),
      dataIndex: "ma_giao_dich",
      key: "ma_giao_dich",
      render: (text: string) => (
        <Tag color="blue" style={{ fontWeight: "bold" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined />
          <span>Chi nhánh</span>
        </Space>
      ),
      dataIndex: "ten_rap",
      key: "chi_nhanh",
      render: (text: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Ngày mua</span>
        </Space>
      ),
      dataIndex: "created_at",
      key: "ngay",
      render: (text: string) => (
        <Text style={{ color: "#666" }}>
          {moment(text).format("DD/MM/YYYY")}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          <span>Tổng cộng</span>
        </Space>
      ),
      dataIndex: "tong_tien",
      key: "tong_cong",
      render: (value: number) => (
        <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
          {value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="default"
            icon={<QrcodeOutlined />}
            onClick={() => showModalQR(record.thanh_toan_id)}
            style={{
              borderColor: "#722ed1",
              color: "#722ed1",
            }}
          >
            Mã QR
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModalChiTiet(record.thanh_toan_id)}
            style={{
              background: "linear-gradient(45deg, #1890ff, #096dd9)",
              borderColor: "#1890ff",
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  if (loadingLichSu) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
      background: "linear-gradient(to bottom, #1a0933, #222222)",
        borderRadius: "12px"
      }}>
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px", color: "#666" }}>
            Đang tải dữ liệu...
          </div>
        </Card>
      </div>
    );
  }



  return (
    <div style={{ 
    background: "linear-gradient(to bottom, #1a0933, #222222)",
      minHeight: "100vh",
      padding: "24px"
    }}>
      <Row justify="center">
        <Col xs={24} lg={20} xl={18}>
          <Card
           
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Title
                level={2}
                style={{
                  background: "linear-gradient(45deg, #1890ff, #722ed1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                  fontSize: "28px",
                  fontWeight: "bold"
                }}
              >
                LỊCH SỬ MUA VÉ
              </Title>
              <div style={{ 
                width: "60px", 
                height: "4px", 
                background: "linear-gradient(45deg, #1890ff, #722ed1)",
                // borderRadius: "2px",
                margin: "0 auto"
              }}></div>
            </div>

            {mergedData.length === 0 ? (
              <Empty
                description="Chưa có lịch sử mua vé nào"
                style={{ padding: "60px 0" }}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={mergedData}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} đơn hàng`,
                }}
                style={{ 
                  background: "transparent",
                }}
                className="modern-table"
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal Chi Tiết Vé */}
      <Modal
        title={
          <div style={{
            background: "linear-gradient(45deg, #1890ff, #722ed1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            <EyeOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
            Chi tiết vé #{selectedId}
          </div>
        }
        open={modalChiTietVisible}
        onCancel={handleCloseChiTiet}
        footer={null}
        width={700}
        style={{ top: 100 }}
      >
        {loadingChiTiet ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 0",
            // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: "12px"
          }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>
              Đang tải chi tiết...
            </div>
          </div>
        ) : chiTietData ? (
          <Card
            style={{
              // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "12px",
              border: "none"
            }}
          >
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item 
                label={<Text strong>🎬 Phim</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                  {chiTietData.data.dat_ve.lich_chieu.phim.ten_phim}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>🏢 Rạp</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Text style={{ color: "#52c41a", fontSize: "15px" }}>
                  {chiTietData.data.dat_ve.lich_chieu.phong_chieu.rap.ten_rap}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>🎭 Phòng</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Tag color="orange" style={{ fontSize: "14px" }}>
                  {chiTietData.data.dat_ve.lich_chieu.phong_chieu.ten_phong}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>⏱️ Thời lượng</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Text>{chiTietData.data.dat_ve.lich_chieu.phim.thoi_luong} phút</Text>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>🕐 Giờ chiếu</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Text strong style={{ color: "#1890ff" }}>
                  {moment(chiTietData.data.dat_ve.lich_chieu.gio_chieu).format(
                    "HH:mm DD/MM/YYYY"
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>🏁 Giờ kết thúc</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Text style={{ color: "#ff4d4f" }}>
                  {moment(chiTietData.data.dat_ve.lich_chieu.gio_ket_thuc).format(
                    "HH:mm DD/MM/YYYY"
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>💺 Ghế đã đặt</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Space wrap>
                  {chiTietData.data.dat_ve.dat_ve_chi_tiet
                    .map((item: any) => (
                      <Tag 
                        key={item.ghe_dat.so_ghe}
                        color="green" 
                        style={{ 
                          fontSize: "14px", 
                          padding: "4px 8px",
                          fontWeight: "bold"
                        }}
                      >
                        {item.ghe_dat.so_ghe}
                      </Tag>
                    ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text strong>💰 Tổng tiền</Text>}
                labelStyle={{  fontWeight: "bold" }}
              >
                <Text 
                  strong 
                  style={{ 
                    color: "#52c41a", 
                    fontSize: "18px",
                    background: "linear-gradient(45deg, #52c41a, #389e0d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {Number(chiTietData.data?.dat_ve?.tong_tien).toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          <Empty description="Không có dữ liệu chi tiết vé" />
        )}
      </Modal>

      {/* Modal QR Code */}
      <Modal
        title={
          <div style={{
            background: "linear-gradient(45deg, #722ed1, #eb2f96)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            <QrcodeOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
            Mã QR vé #{selectedId}
          </div>
        }
        open={modalQRVisible}
        onCancel={handleCloseQR}
        footer={null}
        width={450}
        style={{ top: 150 }}
      >
        {loadingChiTiet ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 0",
            borderRadius: "12px"
          }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>
              Đang tải mã QR...
            </div>
          </div>
        ) : chiTietData?.data?.qr_code ? (
          <Card
            style={{
              borderRadius: "12px",
              border: "none",
              textAlign: "center"
            }}
          >
            <div style={{ 
              background: "white", 
              padding: "20px", 
              borderRadius: "12px",
              display: "inline-block",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
            }}>
              <Image
                src={`${chiTietData.data.qr_code}`}
                alt="QR Code"
                width={250}
                preview={false}
                style={{ borderRadius: "8px" }}
              />
            </div>
            <div style={{ marginTop: "16px", color: "#666" }}>
              <Text>Quét mã QR để check-in tại rạp</Text>
            </div>
          </Card>
        ) : (
          <Empty description="Không có QR Code để hiển thị" />
        )}
      </Modal>

      <style jsx>{`
        .modern-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
          border-bottom: 2px solid #1890ff;
          font-weight: bold;
          color: #1890ff;
        }
        .modern-table .ant-table-tbody > tr:hover > td {
          background: linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%);
        }
        .modern-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px;
        }
      `}</style>
    </div>
  );
};

export default LichSuTatCaVe;