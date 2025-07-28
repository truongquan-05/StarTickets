import { useEffect, useState } from "react";
import { Spin, Modal, Empty } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
  TagOutlined,
  CommentOutlined,
  PlayCircleTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import customImage from "./../../assets/img/404.png";

const BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/storage/${path}`;
};

const convertYouTubeUrlToEmbed = (url: string): string => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

const DatVeNgay = () => {
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
                e.currentTarget.onerror = null;
                e.currentTarget.src = ""; // Không đặt ảnh thay thế
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.display = "flex";
                e.currentTarget.style.alignItems = "center";
                e.currentTarget.style.justifyContent = "center";
                e.currentTarget.style.fontSize = "14px";
                e.currentTarget.alt = "Loading image...";
              }}
            />
          </Link>
          <div className="movie-overlay">
            <div className="attach">
              <div className="type-movie">
                {" "}
                <span className="txt">2D</span>
              </div>
              <div className="age">
                <span className="num">T{movie.do_tuoi_gioi_han || "T?"}</span>
                <span className="txt2">
                  {movie.do_tuoi_gioi_han >= 18
                    ? "ADULT"
                    : movie.do_tuoi_gioi_han >= 13
                    ? "TEEN"
                    : movie.do_tuoi_gioi_han > 0
                    ? "KID"
                    : "???"}
                </span>
              </div>
            </div>
            <div className="contentphimm">
              <Link to={`/phim/${movie.slug || movie.id}`}>
                <h5 className="movie-title1">
                  {movie.title || movie.ten_phim}
                </h5>
              </Link>
              <p style={{ fontSize: 12, color: "#fff", paddingBottom: "2px" }}>
                <CalendarOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                Đang khởi chiếu
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <TagOutlined style={{ color: "yellow", marginRight: "5px" }} />{" "}
                {parseGenres(movie)}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <ClockCircleOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.thoi_luong
                  ? `${movie.thoi_luong} phút`
                  : "Chưa cập nhật"}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <CommentOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.ngon_ngu ? movie.ngon_ngu : "Chưa rõ phiên bản"}
              </p>
            </div>
          </div>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
        </Link>

        <div className="movie-buttons">
          <button
            className="play-button"
            onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
          >
            <PlayCircleTwoTone
              twoToneColor="yellow"
              style={{ marginRight: 5, fontSize: "20px" }}
            />
            <span>Trailer</span>
          </button>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <button className="book-button">
              <span>ĐẶT VÉ</span>
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
                e.currentTarget.onerror = null;
                e.currentTarget.src = ""; // Không đặt ảnh thay thế
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.display = "flex";
                e.currentTarget.style.alignItems = "center";
                e.currentTarget.style.justifyContent = "center";
                e.currentTarget.style.fontSize = "14px";
                e.currentTarget.alt = "Loading image...";
              }}
            />
          </Link>
          <div className="movie-overlay">
            <div className="attach">
              <div className="type-movie">
                {" "}
                <span className="txt">2D</span>
              </div>
              <div className="age">
                <span className="num">T{movie.do_tuoi_gioi_han || "T?"}</span>
                <span className="txt2">
                  {movie.do_tuoi_gioi_han >= 18
                    ? "ADULT"
                    : movie.do_tuoi_gioi_han >= 13
                    ? "TEEN"
                    : movie.do_tuoi_gioi_han > 0
                    ? "KID"
                    : "???"}
                </span>
              </div>
            </div>
            <div className="contentphimm">
              <Link to={`/phim/${movie.slug || movie.id}`}>
                <h5 className="movie-title1">
                  {movie.title || movie.ten_phim}
                </h5>
              </Link>
              <p style={{ fontSize: 12, color: "#fff", paddingBottom: "2px" }}>
                <CalendarOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.ngay_cong_chieu
                  ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
                  : "Chưa cập nhật"}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <TagOutlined style={{ color: "yellow", marginRight: "5px" }} />{" "}
                {parseGenres(movie)}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <ClockCircleOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.thoi_luong
                  ? `${movie.thoi_luong} phút`
                  : "Chưa cập nhật"}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <CommentOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.ngon_ngu ? movie.ngon_ngu : "Chưa rõ phiên bản"}
              </p>
            </div>
          </div>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
        </Link>

        <div className="movie-buttons">
          <button
            className="play-button"
            onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
          >
            <PlayCircleTwoTone
              twoToneColor="yellow"
              style={{ marginRight: 5, fontSize: "20px" }}
            />
            <span>Trailer</span>
          </button>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <button className="book-button">
              <span>ĐẶT VÉ</span>
            </button>
          </Link>
        </div>
      </div>
    </SwiperSlide>
  );

  // Hàm render movie card cho suất chiếu đặc biệt
  const renderSpecialMovieCard = (movie: any, index: number) => (
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
                e.currentTarget.onerror = null;
                e.currentTarget.src = ""; // Không đặt ảnh thay thế
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.display = "flex";
                e.currentTarget.style.alignItems = "center";
                e.currentTarget.style.justifyContent = "center";
                e.currentTarget.style.fontSize = "14px";
                e.currentTarget.alt = "Loading image...";
              }}
            />
          </Link>
          <div className="movie-overlay">
            <div className="attach">
              <div className="type-movie">
                {" "}
                <span className="txt">2D</span>
              </div>
              <div className="age">
                <span className="num">T{movie.do_tuoi_gioi_han || "T?"}</span>
                <span className="txt2">
                  {movie.do_tuoi_gioi_han >= 18
                    ? "ADULT"
                    : movie.do_tuoi_gioi_han >= 13
                    ? "TEEN"
                    : movie.do_tuoi_gioi_han > 0
                    ? "KID"
                    : "???"}
                </span>
              </div>
            </div>
            <div className="attach2">
              <div className="type-movie2">
                <span className="txtt">Đặc biệt</span>
              </div>
            </div>
            <div className="contentphimm">
              <Link to={`/phim/${movie.slug || movie.id}`}>
                <h5 className="movie-title1">
                  {movie.title || movie.ten_phim}
                </h5>
              </Link>
              <p style={{ fontSize: 12, color: "#fff", paddingBottom: "2px" }}>
                <CalendarOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.ngay_cong_chieu
                  ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY")
                  : "Chưa cập nhật"}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <TagOutlined style={{ color: "yellow", marginRight: "5px" }} />{" "}
                {parseGenres(movie)}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <ClockCircleOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.thoi_luong
                  ? `${movie.thoi_luong} phút`
                  : "Chưa cập nhật"}
              </p>
              <p style={{ fontSize: 12, color: "#fff" }}>
                <CommentOutlined
                  style={{ color: "yellow", marginRight: "5px" }}
                />{" "}
                {movie.ngon_ngu ? movie.ngon_ngu : "Chưa rõ phiên bản"}
              </p>
            </div>
          </div>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
        </Link>

        <div className="movie-buttons">
          <button
            className="play-button"
            onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}
          >
            <PlayCircleTwoTone
              twoToneColor="yellow"
              style={{ marginRight: 5, fontSize: "20px" }}
            />
            <span>Trailer</span>
          </button>
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <button className="book-button">
              <span>ĐẶT VÉ</span>
            </button>
          </Link>
        </div>
      </div>
    </SwiperSlide>
  );

  // Hàm render nội dung theo tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center" /* Căn giữa theo chiều ngang */,
            alignItems: "center" /* Căn giữa theo chiều dọc */,
          }}
        >
          <Spin size="large" />{" "}
          {/* Bạn có thể điều chỉnh kích thước của Spin */}
        </div>
      );
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
          <Empty
            image={customImage}
            description={
              <span
                style={{
                  position: "relative",
                  top: "20px",
                  fontSize: "30px",
                  color: "#f3ea28",
                  fontFamily: "Anton, sans-serif",
                }}
              >
                ĐANG CẬP NHẬT
              </span>
            }
          />
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
          <Empty
            image={customImage}
            description={
              <span
                style={{
                  position: "relative",
                  top: "20px",
                  fontSize: "30px",
                  color: "#f3ea28",
                  fontFamily: "Anton, sans-serif",
                }}
              >
                ĐANG CẬP NHẬT
              </span>
            }
          />
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
          <Empty
            image={customImage}
            description={
              <span
                style={{
                  position: "relative",
                  top: "20px",
                  fontSize: "30px",
                  color: "#f3ea28",
                  fontFamily: "Anton, sans-serif",
                }}
              >
                ĐANG CẬP NHẬT
              </span>
            }
          />
        );

      default:
        return <p>Không tìm thấy nội dung.</p>;
    }
  };

  return (
    <div className="home-wrapper" style={{marginBottom:"50px"}}>

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
          <Empty
            description={
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  fontFamily: "Alata, sans-serif",
                }}
              >
                Không có trailer.
              </span>
            }
          />
        )}
      </Modal>

    </div>
  );
};

export default DatVeNgay;
