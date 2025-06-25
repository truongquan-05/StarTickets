import { useEffect, useState } from "react";
import "./Home.css";
import { Button, Spin } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getMovieDetail } from "../../provider/duProvider"; // chỉnh path nếu khác

const MovieDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetail(id!);
        setMovie(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <Spin />;

  if (!movie) return <p>Không tìm thấy phim</p>;

  return (
    <div className="movie-detail-wrapper">
      <div className="movie-detail-container">
        <div className="movie-poster">
          <img src={movie.anh_poster} alt={movie.ten_phim} />
        </div>

        <div className="movie-content">
          <h1>{movie.ten_phim}</h1>

          <ul className="movie-attributes">
            <li><span>🎬 Thể loại:</span> {movie.the_loai?.ten_the_loai || "Đang cập nhật"}</li>
            <li><span>⏱ Thời lượng:</span> {movie.thoi_luong}'</li>
            <li><span>💿 Định dạng:</span> 2D</li>
            <li><span>🌐 Ngôn ngữ:</span> {movie.ngon_ngu}</li>
          </ul>

          <div className="movie-age-warning">
            🔞 {movie.do_tuoi_gioi_han}
          </div>

          <div className="movie-section">
            <h3>MÔ TẢ</h3>
            <p>{movie.mo_ta}</p>
          </div>

          <div className="movie-section">
            <h3>TRAILER</h3>
            <p>
              <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
                {movie.trailer}
              </a>
            </p>
          </div>

          <Button className="trailer-button" icon={<PlayCircleOutlined />} size="large">
            Xem Trailer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;