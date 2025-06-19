
import logo from "../../../assets/logo for a movie ticket booking website.png";

const FooterUser = () => {
  return (
    <footer className="cinestar-footer">
      <div className="footer-top">
        <div className="footer-logo">
          <img
            src={logo}
            alt="Cinestar Logo"
          />
          <p>BE HAPPY, BE A STAR</p>
          <p>Địa chỉ: FPOLY TRINH VAN BO</p>
          <p>Hotline: 1900 6017</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Giới thiệu</h4>
            <ul>
              <li><a href="#">Về Cinestar</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h4>Chính sách</h4>
            <ul>
              <li><a href="#">Bảo mật</a></li>
              <li><a href="#">Thanh toán</a></li>
              <li><a href="#">Thành viên</a></li>
            </ul>
          </div>
          <div>
            <h4>Kết nối</h4>
            <div className="social-icons">
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/24/733/733558.png" alt="YouTube" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Instagram" /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Cinestar. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterUser;
