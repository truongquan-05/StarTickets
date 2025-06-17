// src/pages/MovieDetail.tsx
import React from "react";
import "./Home.css";
import { Button } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const MovieDetail = () => {
  return (
    <div className="movie-detail-wrapper">
      <div className="movie-detail-container">
        <div className="movie-poster">
          <img
            src="https://cdn.galaxycine.vn/media/2025/4/28/tham-tu-kien-2_1745832748529.jpg"
            alt="Poster"
          />
        </div>

        <div className="movie-content">
          <h1>Thám Tử Kiên (T18)</h1>

          <ul className="movie-attributes">
            <li><span>🎬 Thể loại:</span> Hồi Hộp, Kinh Dị</li>
            <li><span>⏱ Thời lượng:</span> 114'</li>
            <li><span>💿 Định dạng:</span> 2D</li>
            <li><span>🌐 Ngôn ngữ:</span> Phụ đề</li>
          </ul>

          <div className="movie-age-warning">
            🔞 T18: Phim dành cho khán giả từ đủ 18 tuổi trở lên
          </div>

          <div className="movie-section">
            <h3>MÔ TẢ</h3>
            <p>
              Đạo diễn: Danny Boyle<br />
              Diễn viên: Aaron Taylor-Johnson, Ralph Fiennes, Jodie Comer, Cillian Murphy<br />
              Khởi chiếu: Thứ Sáu, 20/06/2025
            </p>
          </div>

          <div className="movie-section">
            <h3>NỘI DUNG PHIM</h3>
            <p>
              Cơn ác mộng chưa kết thúc. Virus trở lại, kéo theo bóng tối bao trùm nước Anh...
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
