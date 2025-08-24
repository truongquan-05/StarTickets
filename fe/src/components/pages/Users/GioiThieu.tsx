import { Row, Col, Typography, Image, Spin, Card } from "antd";
import './GioiThieu.css';
import Banner from "../../../assets/Screenshot 2025-06-16 112804.png";
import { useListCinemas } from "../../hook/hungHook";
import { EnvironmentOutlined, ExportOutlined } from "@ant-design/icons";

const GioiThieu = () => {
  const {
    data: rapListRaw,
    isLoading,
    error,
  } = useListCinemas({ resource: "client/rap" });

  const rapList = Array.isArray(rapListRaw)
    ? rapListRaw
    : rapListRaw?.data || [];

  // Google Maps embed URL - thay đổi địa chỉ theo trụ sở thực tế của bạn
  const companyAddress = "123 Đường ABC, Quận 1, TP.HCM"; // Thay bằng địa chỉ thực
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(companyAddress)}`;
  
  // Hoặc sử dụng iframe embed không cần API key (có giới hạn)
  const googleMapsEmbedUrlNoAPI = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.494877044481!2d106.69831731533476!3d10.772481592324147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4a1c3c4b5b%3A0x12345678!2sTP.+H%E1%BB%93+Ch%C3%AD+Minh%2C+Vietnam!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s`;

  return (
    <div className="about-wrapper">
      {/* Banner */}
      <div className="about-hero">
        <Image
          preview={false}
          src={Banner}
          alt="Cinestar Hero"
          className="about-hero-img"
        />
      </div>

      {/* Mission Section */}
      <div className="about-mission-section">
        <Typography.Title level={2} className="about-mission-title">
          SỨ MỆNH
        </Typography.Title>
        <Row gutter={[24, 24]} justify="center">
          {[
            {
              number: "01",
              text: "Góp phần tăng trưởng thị phần điện ảnh, văn hóa, giải trí của người Việt Nam",
            },
            {
              number: "02",
              text: "Phát triển dịch vụ xuất sắc với mức giá tối ưu, phù hợp với thu nhập người Việt Nam.",
            },
            {
              number: "03",
              text: "Mang nghệ thuật điện ảnh, văn hóa Việt Nam hội nhập quốc tế.",
            },
          ].map((item, index) => (
            <Col xs={24} md={8} key={index}>
              <div className="mission-card">
                <div className="mission-number">{item.number}</div>
                <div className="mission-text">{item.text}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Our Location */}
      <div className="about-location-section">
        <Typography.Title level={2} className="about-location-title">
          TRỤ SỞ CỦA CHÚNG TÔI
        </Typography.Title>
        <Typography.Paragraph className="about-location-desc">
          Các phòng chiếu được trang bị các thiết bị tiên tiến như hệ thống âm
          thanh vòm, màn hình rộng và độ phân giải cao, tạo nên hình ảnh sắc nét
          và âm thanh sống động.
        </Typography.Paragraph>
        
        {/* Google Maps Embedded */}
        <div className="about-map-container">
          <iframe
            className="about-map-iframe"
            src={googleMapsEmbedUrlNoAPI}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Trụ sở Cinestar"
          ></iframe>
        </div>
      </div>

      {/* Địa chỉ rạp */}
      <div className="about-location-section2" style={{ marginTop: 40 }}>
        <Typography.Title
          level={1}
          style={{ textAlign: "center", marginBottom: 32, color: "white", fontFamily: "'Anton", fontWeight: "100" }}
        >
          HỆ THỐNG RẠP CHIẾU
        </Typography.Title>

        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>
            Lỗi tải dữ liệu rạp
          </p>
        ) : (
          <Row gutter={[24, 24]}>
            {rapList.map((rap: any) => {
              const diaChi = rap.dia_chi?.trim();
              const hasValidDiaChi = diaChi && diaChi.length > 0;

              // Tạo URL nhúng Google Maps cho từng rạp
              const rapMapUrl = hasValidDiaChi
                ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(diaChi)}`
                : null;
              
              // Hoặc URL tìm kiếm để mở tab mới
              const mapSearchUrl = hasValidDiaChi
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(diaChi)}`
                : null;

              return (
                <Col xs={24} sm={12} md={8} key={rap.id}>
                  <Card
                    className="cinema-card"
                    hoverable={!!mapSearchUrl}
                    style={{
                      height: "100%",
                      textAlign: "center",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgb(0 0 0 / 8%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "none",
                      cursor: mapSearchUrl ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (mapSearchUrl) {
                        window.open(mapSearchUrl, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    <Typography.Title
                      level={4}
                      style={{ marginBottom: 12, color: "yellow", fontFamily: "'Alata'", fontWeight: "100" }}
                    >
                      {rap.ten_rap}
                    </Typography.Title>
                    <div className="cinema-address">
                      {hasValidDiaChi ? (
                        <>
                          <EnvironmentOutlined />
                          <span>{diaChi}</span>
                        </>
                      ) : (
                        "Đang cập nhật"
                      )}
                    </div>
                    <div className="cinema-address">
                      <p><ExportOutlined style={{marginRight: "8px"}}/>CHỈ ĐƯỜNG</p>
                    </div>
                    
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
};

export default GioiThieu;