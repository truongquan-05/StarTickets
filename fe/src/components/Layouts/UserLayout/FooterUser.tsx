import { Space } from "antd";
import logo from "../../../assets/logodone-Photoroom.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FooterUser = () => {
  type Rap = {
    id: number;
    ten_rap: string;
  };
  const [rapList, setRapList] = useState<Rap[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/client/rap")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRapList(res.data);
        } else {
          setRapList(res.data.data); // Nếu API trả về dạng { data: [...] }
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách rạp:", err);
      });
  }, []);

  return (
    <footer className="cinestar-footer">
      <div className="footer-top">
        <div className="footer-left">
          <Link to="">
            <img src={logo} alt="Cinestar Logo" />
          </Link>
          <p>BE HAPPY, BE A STAR</p>
          <div className="header-actions">
            <Space>
              <Link to="/dat-ve-ngay">
                <button className="btn-ticket">
                  <span>🎫 ĐẶT VÉ NGAY</span>
                </button>
              </Link>
              <Link to="/dat-bap-nuoc">
                <button className="btn-popcorn">
                  <span>🍿 ĐẶT BẮP NƯỚC</span>
                </button>
              </Link>
            </Space>
          </div>
          <div className="social-icons">
            <a href="#">
              <img
                src="https://cinestar.com.vn/assets/images/footer-facebook.svg"
                alt="Facebook"
              />
            </a>
            <a href="#">
              <img
                src="	https://cinestar.com.vn/assets/images/footer-youtube.svg"
                alt="YouTube"
              />
            </a>
            <a href="#">
              <img
                src="https://api-website.cinestar.com.vn/media/wysiwyg/CMSPage/Icon/ic-tittok.svg"
                alt="Tiktok"
              />
            </a>
            <a href="#">
              <img
                src="	https://cinestar.com.vn/assets/images/ic-zl-white.svg"
                alt="Zalo"
              />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4> TÀI KHOẢN</h4>
            <ul>
              <li>
                <a href="login">Đăng nhập</a>
              </li>
              <li>
                <a href="register">Đăng ký</a>
              </li>
              <li>
                <a href="#">Membership</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>XEM PHIM</h4>
            <ul>
              <li>
                <a href="phim-dang-chieu">Phim đang chiếu</a>
              </li>
              <li>
                <a href="phim-sap-chieu">Phim sắp chiếu</a>
              </li>
              <li>
                <a href="suat-chieu-dac-biet">Suất chiếu đặc biệt</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>DỊCH VỤ KHÁC</h4>
            <ul>
              <li>
                <a href="#">Nhà hàng</a>
              </li>
              <li>
                <a href="#">Kidzone</a>
              </li>
              <li>
                <a href="#">Bowling</a>
              </li>
              <li>
                <a href="#">Billiards</a>
              </li>
              <li>
                <a href="#">Gym</a>
              </li>
              <li>
                <a href="#">Nhà hát Opera</a>
              </li>
              <li>
                <a href="#">Coffee</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>HỆ THỐNG RẠP</h4>
            <ul>
              <li>
                <a href="#">Tất cả hệ thống rạp</a>
              </li>
              {rapList.map((rap) => (
                <li key={rap.id}>
                  <a href="#">{rap.ten_rap}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>© 2025 Cinestar. All rights reserved.</p>
        </div>
        <div className="footer-bottom-right">
          <p>Chính sách bảo mật | Tin điện ảnh | Hỏi và đáp</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterUser;
