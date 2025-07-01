import { Button, Space } from "antd";
import logo from "../../../assets/logodone-Photoroom.png";
import { Link } from "react-router-dom";

const FooterUser = () => {
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
              <button className="btn-tickett"><span>🎫 ĐẶT VÉ NGAY</span></button>
            <button className="btn-popcorn2"><span>🍿 ĐẶT BẮP NƯỚC</span></button>
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
            <h4>Tài khoản</h4>
            <ul>
              <li>
                <a href="#">Đăng nhập</a>
              </li>
              <li>
                <a href="#">Đăng ký</a>
              </li>
              <li>
                <a href="#">Membership</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Thuê sự kiện</h4>
            <ul>
              <li>
                <a href="#">Thuê rạp</a>
              </li>
              <li>
                <a href="#">Các loại hình cho thuê khác</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Dịch vụ khác</h4>
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
            <h4>Hệ thống rạp</h4>
            <ul>
              <li>
                <a href="#">Tất cả hệ thống rạp</a>
              </li>
              <li>
                <a href="#">Cinestar Quốc Thanh (TP.HCM)</a>
              </li>
              <li>
                <a href="#">Cinestar Quận 6 (TP.HCM)</a>
              </li>
              <li>
                <a href="#">Cinestar Hai Bà Trưng (TP.HCM)</a>
              </li>
              <li>
                <a href="#">Cinestar Sinh Viên (Bình Dương)</a>
              </li>
              <li>
                <a href="#">Cinestar Huế (TP.Huế)</a>
              </li>
              <li>
                <a href="#">Cinestar Đà Lạt (TP.Đà Lạt)</a>
              </li>
              <li>
                <a href="#">Cinestar Lâm Đồng (Đức Trọng)</a>
              </li>
              <li>
                <a href="#">Cinestar Mỹ Tho (Tiền Giang)</a>
              </li>
              <li>
                <a href="#">Cinestar Kiên Giang (Rạch Sỏi)</a>
              </li>
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
