import React from "react";
import { Carousel, Row, Col, Button, Typography, Input } from "antd";
import "./Home.css";

const { Title } = Typography;

const Home = () => {
  const currentMovies = [
    {
      title: "Thanh Gươm Diệt Quỷ",
      date: "31.12.2025",
      image: "https://media.lottecinemavn.com/Media/MovieFile/MovieImg/202401/11379_103_100001.jpg",
    },
    {
      title: "Lật mặt 8",
      date: "28.11.2025",
      image: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/l/m/lm8_-_470x700.jpg",
    },
    {
      title: "Biệt đội sấm sét",
      date: "20.11.2025",
      image: "https://upload.wikimedia.org/wikipedia/vi/9/90/Thunderbolts%2A_poster.jpg",
    },
    {
      title: "Thám tử kiên",
      date: "10.10.2025",
      image: "https://cdn.galaxycine.vn/media/2025/4/28/tham-tu-kien-2_1745832748529.jpg",
    },
  ];

  const upcomingMovies = [
    {
      title: "Đào phở piano",
      image: "https://simg.zalopay.com.vn/zlp-website/assets/phim_viet_nam_chieu_rap_9_e81a0cb05d.jpg",
    },
    {
      title: "Nhà gia tiên",
      image: "https://cinema.momocdn.net/img/17174455224600722-NHAGIATIENSNEAK.jpg?size=M",
    },
    {
      title: "Doraemon",
      image: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/thumbnail/190x260/2e2b8cd282892c71872b9e67d2cb5039/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg",
    },
    {
      title: "Làm giàu ma",
      image: "https://simg.zalopay.com.vn/zlp-website/assets/phim_viet_nam_chieu_rap_hay_1_1656a985dc.jpg",
    },
  ];

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
          {currentMovies.map((movie, i) => (
            <Col span={6} key={i}>
              <div className="movie-card">
                <img src={movie.image} alt={movie.title} />
                <h4>{movie.title}</h4>
                <p>Ngày chiếu: {movie.date}</p>
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
          {upcomingMovies.map((movie, i) => (
            <Col span={6} key={i}>
              <div className="movie-card">
                <img src={movie.image} alt={movie.title} />
                <h4>{movie.title}</h4>
                <Button type="primary">Xem chi tiết</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      {/* Phim nổi bật */}
<div className="featured-movie">
  <img
    src="https://static.zenmarket.jp/images/common-landing-pages/ropevl21.tr4"
    alt="phim nổi bật"
    className="featured-img"
  />
  <div className="featured-overlay">
    <div className="featured-content">
      <Title level={2}>Phim Nổi Bật: Thanh Gươm Diệt Quỷ</Title>
      <p>Trải nghiệm hành trình tiêu diệt quỷ chưa từng có trên màn ảnh rộng.</p>
      <Button type="primary" size="large">Đặt vé ngay</Button>
    </div>
  </div>
</div>

{/* Thông tin liên hệ */}
<div className="contact-section">
  <div className="contact-left">
    <p>Liên hệ với chúng tôi</p>
    <div className="social-icon">
      <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="facebook" />
      <span>FACEBOOK</span>
    </div>
    <div className="social-icon">
      <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="instagram" />
      <span>INSTAGRAM</span>
    </div>
  </div>

  <div className="contact-right">
    <Title level={5}>Thông tin liên hệ</Title>
    <p>📧 cskh@movigo.com</p>
    <p>📞 1900.0085</p>
    <p>📍 135 Hai Bà Trưng, Thành phố Hồ Chí Minh</p>

    <Input placeholder="Họ và tên ..." style={{ marginBottom: 12 }} />
    <Input placeholder="Email ..." style={{ marginBottom: 12 }} />
    <Input.TextArea placeholder="Thông tin liên hệ" rows={3} style={{ marginBottom: 12 }} />
    <Button type="primary" style={{ backgroundColor: "yellow", color: "black" }}>
      GỬI NGAY
    </Button>
  </div>
</div>

   
    </div>
  );
};

export default Home;
