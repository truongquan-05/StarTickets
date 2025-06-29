import logo from "../../../assets/logodone.png";
import flag from "../../../assets/cờ.jpg";
import { Button, Input, Space, Dropdown, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../pages/auth/GoogleAuth";
import "../../assets/css/headerUser.css";
import { useState } from "react";
import {
  CalendarOutlined,
  CaretDownOutlined,
  EnvironmentOutlined,
  FormOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const HeaderUser = () => {
  const { user, logout } = useGoogleAuth();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
    }
  };
  const loggedInMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        className="menu-item-custom"
      >
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={logout}
        className="menu-item-custom logout-item"
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const guestMenu = (
    <Menu>
      <Menu.Item
        key="login"
        icon={<LoginOutlined />}
        className="menu-item-custom"
      >
        <Link to="/login">Đăng nhập</Link>
      </Menu.Item>
      <Menu.Item
        key="register"
        icon={<FormOutlined />}
        className="menu-item-custom logout-item"
      >
        <Link to="/register">Đăng ký</Link>
      </Menu.Item>
    </Menu>
  );

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

          <Dropdown
            overlay={user ? loggedInMenu : guestMenu}
            trigger={["click"]}
          >
            <div className="header-login">
              {user?.anh_dai_dien ? (
                <img
                  src={user.anh_dai_dien}
                  alt={user.ten}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: 8,
                  }}
                />
              ) : (
                <div className="user-icon shake-rotate">
                  <UserOutlined />
                </div>
              )}
              <span className="login-text" title={user?.ten}>
                {user
                  ? `${user.ten.slice(0, 6).toUpperCase()}...`
                  : "TÀI KHOẢN"}
              </span>
            </div>
          </Dropdown>

          <div className="header-lang">
            <img src={flag} alt="Vietnamese Flag" className="logo" />
            <span className="lang-text">VN</span>
            <CaretDownOutlined />
          </div>
        </div>
      </div>

      {/* PHẦN MENU */}
      <div className="header-menu">
        <a href="#">
          <EnvironmentOutlined /> Chọn rạp
        </a>
        <a href="#">
          <CalendarOutlined /> Lịch chiếu
        </a>
        <a href="#" className="khuyen_mai">
          Khuyến mãi
        </a>
        <a href="#">Thuê sự kiện</a>
        <a href="/news">Tin tức</a>
        <a href="/about">Giới thiệu</a>
      </div>
    </header>
  );
};

export default HeaderUser;
