import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './DatVeTheoRap.css';

// Type definitions for better type safety
interface Rap {
  ten_rap: string;
  dia_chi: string;
}

interface PhongChieu {
  ten_phong: string;
  rap: Rap;
}

interface Phim {
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
}

interface LichChieuItem {
  id: string | number;
  phim: Phim;
  phong_chieu: PhongChieu;
  gio_chieu: string;
  gio_ket_thuc: string;
}

interface GroupedShowtimes {
  [movieId: string]: {
    phim: Phim;
    showtimes: {
      [date: string]: LichChieuItem[];
    };
  };
}

const DatVeTheoRap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const rapId = id;
  const [lichChieu, setLichChieu] = useState<LichChieuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [rapName, setRapName] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'error' | 'info' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;

    console.log('rapId from URL:', id);

    const fetchLichChieu = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/client/rap-phim/${rapId}`);
        const data = response.data.data || [];
        setLichChieu(data);
        
        if (data.length > 0) {
          setRapName(data[0].phong_chieu.rap.ten_rap);
        }
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        showMessage('error', 'Lỗi tải dữ liệu suất chiếu');
        setLichChieu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLichChieu();
  }, [id]);

  const showMessage = (type: 'error' | 'info' | 'success', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Parse genres like in PhimDacBiet component
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

  // Get age rating display
  const getAgeRatingDisplay = (movie: Phim) => {
    const age = movie.do_tuoi_gioi_han || movie.do_tuoi;
    if (!age) return "K";
    
    if (typeof age === 'number') {
      return `T${age}`;
    }
    
    if (typeof age === 'string') {
      // If it's already formatted like "T13", return as is
      if (age.startsWith('T')) return age;
      // If it's just a number string, add T prefix
      const numAge = parseInt(age);
      if (!isNaN(numAge)) return `T${numAge}`;
    }
    
    return age.toString();
  };

  // Format release date
  const formatReleaseDate = (dateString?: string) => {
    if (!dateString) return "Sắp chiếu";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return "Sắp chiếu";
    }
  };

  // Group showtimes by movie and date
  const groupShowtimes = (data: LichChieuItem[]): GroupedShowtimes => {
    return data.reduce((acc, item) => {
      const movieId = item.phim.ten_phim;
      const showDate = new Date(item.gio_chieu).toDateString();

      if (!acc[movieId]) {
        acc[movieId] = {
          phim: item.phim,
          showtimes: {}
        };
      }

      if (!acc[movieId].showtimes[showDate]) {
        acc[movieId].showtimes[showDate] = [];
      }

      acc[movieId].showtimes[showDate].push(item);
      return acc;
    }, {} as GroupedShowtimes);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time for showtime buttons
  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dvtr__loading-container">
        <div className="dvtr__spinner"></div>
        <p className="dvtr__loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const groupedData = groupShowtimes(lichChieu);

  return (
    <div className="dvtr__main-container">
      {/* Message Toast */}
      {message && (
        <div className={`dvtr__message dvtr__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="dvtr__content-wrapper">
        <h1 className="dvtr__page-title">
          {rapName ? `Lịch chiếu tại rạp ${rapName}` : 'Lịch chiếu tại rạp'}
        </h1>
        
        {Object.keys(groupedData).length === 0 ? (
          <div className="dvtr__empty-state">
            <div className="dvtr__empty-icon">📽️</div>
            <p className="dvtr__empty-text">Không có suất chiếu nào</p>
          </div>
        ) : (
          <div className="dvtr__movies-grid">
            {Object.entries(groupedData).map(([movieId, movieData]) => (
              <div key={movieId} className="dvtr__movie-card">
                {/* Movie Poster - Left Side */}
                <div className="dvtr__poster-container">
                  <img
                    className="dvtr__poster-image"
                    alt={movieData.phim.ten_phim}
                    src={`http://127.0.0.1:8000/storage/${movieData.phim.anh_poster}`}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-movie.jpg';
                    }}
                  />
                  {/* Age Rating Badge */}
                  {movieData.phim.do_tuoi_gioi_han && (
                    <span className="dvtr__age-badge">
                      {getAgeRatingDisplay(movieData.phim)}
                    </span>
                  )}
                </div>

                {/* Movie Info & Showtimes - Right Side */}
                <div className="dvtr__movie-info">
                  {/* Movie Title */}
                  <div className="dvtr__movie-header">
                    <h2 className="dvtr__movie-title">
                      {movieData.phim.ten_phim}
                    </h2>

                    {/* Movie Details */}
                    <div className="dvtr__movie-details">
                      <div className="dvtr__detail-row">
                        <span className="dvtr__detail-icon">🎭</span>
                        <span className="dvtr__detail-text">
                          {movieData.phim.the_loai || 'Kinh Dị'}
                        </span>
                        <span className="dvtr__detail-icon">⏱️</span>
                        <span className="dvtr__detail-text">
                          {movieData.phim.thoi_luong || 102} phút
                        </span>
                        <span className="dvtr__detail-icon">🎬</span>
                        <span className="dvtr__detail-text">Khác</span>
                      </div>
                      
                      <div className="dvtr__detail-row">
                        <span className="dvtr__detail-icon">📺</span>
                        <span className="dvtr__detail-text">Phụ Đề</span>
                      </div>

                      <div className="dvtr__detail-row">
                        <span className="dvtr__detail-icon">⚠️</span>
                        <span className="dvtr__warning-text">
                          K: Phim dành cho khán giả từ dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Showtimes */}
                  <div className="dvtr__showtimes">
                    {Object.entries(movieData.showtimes).map(([date, showtimes]) => (
                      <div key={date} className="dvtr__showtime-group">
                        <div className="dvtr__date-header">
                          <span className="dvtr__date-text">
                            {formatDate(date)}
                          </span>
                          <button className="dvtr__expand-btn">⌄</button>
                        </div>
                        
                        <div className="dvtr__showtime-content">
                          <span className="dvtr__showtime-label">STANDARD</span>
                          <div className="dvtr__time-buttons">
                            {showtimes.map((showtime) => (
                              <button
                                key={showtime.id}
                                className="dvtr__time-btn"
                                onClick={() => {
                                  showMessage('info', `Đặt vé suất ${formatTime(showtime.gio_chieu)} - Phòng ${showtime.phong_chieu.ten_phong}`);
                                }}
                              >
                                {formatTime(showtime.gio_chieu)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Link to={`/phim/${movieData.phim.slug || movieData.phim.id || movieId}`}>
                      <button className="dvtr__more-showtimes-btn">
                        Xem thêm lịch chiếu
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatVeTheoRap;