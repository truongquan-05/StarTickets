import React from "react";
import { Row, Col, Typography, Card, Image, Divider, Button } from "antd";
import "../../assets/css/news.css";
import Banner from "../../../assets/Screenshot 2025-06-16 112804.png";
import Map from "../../../assets/Screenshot 2025-06-16 114450.png";

const GioiThieu = () => (
  <div className="news-wrapper">
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
        <img src={Map} alt="Cinestar Location" className="news-location-img" />
      </div>
    </div>
  </div>
);

export default GioiThieu;
