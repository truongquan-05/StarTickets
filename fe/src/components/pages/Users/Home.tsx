import { useEffect, useState } from "react";
import { Button, Spin, Modal } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import moment from "moment";
import featuredImage from "../../../assets/image.png";
import { getCurrentMovies, getUpcomingMovies } from "../../provider/duProvider";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css";
import QuickBooking from "../CinemasPage/QuickBooking";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  TagOutlined,
  StarOutlined,
} from "@ant-design/icons";
import ContactForm from "./PhanHoiKhachHang";
import HomeBanner from "../Admin/Banner/HomeBanner";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/220x280?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/storage/${path}`;
};

const convertYouTubeUrlToEmbed = (url: string): string => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

const Home = () => {
  const [currentMovies, setCurrentMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [specialMovies, setSpecialMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"now" | "upcoming" | "special">(
    "now"
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [trailerTitle, setTrailerTitle] = useState("");

  const handleShowTrailer = (url: string, title: string) => {
    setTrailerUrl(url);
    setTrailerTitle(title);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTrailerUrl("");
  };

  // Hàm lọc phim đặc biệt dựa trên loai_suat_chieu
  const filterSpecialMovies = (movies: any[]) => {
    return movies.filter(
      (movie) =>
        movie.loai_suat_chieu === "Đặc biệt" ||
        movie.loai_suat_chieu === "Dac biet" ||
        movie.loai_suat_chieu?.toLowerCase().includes("đặc biệt") ||
        movie.loai_suat_chieu?.toLowerCase().includes("dac biet")
    );
  };

  // Hàm lọc phim đang chiếu (ngày công chiếu <= hôm nay và ngày kết thúc >= hôm nay)
  const filterCurrentMovies = (movies: any[]) => {
    const today = moment().startOf("day");
    return movies.filter((movie) => {
      const ngayChieu = moment(movie.ngay_cong_chieu);
      const ngayKetThuc = moment(movie.ngay_ket_thuc);

      // Phim đang chiếu nếu: ngày công chiếu <= hôm nay <= ngày kết thúc
      return (
        ngayChieu.isSameOrBefore(today) &&
        ngayKetThuc.isSameOrAfter(today) &&
        movie.trang_thai_phim === "Xuất bản"
      );
    });
  };

  // Hàm lọc phim sắp chiếu (ngày công chiếu > hôm nay)
  const filterUpcomingMovies = (movies: any[]) => {
    const today = moment().startOf("day");
    return movies.filter((movie) => {
      const ngayChieu = moment(movie.ngay_cong_chieu);

      // Phim sắp chiếu nếu: ngày công chiếu > hôm nay
      return ngayChieu.isAfter(today) && movie.trang_thai_phim === "Xuất bản";
    });
  };

  // Hàm parse thể loại an toàn
  const parseGenres = (movie: any) => {
    try {
      if (movie.the_loai_id) {
        const genres = JSON.parse(movie.the_loai_id);
        if (Array.isArray(genres)) {
          return genres.map((genre: any) => genre.ten_the_loai).join(", ");
        }
      }

      if (movie.the_loai && Array.isArray(movie.the_loai)) {
        return movie.the_loai.join(", ");
      }

      return "Chưa cập nhật";
    } catch (error) {
      console.error("Error parsing genres:", error);
      return "Chưa cập nhật";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [current, upcoming] = await Promise.all([
          getCurrentMovies().then(),
          getUpcomingMovies(),
        ]);

        // Tổng hợp tất cả phim từ cả hai nguồn
        const allMovies = [...current, ...upcoming];

        // Lọc phim theo logic mới
        const filteredCurrentMovies = filterCurrentMovies(allMovies);
        const filteredUpcomingMovies = filterUpcomingMovies(allMovies);
        const filteredSpecialMovies = filterSpecialMovies(allMovies);

        setCurrentMovies(filteredCurrentMovies);
        setUpcomingMovies(filteredUpcomingMovies);
        setSpecialMovies(filteredSpecialMovies);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Biến state để lưu danh sách phim
  const [PhimDangChieu, setMovies] = useState<[]>([]);
  const [PhimSapChieu, setSapChieu] = useState<[]>([]);
  const [PhimDacBiet, setDacBiet] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API để lấy danh sách phim
  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dangChieu = await axios.get(
        "http://127.0.0.1:8000/api/home/dang-chieu"
      );
      const sapChieu = await axios.get(
        "http://127.0.0.1:8000/api/home/sap-chieu"
      );
      const dacBiet = await axios.get(
        "http://127.0.0.1:8000/api/home/dac-biet"
      );
      setMovies(dangChieu.data);
      setSapChieu(sapChieu.data);
      setDacBiet(dacBiet.data);
    } catch (error: any) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Hàm render movie card cho phim đang chiếu
  const renderCurrentMovieCard = (movie: any, index: number) => (
    <SwiperSlide key={index}>
      <div className="movie-card">
        <div className="movie-poster-wrapper">
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <img
              src={getImageUrl(
                movie.image || movie.hinh_anh || movie.anh_poster
              )}
              alt={movie.title || movie.ten_phim}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/220x280?text=No+Image";
              }}
            />
          </Link>
          <div className="movie-overlay">
            <button
              className="play-overlay-button"
              onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
            >
              <PlayCircleFilled style={{ fontSize: 70 }} />
            </button>
          </div>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
        </Link>
        <p style={{ fontSize: 12, color: "#888" }}>
          <TagOutlined style={{color: "yellow"}}/> : {parseGenres(movie)}
        </p>
        <p style={{ fontSize: 12, color: "#888" }}>
          <ClockCircleOutlined style={{color: "yellow"}}/> :{" "}
          {movie.thoi_luong ? `${movie.thoi_luong} phút` : "Chưa cập nhật"}
        </p>
        <div className="movie-buttons">
          <button
            className="play-button"
            onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
          >
            <PlayCircleOutlined style={{ marginRight: 8 }} />
            <span>Trailer</span>
          </button>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <button className="book-button">
              <span>ĐẶT VÉ NGAY</span>
            </button>
          </Link>
        </div>
      </div>
    </SwiperSlide>
  );
  // Hàm render movie card cho phim sắp chiếu
  const renderUpcomingMovieCard = (movie: any, index: number) => (
    <SwiperSlide key={index}>
      <div className="movie-card">
        <div className="movie-poster-wrapper">
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <img
              src={getImageUrl(
                movie.image || movie.hinh_anh || movie.anh_poster
              )}
              alt={movie.title || movie.ten_phim}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/220x280?text=No+Image";
              }}
            />
          </Link>
          <div className="movie-overlay">
            <button
              className="play-overlay-button"
              onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
            >
              <PlayCircleFilled style={{ fontSize: 70 }} />
            </button>
          </div>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
        </Link>
        <p style={{ fontSize: 12, color: "#888" }}>
          <CalendarOutlined style={{color: "yellow"}}/> :{" "}
          {movie.ngay_cong_chieu
            ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
            : "Chưa cập nhật"}
        </p>
        <p style={{ fontSize: 12, color: "#888" }}>
          <TagOutlined style={{color: "yellow"}}/> : {parseGenres(movie)}
        </p>
        <p style={{ fontSize: 12, color: "#888" }}>
          <ClockCircleOutlined style={{color: "yellow"}}/> :{" "}
          {movie.thoi_luong ? `${movie.thoi_luong} phút` : "Chưa cập nhật"}
        </p>
        <div className="movie-buttons">
          <button
            className="play-button"
            onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
          >
            <PlayCircleOutlined style={{ marginRight: 8 }} />
            <span>Trailer</span>
          </button>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <button className="book-button">
              <span>ĐẶT VÉ NGAY</span>
            </button>
          </Link>
        </div>
      </div>
    </SwiperSlide>
  );

  // Hàm render movie card cho suất chiếu đặc biệt
  const renderSpecialMovieCard = (movie: any, index: number) => (
    <SwiperSlide key={index}>
      <div className="movie-card special-card">
        <div className="movie-poster-wrapper">
          <div className="special-badge">
            <StarOutlined style={{ color: "#gold" }} />
            <span>ĐẶC BIỆT</span>
          </div>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <img
              src={getImageUrl(
                movie.image || movie.hinh_anh || movie.anh_poster
              )}
              alt={movie.title || movie.ten_phim}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/220x280?text=No+Image";
              }}
            />
          </Link>
          <div className="movie-overlay">
            <button
              className="play-overlay-button"
              onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
            >
              <PlayCircleFilled style={{ fontSize: 70 }} />
            </button>
          </div>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title special-title">
            {movie.title || movie.ten_phim}
          </h4>
        </Link>

        <p style={{ fontSize: 12, color: "#ff6b35", fontWeight: "bold" }}>
          <StarOutlined /> {movie.loai_suat_chieu}
        </p>

        <p style={{ fontSize: 12, color: "#888" }}>
          <CalendarOutlined /> :{" "}
          {movie.ngay_cong_chieu
            ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
            : "Chưa cập nhật"}
        </p>
        <p style={{ fontSize: 12, color: "#888" }}>
          <TagOutlined /> :{" "}
          {movie.the_loai_id
            ? JSON.parse(movie.the_loai_id)
                .map((genre: any) => genre.ten_the_loai)
                .join(", ")
            : movie.the_loai
            ? movie.the_loai.join(", ")
            : "Chưa cập nhật"}
        </p>
        <p style={{ fontSize: 12, color: "#888" }}>
          <ClockCircleOutlined /> :{" "}
          {movie.thoi_luong ? `${movie.thoi_luong}'` : "Chưa cập nhật"}
        </p>
        <div className="movie-buttons">
          <button
            className="play-button special-play-button"
            onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
          >
            <PlayCircleOutlined style={{ marginRight: 8 }} />
            <span>Trailer</span>
          </button>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <button className="book-button special-book-button">
              <span>ĐẶT VÉ NGAY</span>
            </button>
          </Link>
        </div>
      </div>
    </SwiperSlide>
  );

  // Hàm render nội dung theo tab
  const renderTabContent = () => {
    if (loading) {
      return <Spin />;
    }

    switch (activeTab) {
      case "now":
        return Array.isArray(PhimDangChieu) && PhimDangChieu.length > 0 ? (
          <>
            <Swiper
              spaceBetween={24}
              slidesPerView={4}
              navigation
              modules={[Navigation]}
            >
              {PhimDangChieu.map((movie: any, i: number) =>
                renderCurrentMovieCard(movie, i)
              )}
            </Swiper>
            <div className="loadmorebox">
              <Link to="/phim-dang-chieu">
                <button className="load-more-button">
                  <span>Xem tất cả</span>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Không có phim đang chiếu.</p>
        );

      case "upcoming":
        return Array.isArray(PhimSapChieu) && PhimSapChieu.length > 0 ? (
          <>
            <Swiper
              spaceBetween={24}
              slidesPerView={4}
              navigation
              modules={[Navigation]}
            >
              {PhimSapChieu.map((movie: any, i: number) =>
                renderUpcomingMovieCard(movie, i)
              )}
            </Swiper>
            <div className="loadmorebox">
              <Link to="/phim-sap-chieu">
                <button className="load-more-button">
                  <span>Xem tất cả</span>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Không có phim sắp chiếu.</p>
        );

      case "special":
        return Array.isArray(PhimDacBiet) && PhimDacBiet.length > 0 ? (
          <>
            <Swiper
              spaceBetween={24}
              slidesPerView={4}
              navigation
              modules={[Navigation]}
            >
              {PhimDacBiet.map((movie: any, i: number) =>
                renderSpecialMovieCard(movie, i)
              )}
            </Swiper>
            <div className="loadmorebox">
              <Link to="/suat-chieu-dac-biet">
                <button className="load-more-button">
                  <span>Xem tất cả</span>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Không có suất chiếu đặc biệt.</p>
        );

      default:
        return <p>Không tìm thấy nội dung.</p>;
    }
  };

  return (
    <div className="home-wrapper">
      <HomeBanner />

      <QuickBooking />

      <div className="movie-tabs">
        <button
          className={`tab-btn ${activeTab === "now" ? "active" : ""}`}
          onClick={() => setActiveTab("now")}
        >
          PHIM ĐANG CHIẾU
        </button>
        <button
          className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          PHIM SẮP CHIẾU
        </button>
        <button
          className={`tab-btn ${activeTab === "special" ? "active" : ""}`}
          onClick={() => setActiveTab("special")}
        >
          SUẤT CHIẾU ĐẶC BIỆT
        </button>
      </div>

      <div className="section">{renderTabContent()}</div>

      <Modal
        title={`Trailer - ${trailerTitle}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        bodyStyle={{ padding: 0, height: 450 }}
        destroyOnClose
        centered
        style={{
          fontFamily: "Anton, sans-serif",
          fontWeight: 100,
          fontSize: 50,
          borderRadius: 4,
        }}
      >
        {trailerUrl ? (
          <iframe
            width="100%"
            height="100%"
            src={convertYouTubeUrlToEmbed(trailerUrl)}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p style={{ padding: 20, textAlign: "center" }}>Không có trailer</p>
        )}
      </Modal>

      <div className="featured-movie">
        <img src={featuredImage} alt="phim nổi bật" className="featured-img" />
        <div className="featured-overlay">
          <div className="featured-content">
            <h2>Bạn chưa có tài khoản ?</h2>
            <p>
              Hãy đăng ký ngay để trải nghiệm những bộ phim mới nhất và nhận
              nhiều ưu đãi hấp dẫn từ StarTickets!
            </p>
            <button className="featured-button">
              <a href="/register">Đăng ký ngay</a>
            </button>
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="contact-section">
        <div className="contact-left">
          <p>LIÊN HỆ VỚI CHÚNG TÔI</p>
          <div className="social-icon fb-icon">
            <a href="https://www.facebook.com/hthinh575">
              <img
                src="https://cinestar.com.vn/assets/images/ct-1.webp"
                alt="facebook"
              />
              <span>FACEBOOK</span>
            </a>
          </div>
          <div className="social-icon zl-icon">
            <a href="#">
              <span>ZALO CHAT</span>
              <img
                src="https://cinestar.com.vn/assets/images/ct-2.webp"
                alt="ZALO CHAT"
              />
            </a>
          </div>
        </div>

        <div className="contact-right">
          <h2>THÔNG TIN LIÊN HỆ</h2>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-1.svg" alt="" />
            cskh@movigo.com
          </p>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-2.svg" alt="" />
            1900.0085
          </p>
          <p>
            <img src="https://cinestar.com.vn/assets/images/ct-3.svg" alt="" />
            135 Hai Bà Trưng, phường Bến Nghé, Quận 1, TP.HCM
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
