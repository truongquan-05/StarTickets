import { useState, useMemo } from "react";
import {
  Button,
  Modal,
  Spin,
  Image,
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
      return mergedData.filter((item: any) => item.isWatched);
    }
    if (activeTab === "upcoming") {
      return mergedData.filter((item: any) => !item.isWatched);
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
          onChange={(key: string) => setActiveTab(key)}
          className="history-tabs"
          centered
        >
          <TabPane tab={`Tất cả (${(mergedData as any[]).length})`} key="all" />
          <TabPane 
            tab={`Chưa xem (${(mergedData as any[]).filter((item: any) => !item.isWatched).length})`} 
            key="upcoming" 
          />
          <TabPane 
            tab={`Đã xem (${(mergedData as any[]).filter((item: any) => item.isWatched).length})`} 
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
      {/* <Modal
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

              <Descriptions.Item
                label={<Text strong>Qr</Text>}
                labelStyle={{ fontWeight: "bold" }}
              >
                <div className="history-qr-container">
              <Image
                src={`${chiTietData.data.qr_code}`}
                alt="QR Code"
                width={150}
                preview={false}
                className="history-qr-image"
              />
            </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          <Empty description="Không có dữ liệu chi tiết vé" />
        )}
      </Modal> */}
<Modal
  title={null}
  open={modalChiTietVisible}
  onCancel={handleCloseChiTiet}
  footer={null}
  width={700}
  className="ticket-modal"
  centered
>
  {loadingChiTiet ? (
    <div className="loading-container">
      <Spin size="large" />
      <Text className="loading-text">Đang tải chi tiết vé...</Text>
    </div>
  ) : chiTietData ? (
    <div className="movie-ticket">
      {/* Ticket Header */}
      <div className="ticket-header">
        <div className="ticket-stub">
          <div className="stub-content">
            <div className="ticket-number">#{selectedId}</div>
            <div className="admit-text">ADMIT ONE</div>
          </div>
        </div>
        <div className="ticket-main-header">
          <h1 className="cinema-name">
            {chiTietData.data.dat_ve.lich_chieu.phong_chieu.rap.ten_rap}
          </h1>
          <div className="ticket-type">MOVIE TICKET</div>
        </div>
      </div>

      {/* Perforated line */}
      <div className="perforation"></div>

      {/* Ticket Body */}
      <div className="ticket-body">
        <div className="ticket-main-info">
          {/* Movie Title */}
          <div className="movie-title-section">
            <h2 className="movie-title" style={{maxWidth: "340px"}}>
              {chiTietData.data.dat_ve.lich_chieu.phim.ten_phim}
            </h2>
            <div className="duration">
              Thời lượng: {chiTietData.data.dat_ve.lich_chieu.phim.thoi_luong} phút
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="ticket-details-grid">
            <div className="detail-item">
              <div className="detail-label">NGÀY</div>
              <div className="detail-value">
                {moment(chiTietData.data.dat_ve.lich_chieu.gio_chieu).format("DD/MM/YYYY")}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">GIỜ CHIẾU</div>
              <div className="detail-value">
                {moment(chiTietData.data.dat_ve.lich_chieu.gio_chieu).format("HH:mm")}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">PHÒNG</div>
              <div className="detail-value room-number">
                {chiTietData.data.dat_ve.lich_chieu.phong_chieu.ten_phong}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">GHẾ</div>
              <div className="detail-value seats-list">
                {chiTietData.data.dat_ve.dat_ve_chi_tiet.map((item:any, index:any) => (
                  <span key={item.ghe_dat.so_ghe} className="seat-number">
                    {item.ghe_dat.so_ghe}
                    {index < chiTietData.data.dat_ve.dat_ve_chi_tiet.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Food Items */}
          {chiTietData.data.dat_ve.don_do_an.length > 0 && (
            <div className="food-section">
              <div className="section-title">ĐỒ ĂN & THỨC UỐNG</div>
              <div className="food-items">
                {chiTietData.data.dat_ve.don_do_an.map((item:any) => (
                  <div key={item.id} className="food-item">
                    <span className="food-name">{item.do_an.ten_do_an}</span>
                    <span className="food-qty">x{item.so_luong}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="total-section">
            <div className="total-label">TỔNG TIỀN</div>
            <div className="total-amount">
              {Number(chiTietData.data?.dat_ve?.tong_tien).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="qr-section">
          <div className="qr-label">SCAN TO ENTER</div>
          <div className="qr-code">
            <Image
              src={chiTietData.data.qr_code}
              alt="QR Code"
              width={120}
              height={120}
              preview={true}
              className="qr-image"
            />
          </div>
          <div className="qr-instruction">
            Quét mã QR tại cửa vào
          </div>
        </div>
      </div>

      {/* Ticket Footer */}
      <div className="ticket-footer">
        <div className="footer-text">
          Vui lòng đến trước giờ chiếu 15 phút • Giữ vé để kiểm tra
        </div>
        <div className="ticket-serial">
          TICKET-{selectedId}-{moment().format("YYYYMMDD")}
        </div>
      </div>
    </div>
  ) : (
    <div className="error-state">
      <Empty description="Không thể tải thông tin chi tiết vé" />
    </div>
  )}

  <style>{`
    .ticket-modal .ant-modal-content {
      padding: 0;
      border-radius: 0;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .movie-ticket {
      background: #f8f9fa;
      font-family: 'Courier New', monospace;
      position: relative;
      max-width: 100%;
    }

    /* Header Section */
    .ticket-header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      display: flex;
      min-height: 80px;
    }

    .ticket-stub {
      background: #000;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .ticket-stub::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background: #f8f9fa;
      border-radius: 50%;
      z-index: 2;
    }

    .stub-content {
      text-align: center;
      color: white;
    }

    .ticket-number {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .admit-text {
      font-size: 10px;
      letter-spacing: 1px;
      opacity: 0.8;
    }

    .ticket-main-header {
      flex: 1;
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .cinema-name {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 8px 0;
      letter-spacing: 1px;
    }

    .ticket-type {
      font-size: 12px;
      letter-spacing: 2px;
      opacity: 0.8;
    }

    /* Perforation */
    .perforation {
      height: 2px;
      background: repeating-linear-gradient(
        to right,
        #ddd 0px,
        #ddd 10px,
        transparent 10px,
        transparent 20px
      );
      position: relative;
    }

    .perforation::before {
      content: '';
      position: absolute;
      left: 110px;
      top: -8px;
      width: 16px;
      height: 16px;
      background: #f8f9fa;
      border-radius: 50%;
      border: 2px solid #ddd;
    }

    .perforation::after {
      content: '';
      position: absolute;
      left: 110px;
      bottom: -8px;
      width: 16px;
      height: 16px;
      background: #f8f9fa;
      border-radius: 50%;
      border: 2px solid #ddd;
    }

    /* Ticket Body */
    .ticket-body {
      background: white;
      padding: 30px;
      display: flex;
      gap: 30px;
    }

    .ticket-main-info {
      flex: 2;
    }

    .movie-title-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px dashed #ddd;
    }

    .movie-title {
      font-size: 26px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      line-height: 1.3;
      font-family: 'Arial', sans-serif;
    }

    .duration {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .ticket-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .detail-item {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }

    .detail-label {
      font-size: 11px;
      font-weight: bold;
      color: #666;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .detail-value {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
    }

    .room-number {
      color: #007bff;
    }

    .seats-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .seat-number {
      background: #1a1a1a;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
    }

    .food-section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 12px;
      font-weight: bold;
      color: #666;
      letter-spacing: 1px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .food-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .food-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #fff3cd;
      border-radius: 4px;
      border-left: 3px solid #ffc107;
    }

    .food-name {
      font-weight: 500;
      color: #1a1a1a;
    }

    .food-qty {
      background: #ffc107;
      color: #1a1a1a;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    .total-section {
      background: #1a1a1a;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }

    .total-label {
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 8px;
      opacity: 0.8;
    }

    .total-amount {
      font-size: 24px;
      font-weight: bold;
    }

    /* QR Section */
    .qr-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 2px dashed #ddd;
    }

    .qr-label {
      font-size: 11px;
      font-weight: bold;
      color: #666;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }

    .qr-code {
      margin-bottom: 15px;
    }

    .qr-image {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .qr-instruction {
      font-size: 11px;
      color: #666;
      text-align: center;
      letter-spacing: 0.5px;
    }

    /* Ticket Footer */
    .ticket-footer {
      background: #1a1a1a;
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }

    .footer-text {
      opacity: 0.8;
    }

    .ticket-serial {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      letter-spacing: 1px;
    }

    /* Loading & Error States */
    .loading-container {
      padding: 80px 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-text {
      color: #666;
      font-size: 16px;
    }

    .error-state {
      padding: 80px 0;
      text-align: center;
    }

    /* Ticket Styling Effects */
    .movie-ticket {
      background: white;
      position: relative;
      box-shadow: 
        0 0 0 1px #ddd,
        0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .movie-ticket::before {
      content: '';
      position: absolute;
      left: 110px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: repeating-linear-gradient(
        to bottom,
        #ddd 0px,
        #ddd 8px,
        transparent 8px,
        transparent 16px
      );
      z-index: 1;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .ticket-header {
        flex-direction: column;
      }
      
      .ticket-stub {
        width: 100%;
        height: 60px;
      }
      
      .ticket-stub::after {
        display: none;
      }
      
      .movie-ticket::before {
        display: none;
      }
      
      .ticket-body {
        flex-direction: column;
        gap: 20px;
      }
      
      .ticket-details-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .ticket-footer {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
    }

    /* Print Styling */
    @media print {
      .movie-ticket {
        box-shadow: none;
        border: 2px solid #000;
      }
      
      .ticket-header,
      .ticket-footer {
        background: #000 !important;
        color: white !important;
      }
    }
  `}</style>
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