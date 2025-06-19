import React from "react";
import { useParams } from "react-router-dom";
import { useDetailTinTuc } from "../../../hook/hungHook";
import { Spin, Empty, Typography, Image, Row, Col, Divider } from "antd";
import "../../../assets/css/tintucchitiet.css";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://127.0.0.1:8000";

const NewsDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useDetailTinTuc({ id: Number(id), resource: "tin_tuc" });

  if (isLoading) return <Spin tip="Đang tải chi tiết..." className="news-detail-spin" />;
  if (isError || !data || Object.keys(data).length === 0)
    return <Empty description="Không tìm thấy tin tức." className="news-detail-empty" />;

  return (
    <div className="news-detail-wrapper">
      <Row gutter={8}>
        <Col xs={12} md={12}>
          <Image
            src={`${BASE_URL}${data.hinh_anh}`}
            alt={data.tieu_de}
            className="news-detail-image"
            fallback="https://via.placeholder.com/600x400?text=No+Image"
            preview={false}
          />
        </Col>
        <Col xs={12} md={12}>
          <Title level={2} className="news-detail-title" style={{color:"white"}}>{data.tieu_de}</Title>
          <Divider className="news-detail-divider" />
          <Paragraph className="news-detail-content">{data.noi_dung}</Paragraph>
        </Col>
      </Row>
    </div>
  );
};

export default NewsDetail;