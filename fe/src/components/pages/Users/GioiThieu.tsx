
import { Row, Col, Typography, Image, Spin, Card } from "antd";
import "../../assets/css/news.css";
import Banner from "../../../assets/Screenshot 2025-06-16 112804.png";
import Map from "../../../assets/Screenshot 2025-06-16 114450.png";
import { useListCinemas } from "../../hook/hungHook";
import { EnvironmentOutlined } from "@ant-design/icons";

const GioiThieu = () => {
  const {
    data: rapListRaw,
    isLoading,
    error,
  } = useListCinemas({ resource: "rap" });

  const rapList = Array.isArray(rapListRaw)
    ? rapListRaw
    : rapListRaw?.data || [];

  return (
    <div className="news-wrapper">
      {/* Banner */}
      <div className="news-hero">
        <Image
          preview={false}
          src={Banner}
          alt="Cinestar Hero"
          className="news-hero-img"
        />
      </div>

      {/* Mission Section */}
      <div className="news-mission-section">
        <Typography.Title level={2} className="news-mission-title">
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
      <div className="news-location-section">
        <Typography.Title level={2} className="news-location-title">
          TRỤ SỞ CỦA CHÚNG TÔI
        </Typography.Title>
        <Typography.Paragraph className="news-location-desc">
          Các phòng chiếu được trang bị các thiết bị tiên tiến như hệ thống âm
          thanh vòm, màn hình rộng và độ phân giải cao, tạo nên hình ảnh sắc nét
          và âm thanh sống động.
        </Typography.Paragraph>
        <div className="news-location-box">
          <img
            src={Map}
            alt="Cinestar Location"
            className="news-location-img"
          />
        </div>
      </div>

      {/* Địa chỉ rạp */}
      <div className="news-location-section" style={{ marginTop: 40 }}>
        <Typography.Title
          level={2}
          style={{ textAlign: "center", marginBottom: 32, color: "white" }}
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

              // Tạo URL tìm kiếm Google Maps từ địa chỉ
              const mapUrl = hasValidDiaChi
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    diaChi
                  )}`
                : null;

              return (
                <Col xs={24} sm={12} md={8} key={rap.id}>
                  <Card
                    className="mission-card"
                    hoverable={!!mapUrl}
                    style={{
                      height: "100%",
                      textAlign: "center",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgb(0 0 0 / 8%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "none",
                      cursor: mapUrl ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (mapUrl) {
                        window.open(mapUrl, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    <Typography.Title
                      level={4}
                      style={{ marginBottom: 12, color: "white" }}
                    >
                      {rap.ten_rap}
                    </Typography.Title>
                    <div
                      style={{
                        color: "black",
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {hasValidDiaChi ? (
                        <>
                          <EnvironmentOutlined
                            style={{
                              color: "#fa541c" /* cam đỏ nổi bật */,
                              fontSize: 18,
                            }}
                          />
                          <span>{diaChi}</span>
                        </>
                      ) : (
                        "Đang cập nhật"
                      )}
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
