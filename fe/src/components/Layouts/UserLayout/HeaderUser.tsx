import { UserOutlined } from "@ant-design/icons";
import logo from "../../../assets/logo for a movie ticket booking website.png";
import flag from "../../../assets/cờ.jpg";
import { Button, Input, Space, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import { useGoogleAuth } from "../../pages/auth/GoogleAuth";
import "../../assets/css/headerUser.css";

const HeaderUser = () => {
  const { user, logout } = useGoogleAuth();

  const loggedInMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">👤 Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        🚪 Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const guestMenu = (
    <Menu>
      <Menu.Item key="login">
        <Link to="/login">🔐 Đăng nhập</Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link to="/register">📝 Đăng ký</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header-cinestar">
      {/* PHẦN TRÊN */}
      <div className="header-top">
        <div className="header-left">
          <Link to="/">
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
            <Input.Search type="text" placeholder="Tìm phim, rạp" />
          </div>

          <Dropdown overlay={user ? loggedInMenu : guestMenu} trigger={["click"]}>
            <div className="header-login">
              {user?.anh_dai_dien ? (
                <img
                  src={user.anh_dai_dien}
                  alt={user.ten}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: 8,
                  }}
                />
              ) : (
                <UserOutlined style={{ marginRight: 8 }} />
              )}
              <span className="login-text">
                {user ? `Xin chào, ${user.ten}` : "Tài khoản"}
              </span>
            </div>
          </Dropdown>

          <div className="header-lang">
            <img src={flag} alt="Vietnamese Flag" className="logo" />
          </div>
        </div>
      </div>

      {/* PHẦN MENU */}
      <div className="header-menu">
        <a href="#">📍 Chọn rạp</a>
        <a href="#">📅 Lịch chiếu</a>
        <a href="#" className="khuyen_mai">
          🎁 Khuyến mãi
        </a>
        <a href="#">🏢 Thuê sự kiện</a>
        <a href="/news">📰 Tin tức</a>
        <a href="/about">ℹ️ Giới thiệu</a>
      </div>
    </header>
  );
};

export default HeaderUser;