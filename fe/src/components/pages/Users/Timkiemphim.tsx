import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Spin, Card, Row, Col, Typography, Button } from "antd";
import { searchPhim } from "../../provider/duProvider";
import "./Home.css";

const { Title } = Typography;
const BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "https://via.placeholder.com/220x280?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/storage/${path}`;
};

const TimKiemPhim = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestParams: any = {};

    for (const [key, value] of params.entries()) {
      if (key === "the_loai_id") {
        if (!requestParams["the_loai_id"]) requestParams["the_loai_id"] = [];
        requestParams["the_loai_id"].push(value);
      } else {
        requestParams[key] = value;
      }
    }

    setLoading(true);
    searchPhim(requestParams)
      .then((res) => {
        setResults(res.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tìm kiếm phim", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <div className="search-page">
      {loading ? (
        <Spin />
      ) : results.length === 0 ? (
        <p>Không tìm thấy phim phù hợp.</p>
      ) : (
        <Row gutter={[24, 24]}>
          {results.map((phim) => (
            <Col xs={24} sm={12} md={8} lg={6} key={phim.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={phim.ten_phim}
                    src={getImageUrl(phim.anh_poster)}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/220x280?text=No+Image";
                    }}
                    className="poster-image"
                  />
                }
              >
                <Title level={4}>{phim.ten_phim || "Không có tên phim"}</Title>
                <div dangerouslySetInnerHTML={{ __html: phim.mo_ta }} />
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

export default TimKiemPhim;
