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
          <span>Mã đơn</span>
        </Space>
      ),
      dataIndex: "ma_giao_dich",
      key: "ma_giao_dich",
      render: (text: string) => (
        <Tag
          style={{
            fontWeight: "bold",
            fontFamily: "Alata, sans-serif",
            borderRadius: "2px",
            color: "#000",
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: (
        <Space>
          <span>Chi nhánh</span>
        </Space>
      ),
      dataIndex: "ten_rap",
      key: "chi_nhanh",
      render: (text: string) => (
        <Text strong style={{ color: "#000", fontFamily: "Alata, sans-serif" }}>
          {text}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <span>Ngày mua</span>
        </Space>
      ),
      dataIndex: "created_at",
      key: "ngay",
      render: (text: string) => (
        <Text style={{ color: "#000", fontFamily: "Alata, sans-serif" }}>
          {moment(text).format("DD/MM/YYYY")}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <span>Tổng cộng</span>
        </Space>
      ),
      dataIndex: "tong_tien",
      key: "tong_cong",
      render: (value: number) => (
        <Text
          strong
          style={{
            color: "#000",
            fontSize: "16px",
            fontFamily: "Alata, sans-serif",
          }}
        >
          {value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
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
              borderColor: "#1a0933",
              color: "#1a0933",
              borderRadius: "4px"
            }}
          >
            Mã QR
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModalChiTiet(record.thanh_toan_id)}
            style={{
              background: "#1a0933",
              borderRadius: "4px",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          background: "#1a0933",
        }}
      >
        <Card style={{ textAlign: "center", padding: "40px", background: "transparent", border: "none" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px", color: "#666" }}>
            Đang tải dữ liệu...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #1a0933 100%)",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center"}}>
        <Title
          level={2}
          style={{
            fontFamily: "Anton, sans-serif",
            margin: "30px 0",
            fontSize: "40px",
            fontWeight: "100",
            color: "white",
          }}
        >
          LỊCH SỬ MUA VÉ
        </Title>
      </div>
      <Row justify="center">
        <Col xs={24} lg={20}>
          <Card
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "4px",
              border: "1px solid #4b4b4b",
              padding: "24px",
            }}
          >
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
                  background: "#fff",
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
          <div
            style={{
              fontSize: "18px",
              fontWeight: "100",
              fontFamily: "Anton, sans-serif",
            }}
          >
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
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: "4px",
            }}
          >
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>
              Đang tải chi tiết...
            </div>
          </div>
        ) : chiTietData ? (
          <Card
            style={{
              borderRadius: "4px",
              border: "none",
            }}
          >
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item
                label={<Text strong>Phim</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text strong style={{ color: "#000", fontSize: "16px" }}>
                  {chiTietData.data.dat_ve.lich_chieu.phim.ten_phim}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Rạp</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text style={{ color: "#000", fontSize: "15px" }}>
                  {chiTietData.data.dat_ve.lich_chieu.phong_chieu.rap.ten_rap}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Phòng</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Tag color="#000" style={{ fontSize: "14px" }}>
                  {chiTietData.data.dat_ve.lich_chieu.phong_chieu.ten_phong}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Thời lượng</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text>
                  {chiTietData.data.dat_ve.lich_chieu.phim.thoi_luong} phút
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Giờ chiếu</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text strong style={{ color: "#000" }}>
                  {moment(chiTietData.data.dat_ve.lich_chieu.gio_chieu).format(
                    "HH:mm DD/MM/YYYY"
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Giờ kết thúc</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text style={{ color: "#000" }}>
                  {moment(
                    chiTietData.data.dat_ve.lich_chieu.gio_ket_thuc
                  ).format("HH:mm DD/MM/YYYY")}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Ghế đã đặt</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Space wrap>
                  {chiTietData.data.dat_ve.dat_ve_chi_tiet.map((item: any) => (
                    <Tag
                      key={item.ghe_dat.so_ghe}
                      color="#000"
                      style={{
                        fontSize: "14px",
                        padding: "4px 8px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.ghe_dat.so_ghe}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Tổng tiền</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text
                  strong
                  style={{
                    color: "#000",
                    fontSize: "18px",
                    WebkitBackgroundClip: "text",
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
          <div
            style={{
              color: "#1a0933",
              WebkitBackgroundClip: "text",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <QrcodeOutlined style={{ marginRight: "8px", color: "#1a0933" }} />
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
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              borderRadius: "4px",
            }}
          >
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>
              Đang tải mã QR...
            </div>
          </div>
        ) : chiTietData?.data?.qr_code ? (
          <Card
            style={{
              borderRadius: "4px",
              border: "none",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "4px",
                display: "inline-block",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              <Image
                src={`${chiTietData.data.qr_code}`}
                alt="QR Code"
                width={250}
                preview={false}
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginTop: "16px" }}>
              <Text style={{ color: "#666", fontFamily: "Alata, sans-serif" }}>
                Quét mã QR để check-in tại rạp.
              </Text>
            </div>
          </Card>
        ) : (
          <Empty description="Không có QR Code để hiển thị" />
        )}
      </Modal>

      <style>{`
        .modern-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #1a0933 100%); 
          border-bottom: 2px solid #4b4b4b;
          font-weight: 100;
          font-size: 18px;
          font-family: "Anton", sans-serif;
          color: #fff;  
          text-align: center;
        }
        .modern-table .ant-table-tbody > tr:hover > td {
          background: linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%);
        }
        .modern-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default LichSuTatCaVe;
