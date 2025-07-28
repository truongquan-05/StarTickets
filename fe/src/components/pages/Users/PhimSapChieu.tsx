import { useEffect, useState } from "react";
import { Spin, Modal, Empty } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";


import "./Home.css";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TagOutlined,
  CommentOutlined,
  PlayCircleTwoTone,
} from "@ant-design/icons";

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

const PhimSapChieu = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch {
      return "Chưa cập nhật";
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/home/sap-chieu");
      setMovies(res.data || []);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách phim sắp chiếu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const renderMovieCard = (movie: any, index: number) => (
    <div key={index} className="movie-card">
      <div className="movie-poster-wrapper">
        <Link to={`/phim/${movie.slug || movie.id}`}>
          <img
            src={getImageUrl(movie.image || movie.hinh_anh || movie.anh_poster)}
            alt={movie.title || movie.ten_phim}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/220x280?text=No+Image";
            }}
          />
        </Link>
        <div className="movie-overlay">
          <div className="attach">
            <div className="type-movie">
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
              <h5 className="movie-title1">{movie.title || movie.ten_phim}</h5>
            </Link>
            <p style={{ fontSize: 12, color: "#fff", paddingBottom: "2px" }}>
              <CalendarOutlined style={{ color: "yellow", marginRight: "5px" }} />
              {movie.ngay_cong_chieu ? moment(movie.ngay_cong_chieu).format("DD/MM/YYYY") : "Sắp chiếu"}
            </p>
            <p style={{ fontSize: 12, color: "#fff" }}>
              <TagOutlined style={{ color: "yellow", marginRight: "5px" }} />
              {parseGenres(movie)}
            </p>
            <p style={{ fontSize: 12, color: "#fff" }}>
              <ClockCircleOutlined style={{ color: "yellow", marginRight: "5px" }} />
              {movie.thoi_luong ? `${movie.thoi_luong} phút` : "Chưa cập nhật"}
            </p>
            <p style={{ fontSize: 12, color: "#fff" }}>
              <CommentOutlined style={{ color: "yellow", marginRight: "5px" }} />
              {movie.ngon_ngu || "Chưa rõ phiên bản"}
            </p>
          </div>
        </div>
      </div>

      <Link to={`/phim/${movie.slug || movie.id}`}>
        <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
      </Link>

      <div className="movie-buttons">
        <button className="play-button" onClick={() => handleShowTrailer(movie.trailer, movie.ten_phim)}>
          <PlayCircleTwoTone twoToneColor="yellow" style={{ marginRight: 5, fontSize: "20px" }} />
          <span>Trailer</span>
        </button>
        <Link to={`/phim/${movie.slug || movie.id}`}>
          <button className="book-button">
            <span>ĐẶT VÉ</span>
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="home-wrapper">
      <div className="section section-trangcon">
        <h2 className="section-title-phimdangchieu">PHIM SẮP CHIẾU</h2>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin size="large" />
          </div>
        ) : movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map((movie: any, i: number) => renderMovieCard(movie, i))}
          </div>
        ) : (
          <Empty
            description={
              <span style={{ color: "white", fontSize: "16px", fontFamily: "Alata, sans-serif" }}>
                Không có phim sắp chiếu.
              </span>
            }
          />
        )}

        <Modal
          title={`Trailer - ${trailerTitle}`}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          bodyStyle={{ padding: 0, height: 450 }}
          destroyOnClose
          centered
          style={{ fontFamily: "Anton, sans-serif", fontWeight: 100, fontSize: 50, borderRadius: 4 }}
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
                <span style={{ color: "black", fontSize: "16px", fontFamily: "Alata, sans-serif" }}>
                  Không có trailer.
                </span>
              }
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PhimSapChieu;