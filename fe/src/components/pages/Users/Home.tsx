import React, { useEffect, useState } from "react";
import { Carousel, Row, Col, Button, Typography, Spin, message } from "antd";
import axios from "axios";
import "./Home.css";

const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState({
    phim_dang_chieu: [],
    phim_sap_chieu: [],
    phim_dac_biet: []
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/home");
        setMovies(res.data);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu phim");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Banner */}
      <Carousel autoplay>
        <div>
          <img
            src="https://1900.com.vn/storage/uploads/companies/banner/2960/449205422-456847240544421-5147111165711126657-n-1720805927.jpg"
            alt="banner"
            className="banner-img"
          />
        </div>
        <div>
          <img
            src="https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FBanner%2F0018728.png&w=3840&q=75"
            alt="banner"
            className="banner-img"
          />
        </div>
      </Carousel>

      {/* Phim đang chiếu */}
      <div className="section">
        <Title level={3}>Phim đang chiếu</Title>
        <Row gutter={24}>
          {movies.phim_dang_chieu.length === 0 && <p>Hiện chưa có phim đang chiếu.</p>}
          {movies.phim_dang_chieu.map((movie) => (
            <Col span={6} key={movie.id}>
              <div className="movie-card">
                <img
                  src={movie.anh_poster || "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={movie.ten_phim}
                />
                <h4>{movie.ten_phim}</h4>
                <p>Ngày công chiếu: {movie.ngay_cong_chieu}</p>
                <Button type="primary">Mua vé</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Phim sắp chiếu */}
      <div className="section">
        <Title level={3}>Phim sắp chiếu</Title>
        <Row gutter={24}>
          {movies.phim_sap_chieu.length === 0 && <p>Hiện chưa có phim sắp chiếu.</p>}
          {movies.phim_sap_chieu.map((movie) => (
            <Col span={6} key={movie.id}>
              <div className="movie-card">
                <img
                  src={movie.anh_poster || "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={movie.ten_phim}
                />
                <h4>{movie.ten_phim}</h4>
                <p>Ngày công chiếu: {movie.ngay_cong_chieu}</p>
                <Button type="primary">Xem chi tiết</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Phim đặc biệt */}
      <div className="section">
        <Title level={3}>Phim đặc biệt</Title>
        <Row gutter={24}>
          {movies.phim_dac_biet.length === 0 && <p>Hiện chưa có phim đặc biệt.</p>}
          {movies.phim_dac_biet.map((movie) => (
            <Col span={6} key={movie.id}>
              <div className="movie-card">
                <img
                  src={movie.anh_poster || "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={movie.ten_phim}
                />
                <h4>{movie.ten_phim}</h4>
                <p>Ngày công chiếu: {movie.ngay_cong_chieu}</p>
                <Button type="primary">Chi tiết</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
