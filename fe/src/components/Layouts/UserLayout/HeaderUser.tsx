import { UserOutlined } from "@ant-design/icons";
import logo from "../../../assets/logo for a movie ticket booking website.png";
import flag from "../../../assets/cờ.jpg";
import { Button, Input, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const HeaderUser = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="header-cinestar">
      {/* PHẦN TRÊN */}
      <div className="header-top">
        <div className="header-left">
          <Link to="">
            <img src={logo} alt="Cinestar" className="logo" />
          </Link>
        </div>

        <div className="header-actions">
          <Space>
            <Button className="btn-ticket">🎫 ĐẶT VÉ NGAY</Button>
            <Button className="btn-popcorn">🍿 ĐẶT BẮP NƯỚC</Button>
          </Space>
        </div>

        <div className="header-account">
          <div className="header-search">
            <Input.Search
              type="text"
              placeholder="Tìm phim, rạp"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
            />
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
        <a href="/news">📰 Tin tức</a>
        <a href="/about">ℹ️ Giới thiệu</a>
      </div>
    </header>
  );
};

export default HeaderUser;
