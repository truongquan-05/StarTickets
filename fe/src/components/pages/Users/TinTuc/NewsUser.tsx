import React from "react";
import { Card, Col, Row, Typography, Image, Spin, Empty } from "antd";
import { INews } from "../../Admin/interface/news";
import { useListNews } from "../../../hook/hungHook";
import "../../../assets/css/tintuc.css"; // Assuming you have a CSS file for styling

const { Title, Paragraph } = Typography;
const BASE_URL = "http://127.0.0.1:8000";

const NewsUser: React.FC = () => {
  const { data, isLoading, isError } = useListNews({ resource: "tin_tuc" });

  const newsList: INews[] = data?.data || [];

  if (isLoading) {
    return (
      <div className="news-wrapper">
        <Spin size="large" tip="Đang tải tin tức..." />
      </div>
    );
  }

  if (isError || newsList.length === 0) {
    return (
      <div className="news-wrapper">
        <Empty description="Không có tin tức nào" />
      </div>
    );
  }

  return (
    <div className="tintuc">
      <div className="news-wrapper">
        <h2 className="news-title">Tin tức mới từ StarTicket</h2>
        <Row gutter={[24, 24]}>
          {newsList.map((item) => (
            <Col xs={24} sm={24} md={12} lg={12} key={item.id}>
              <Card
                className="news-card"
                cover={
                  <Image
                    src={`${BASE_URL}${item.hinh_anh}`}
                    alt={item.tieu_de}
                    height={280}
                    style={{
                      objectFit: "cover",
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    }}
                    fallback="https://via.placeholder.com/400x220?text=No+Image"
                    preview={false}
                  />
                }
              >
                <Card.Meta
                  title={
                    <span className="news-card-title">{item.tieu_de}</span>
                  }
                  description={
                    <>
                      <a
                        href={`/news/${item.id}`}
                        className="news-readmore-btn"
                      >
                        <span>Xem thêm</span>
                      </a>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default NewsUser;
