import { useState, useMemo } from "react";
import {
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
  Tabs,
} from "antd";
import { EyeOutlined, QrcodeOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  useListLichSuDonHang,
  useListLichSuDonHangChiTiet,
} from "../../../hook/hungHook";
import "./LichSuTatCaVe.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const LichSuTatCaVe = () => {
  const { data: lichSu, isLoading: loadingLichSu } = useListLichSuDonHang({
    resource: "lich-su-ve",
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalChiTietVisible, setModalChiTietVisible] = useState(false);
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: chiTietData,
    isLoading: loadingChiTiet,
    refetch,
  } = useListLichSuDonHangChiTiet({
    resource: "lich-su-ve",
    id: selectedId ?? undefined,
  });

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
      const gioChieu = moment(lichChieu?.gio_chieu);
      const isWatched = moment().isAfter(gioChieu);

      return {
        id: don.id,
        ma_giao_dich: don.ma_giao_dich,
        created_at: don.created_at,
        tong_tien: datVe?.tong_tien ? parseFloat(datVe.tong_tien) : 0,
        ten_phim: phim?.ten_phim || "",
        ten_rap: rap?.ten_rap || "Không rõ",
        thanh_toan_id: don.id,
        poster: phim?.hinh_anh || "/default-poster.jpg",
        gio_chieu: lichChieu?.gio_chieu,
        ten_phong: phong?.ten_phong,
        thoi_luong: phim?.thoi_luong,
        isWatched,
        the_loai: phim?.the_loai?.map((tl: any) => tl.ten_the_loai).join(", ") || "",
      };
    });
  }, [lichSu]);

  const filteredData = useMemo(() => {
    if (activeTab === "watched") {
      return mergedData.filter(item => item.isWatched);
    }
    if (activeTab === "upcoming") {
      return mergedData.filter(item => !item.isWatched);
    }
    return mergedData;
  }, [mergedData, activeTab]);

  const renderTicketCard = (ticket: any) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={ticket.id}>
      <Card className={`history-ticket-card ${ticket.isWatched ? 'history-watched' : 'history-upcoming'}`}>
        <div className="history-ticket-header">
          <div className="history-status-section">
            {ticket.isWatched ? (
              <Tag color="success" className="history-status-tag history-watched-tag">
                ĐÃ XEM
              </Tag>
            ) : (
              <Tag color="processing" className="history-status-tag history-upcoming-tag">
                CHƯA XEM
              </Tag>
            )}
          </div>
          <div className="history-movie-info">
            <Title level={4} className="history-movie-title" title={ticket.ten_phim}>
              {ticket.ten_phim}
            </Title>
            <Text className="history-movie-genre">{ticket.the_loai}</Text>
            <div className="history-cinema-info">
              <Text className="history-cinema-name">{ticket.ten_rap}</Text>
              <Text className="history-room-name">Phòng {ticket.ten_phong}</Text>
            </div>
          </div>
        </div>
        
        <div className="history-ticket-details">
          <div className="history-time-info">
            <div className="history-time-item">
              <CalendarOutlined className="history-icon" />
              <span>{moment(ticket.gio_chieu).format("DD/MM/YYYY")}</span>
            </div>
            <div className="history-time-item">
              <ClockCircleOutlined className="history-icon" />
              <span>{moment(ticket.gio_chieu).format("HH:mm")}</span>
            </div>
          </div>
          
          <div className="history-price-info">
            <Text className="history-total-price">
              {ticket.tong_tien.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </div>
          
          <div className="history-transaction-code">
            <Text className="history-code">#{ticket.ma_giao_dich}</Text>
          </div>
        </div>
        
        <div className="history-ticket-actions">
          <Button
            type="default"
            icon={<QrcodeOutlined />}
            onClick={() => showModalQR(ticket.thanh_toan_id)}
            className="history-qr-button"
            disabled={ticket.isWatched}
          >
            Mã QR
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModalChiTiet(ticket.thanh_toan_id)}
            className="history-detail-button"
          >
            Chi tiết
          </Button>
        </div>
      </Card>
    </Col>
  );

  if (loadingLichSu) {
    return (
      <div className="history-loading-container">
        <Card className="history-loading-card">
          <Spin size="large" />
          <div className="history-loading-text">Đang tải dữ liệu...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header-section">
        <Title level={2} className="history-page-title">
          LỊCH SỬ MUA VÉ
        </Title>
      </div>

      <div className="history-content-wrapper">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="history-tabs"
          centered
        >
          <TabPane tab={`Tất cả (${mergedData.length})`} key="all" />
          <TabPane 
            tab={`Chưa xem (${mergedData.filter(item => !item.isWatched).length})`} 
            key="upcoming" 
          />
          <TabPane 
            tab={`Đã xem (${mergedData.filter(item => item.isWatched).length})`} 
            key="watched" 
          />
          
        </Tabs>

        <div className="history-tickets-section">
          {filteredData.length === 0 ? (
            <Empty
              description="Chưa có lịch sử mua vé nào"
              className="history-empty-state"
            />
          ) : (
            <Row gutter={[24, 24]} className="history-tickets-grid">
              {filteredData.map(renderTicketCard)}
            </Row>
          )}
        </div>
      </div>

      {/* Modal Chi Tiết Vé */}
      <Modal
        title={
          <div className="history-modal-title">
            Chi tiết vé #{selectedId}
          </div>
        }
        open={modalChiTietVisible}
        onCancel={handleCloseChiTiet}
        footer={null}
        width={700}
        className="history-detail-modal"
      >
        {loadingChiTiet ? (
          <div className="history-modal-loading">
            <Spin size="large" />
            <div className="history-loading-text">Đang tải chi tiết...</div>
          </div>
        ) : chiTietData ? (
          <Card className="history-detail-card">
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item
                label={<Text strong>Phim</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text strong className="history-detail-movie-name">
                  {chiTietData.data.dat_ve.lich_chieu.phim.ten_phim}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Rạp</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text className="history-detail-cinema">
                  {chiTietData.data.dat_ve.lich_chieu.phong_chieu.rap.ten_rap}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Phòng</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Tag color="#000" className="history-room-tag">
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
                <Text strong className="history-showtime">
                  {moment(chiTietData.data.dat_ve.lich_chieu.gio_chieu).format(
                    "HH:mm DD/MM/YYYY"
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Giờ kết thúc</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text className="history-endtime">
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
                      className="history-seat-tag"
                    >
                      {item.ghe_dat.so_ghe}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text strong>Đồ ăn đã đặt</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Space wrap size={[8, 8]} className="history-food-tags">
                  {chiTietData.data.dat_ve.don_do_an.map((item: any) => (
                    <Tag
                      key={item.id}
                      color="geekblue"
                      className="history-food-tag"
                    >
                      {item.do_an.ten_do_an} × {item.so_luong}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Text strong>Tổng tiền</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text strong className="history-total-amount">
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
          <div className="history-qr-modal-title">
            <QrcodeOutlined className="history-qr-icon" />
            Mã QR vé #{selectedId}
          </div>
        }
        open={modalQRVisible}
        onCancel={handleCloseQR}
        footer={null}
        width={450}
        className="history-qr-modal"
      >
        {loadingChiTiet ? (
          <div className="history-modal-loading">
            <Spin size="large" />
            <div className="history-loading-text">Đang tải mã QR...</div>
          </div>
        ) : chiTietData?.data?.qr_code ? (
          <Card className="history-qr-card">
            <div className="history-qr-container">
              <Image
                src={`${chiTietData.data.qr_code}`}
                alt="QR Code"
                width={250}
                preview={false}
                className="history-qr-image"
              />
            </div>
            <div className="history-qr-description">
              <Text className="history-qr-text">
                Quét mã QR để check-in tại rạp.
              </Text>
            </div>
          </Card>
        ) : (
          <Empty description="Không có QR Code để hiển thị" />
        )}
      </Modal>
    </div>
  );
};

export default LichSuTatCaVe;