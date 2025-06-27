import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Spin, Card, Row, Col, Typography, Button } from "antd";
import axios from "axios";
import "./Home.css"; // tạo thêm CSS riêng

const { Title, Paragraph } = Typography;

const SearchPage = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get("keyword");

    if (keyword) {
      setLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/search?keyword=${keyword}`)
        .then((res) => {
          if (res.data.data) {
            setResults(res.data.data);
          } else {
            setResults(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }
  }, [location.search]);

  return (
    <div className="search-page">
      {loading ? (
        <Spin />
      ) : results.length === 0 ? (
        <p>Không tìm thấy kết quả nào phù hợp.</p>
      ) : (
        <Row gutter={[24, 24]}>
          {results.map((phim) => (
            <Col xs={24} sm={12} md={8} lg={6} key={phim.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={phim.ten_phim}
                    src={`http://127.0.0.1:8000/storage/${phim.anh_poster}`}
                    className="poster-image"
                  />
                }
              >
                <Title level={4}>{phim.ten_phim}</Title>
                <Paragraph ellipsis={{ rows: 2 }}>{phim.mo_ta}</Paragraph>
                <Link to={`/chi-tiet-phim/${phim.id}`}>
                  <Button type="primary" block>
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SearchPage;
