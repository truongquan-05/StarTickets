import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Modal, Empty } from "antd";
import { SwiperSlide } from "swiper/react";
import axios from 'axios';
import './DatVeTheoRap.css';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TagOutlined,
  CommentOutlined,
  PlayCircleTwoTone,
  EnvironmentOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const BASE_URL = "http://127.0.0.1:8000";

// Type definitions for better type safety
interface Rap {
  id?: string | number;
  ten_rap: string;
  dia_chi: string;
  so_dien_thoai?: string;
  website?: string;
  hinh_anh?: string;
  mo_ta?: string;
  gio_mo_cua?: string;
  gio_dong_cua?: string;
  thanh_pho?: string;
  quan_huyen?: string;
}

interface PhongChieu {
  ten_phong: string;
  rap: Rap;
}

interface Phim {
  id?: string | number;
  slug?: string;
  ten_phim: string;
  anh_poster: string;
  mo_ta: string;
  the_loai?: string;
  the_loai_id?: string;
  thoi_luong?: number;
  do_tuoi?: string;
  do_tuoi_gioi_han?: number;
  ngon_ngu?: string;
  chuyen_ngu?: string;
  ngay_cong_chieu?: string;
  trailer?: string;
  title?: string;
  image?: string;
  hinh_anh?: string;
}

interface LichChieuItem {
  id: string | number;
  phim: Phim;
  phong_chieu: PhongChieu;
  gio_chieu: string;
  gio_ket_thuc: string;
}

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

const DatVeTheoRap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const rapId = id;
  const [phimList, setPhimList] = useState<Phim[]>([]);
  const [rapInfo, setRapInfo] = useState<Rap | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'info' | 'success'; text: string } | null>(null);
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

  const parseGenres = (movie: Phim) => {
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

      return movie.the_loai || "Chưa cập nhật";
    } catch {
      return movie.the_loai || "Chưa cập nhật";
    }
  };

  // Fetch detailed cinema information
  const fetchRapInfo = async (rapId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/client/rap/${rapId}`);
      setRapInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching cinema info:', error);
    }
  };

  useEffect(() => {
    if (!id) return;

    console.log('rapId from URL:', id);

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch movies in cinema
        const moviesResponse = await axios.get(`${BASE_URL}/api/client/rap-phim/${rapId}`);
        const moviesData = moviesResponse.data.data || [];
        
        // Extract unique movies from showtimes
        const uniqueMovies = moviesData.reduce((acc: Phim[], item: LichChieuItem) => {
          const existingMovie = acc.find(movie => 
            (movie.ten_phim || movie.title) === (item.phim.ten_phim || item.phim.title)
          );
          
          if (!existingMovie) {
            acc.push(item.phim);
          }
          
          return acc;
        }, []);
        
        setPhimList(uniqueMovies);
        
        // Set basic rap info from movies data if available
        if (moviesData.length > 0) {
          const basicRapInfo = moviesData[0].phong_chieu.rap;
          setRapInfo(basicRapInfo);
        }

        // Fetch detailed cinema information
        await fetchRapInfo(rapId!);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('error', 'Lỗi tải dữ liệu');
        setPhimList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const showMessage = (type: 'error' | 'info' | 'success', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const renderMovieCard = (movie: Phim, index: number) => (
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
          <Link to={`/phim/${movie.slug || movie.id}`}>
            <div className="movie-overlay">
              <div className="attach">
                <div className="type-movie">
                  <span className="txt">2D</span>
                </div>
                <div className="age">
                  <span className="num">T{movie.do_tuoi_gioi_han || "?"}</span>
                  <span className="txt2">
                    {movie.do_tuoi_gioi_han && movie.do_tuoi_gioi_han >= 18
                      ? "ADULT"
                      : movie.do_tuoi_gioi_han && movie.do_tuoi_gioi_han >= 13
                      ? "TEEN"
                      : movie.do_tuoi_gioi_han && movie.do_tuoi_gioi_han > 0
                      ? "KID"
                      : "???"}
                  </span>
                </div>
              </div>
              <div className="contentphimm">
                <h5 className="movie-title1">
                  {movie.title || movie.ten_phim}
                </h5>
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
                  {movie.ngon_ngu || "Chưa rõ phiên bản"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <Link to={`/phim/${movie.slug || movie.id}`}>
          <h4 className="movie-title">{movie.title || movie.ten_phim}</h4>
        </Link>

        <div className="movie-buttons">
          <button
            className="play-button"
            onClick={() => handleShowTrailer(movie.trailer || "", movie.ten_phim)}
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

  const renderRapHeader = () => {
    if (!rapInfo) return null;

    return (
      <div className="rap-header-section">
        <div className="rap-banner">
          <div className="rap-info">
            <div className="rap-content">
              <h1 className="rap-title">
                {rapInfo.ten_rap.toUpperCase()}
                {rapInfo.thanh_pho && ` (${rapInfo.thanh_pho.toUpperCase()})`}
              </h1>
              
              <div className="rap-details">
                <div className="rap-detail-item">
                  <EnvironmentOutlined style={{ color: "yellow", marginRight: "8px", fontSize: "16px" }} />
                  <span>{rapInfo.dia_chi}</span>
                </div>
                
                {rapInfo.so_dien_thoai && (
                  <div className="rap-detail-item">
                    <PhoneOutlined style={{ color: "yellow", marginRight: "8px", fontSize: "16px" }} />
                    <span>{rapInfo.so_dien_thoai}</span>
                  </div>
                )}
                
                {rapInfo.website && (
                  <div className="rap-detail-item">
                    <GlobalOutlined style={{ color: "yellow", marginRight: "8px", fontSize: "16px" }} />
                    <a href={rapInfo.website} target="_blank" rel="noopener noreferrer">
                      {rapInfo.website}
                    </a>
                  </div>
                )}
                
                {(rapInfo.gio_mo_cua && rapInfo.gio_dong_cua) && (
                  <div className="rap-detail-item">
                    <ClockCircleOutlined style={{ color: "yellow", marginRight: "8px", fontSize: "16px" }} />
                    <span>Giờ hoạt động: {rapInfo.gio_mo_cua} - {rapInfo.gio_dong_cua}</span>
                  </div>
                )}
              </div>
              
              {rapInfo.mo_ta && (
                <div className="rap-description">
                  <p>{rapInfo.mo_ta}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dvtr__loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Message Toast */}
      {message && (
        <div className={`dvtr__message dvtr__message--${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Rap Header Section */}
      {renderRapHeader()}

      <div className="section section-trangcon">
        <h2 className="section-title-phimdangchieu">
          {rapInfo?.ten_rap ? `PHIM TẠI ${rapInfo.ten_rap.toUpperCase()}` : 'PHIM TẠI RẠP'}
        </h2>
        
        {phimList.length > 0 ? (
          <div className="movie-grid">
            {phimList.map((movie: Phim, i: number) =>
              renderMovieCard(movie, i)
            )}
          </div>
        ) : (
          <Empty
            description={
              <span
                style={{
                  color: "white",
                  fontSize: "16px",
                  fontFamily: "Alata, sans-serif",
                }}
              >
                Không có phim nào tại rạp này.
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
    </div>
  );
};

export default DatVeTheoRap;