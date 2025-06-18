
import {  UserOutlined } from "@ant-design/icons";
import logo from "../../../assets/logo for a movie ticket booking website.png";
import flag from "../../../assets/cờ.jpg"
import { Button, Input, Space } from "antd";
import { Link } from "react-router-dom";


const HeaderUser = () => {

  return (
    <header className="header-cinestar">
      {/* PHẦN TRÊN */}
      <div className="header-top">
        <div className="header-left">
          <Link to=""><img src={logo} alt="Cinestar" className="logo" /></Link>
        </div>

        <div className="header-actions">
          <Space>
          <Button className="btn-ticket">🎫 ĐẶT VÉ NGAY</Button>
          <Button className="btn-popcorn">🍿 ĐẶT BẮP NƯỚC</Button>
          </Space>
        </div>
        <div className="header-account">
          <div className="header-search">
          <Input.Search type="text" placeholder="Tìm phim, rạp" />
          </div>
          <div className="header-login">
            <UserOutlined />
            <Link to="/login">
              <span className="login-text">Đăng nhập</span>
            </Link>
          </div>
          <div className="header-lang">
          <img src={flag} alt="Cinestar" className="logo" />
        </div>
        </div>
      </div>

      {/* PHẦN MENU */}
      <div className="header-menu">
        <a href="#">📍 Chọn rạp</a>
        <a href="#">📅 Lịch chiếu</a>  
        <a href="#" className="khuyen_mai">🎁 Khuyến mãi</a>
        <a href="#">🏢 Thuê sự kiện</a>
        <a href="#">🎮 Tất cả các giải trí</a>
        <a href="/news">ℹ️ Giới thiệu</a>
      </div>
    </header>
  );
};

export default HeaderUser;
