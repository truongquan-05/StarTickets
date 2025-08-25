import React from "react";
import { useParams } from "react-router-dom";
import { useDetailTinTuc } from "../../../hook/hungHook";
import { Spin, Empty, Typography, Image, Row, Col, Divider } from "antd";
import "../../../assets/css/tintucchitiet.css";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://127.0.0.1:8000";

const NewsDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useDetailTinTuc({
    id: Number(id),
    resource: "client-tin-tuc",
  });

  if (isLoading)
    return <Spin tip="Đang tải chi tiết..." className="news-detail-spin" />;
  if (isError || !data || Object.keys(data).length === 0)
    return (
      <Empty
        description="Không tìm thấy tin tức."
        className="news-detail-empty"
      />
    );

  return (
    <div className="tintucchitiet">
      <div className="news-detail-wrapper">
        <Row gutter={8}>
          <Col xs={10} md={10}>
            <div style={{ position: "sticky", top: "130px" }}>
              <Image
              src={`${BASE_URL}/storage/${data.hinh_anh}`}
              alt={data.tieu_de}
              className="news-detail-image"
              fallback="https://via.placeholder.com/600x400?text=No+Image"
              preview={false}
            />
            </div>
          </Col>
          <Col xs={14} md={14} style={{ paddingLeft: "20px" }}>
            <h3 className="news-detail-title" style={{ color: "yellow" }}>
              {data.tieu_de}
            </h3>

            <Divider className="news-detail-divider" />
            <p dangerouslySetInnerHTML={{ __html: data.noi_dung }} className="news-detail-content"></p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NewsDetail;
