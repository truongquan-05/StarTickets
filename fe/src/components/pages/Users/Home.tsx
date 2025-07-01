import { useEffect, useState } from "react";
import { Button, Typography, Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import moment from "moment";
import { getCurrentMovies, getUpcomingMovies } from "../../provider/duProvider";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css";
import QuickBooking from "../CinemasPage/QuickBooking";

const { Title } = Typography;
const BASE_URL = "http://127.0.0.1:8000";

// Hàm xử lý ảnh
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/220x280?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/storage/${path}`;
};

const Home = () => {
  const [currentMovies, setCurrentMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [current, upcoming] = await Promise.all([
          getCurrentMovies(),
          getUpcomingMovies(),
        ]);
         console.log("Phim đang chiếu:", current);
      console.log("Phim sắp chiếu:", upcoming);
        setCurrentMovies(current);
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-wrapper">
      
      {/* Banner bằng Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000 }}
        className="banner-swiper"
      >
        <SwiperSlide>
          <div className="banner-wrapper">
            <img
              src="https://1900.com.vn/storage/uploads/companies/banner/2960/449205422-456847240544421-5147111165711126657-n-1720805927.jpg"
              alt="banner"
              className="banner-img"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="banner-wrapper">
            <img
              src="https://chieuphimquocgia.com.vn/_next/image?url=http%3A%2F%2Fapiv2.chieuphimquocgia.com.vn%2FContent%2FImages%2FBanner%2F0018728.png&w=3840&q=75"
              alt="banner"
              className="banner-img"
            />
          </div>
        </SwiperSlide>
      </Swiper>
  <QuickBooking />
      {/* Phim đang chiếu */}
      <div className="section">
        <Title level={3}>Phim đang chiếu</Title>
        {loading ? (
          <Spin />
        ) : Array.isArray(currentMovies) && currentMovies.length > 0 ? (
          <Swiper
            spaceBetween={24}
            slidesPerView={5}
            navigation
            modules={[Navigation]}
          >
            {currentMovies.map((movie: any, i: number) => (
              <SwiperSlide key={i}>
                <div className="movie-card">
                  <Link to={`/phim/${movie.slug || movie.id}`}>
                    <img
                      src={getImageUrl(
                        movie.hinh_anh || movie.image || movie.anh_poster
                      )}
                      alt={movie.title || movie.ten_phim}
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/220x280?text=No+Image";
                      }}
                    />
                  </Link>
                  <h4>{movie.title || movie.ten_phim}</h4>
                  <p style={{ fontSize: 12, color: "#888", marginTop: 0 }}>
                    Ngày chiếu:{" "}
                    {movie.ngay_cong_chieu
                      ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
                      : "Chưa cập nhật"}
                  </p>
                  <Link to={`/phim/${movie.slug || movie.id}`}>
                    <Button type="primary">Mua vé</Button>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>Không có phim đang chiếu.</p>
        )}
      </div>

      {/* Phim sắp chiếu */}
      <div className="section">
        <Title level={3}>Phim sắp chiếu</Title>
        {loading ? (
          <Spin />
        ) : Array.isArray(upcomingMovies) && upcomingMovies.length > 0 ? (
          <Swiper
            spaceBetween={24}
            slidesPerView={5}
            navigation
            modules={[Navigation]}
          >
            {upcomingMovies.map((movie: any, i: number) => (
              <SwiperSlide key={i}>
                <div className="movie-card">
                  <Link to={`/phim/${movie.slug || movie.id}`}>
                    <img
                      src={getImageUrl(
                        movie.image || movie.hinh_anh || movie.anh_poster
                      )}
                      alt={movie.title || movie.ten_phim}
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/220x280?text=No+Image";
                      }}
                    />
                  </Link>
                  <h4>{movie.title || movie.ten_phim}</h4>
                  <p style={{ fontSize: 12, color: "#888", marginTop: 0 }}>
                    Ngày chiếu:{" "}
                    {movie.ngay_cong_chieu
                      ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
                      : "Chưa cập nhật"}
                  </p>
                  <Link to={`/phim/${movie.slug || movie.id}`}>
                    <Button type="primary">Xem chi tiết</Button>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>Không có phim sắp chiếu.</p>
        )}
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
            <p>
              Trải nghiệm hành trình tiêu diệt quỷ chưa từng có trên màn ảnh
              rộng.
            </p>
            <Button type="primary" size="large">
              Đặt vé ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="contact-section">
        <div className="contact-left">
          <p>LIÊN HỆ VỚI CHÚNG TÔI</p>
          <div className="social-icon fb-icon">
            <a href="https://www.facebook.com/hthinh575"><img
              src="https://cinestar.com.vn/assets/images/ct-1.webp"
              alt="facebook"
            />
            <span>FACEBOOK</span></a>
          </div>
          <div className="social-icon zl-icon">
            <a href="#">
              <span>ZALO CHAT</span>
            <img
              src="	https://cinestar.com.vn/assets/images/ct-2.webp"
              alt="ZALO CHAT"
            /></a>   
          </div>
        </div>

        <div className="contact-right">
          <h2>THÔNG TIN LIÊN HỆ</h2>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-1.svg" alt="" />{" "}
            cskh@movigo.com
          </p>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-2.svg" alt="" />{" "}
            1900.0085
          </p>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-3.svg" alt="" />{" "}
            135 Hai Bà Trưng, phường Bến Nghé, Quận 1, TP.HCM
          </p>
          <input type="text" placeholder="Họ và tên" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Thông tin liên hệ hoặc phản ánh" rows={10}></textarea>
          <button className="contact-btn"><span>Gửi ngay</span></button>

        </div>
      </div>
    </div>
  );
};

export default Home;
