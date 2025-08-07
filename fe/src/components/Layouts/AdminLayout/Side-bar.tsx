import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  VideoCameraOutlined,
  HomeOutlined,
  BankOutlined,
  TagsOutlined,
  UserOutlined,
  GiftOutlined,
  CommentOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  WindowsOutlined,
  CalendarOutlined,
  InsertRowAboveOutlined,
  TeamOutlined,
  IdcardOutlined,
  CoffeeOutlined,
  VideoCameraAddOutlined,
  MailOutlined,
  StarOutlined,
  ShoppingOutlined,
  GoldOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  StopOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  UsergroupAddOutlined,
  CarryOutOutlined,
  CloseSquareOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import logoStar from "../../../assets/logonho2.png";
import "../App.css";
const { Sider } = Layout;

interface SideBarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  drawerVisible: boolean;
  setDrawerVisible: (visible: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  collapsed,
  onCollapse,
  drawerVisible,
  setDrawerVisible,
}) => {
  const location = useLocation();
  const selectedKey = location.pathname;

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const calculateSidebarWidth = () => {
    const width = window.innerWidth;
    if (width < 576) return 200;
    if (width < 992) return 220;
    return 250;
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(calculateSidebarWidth());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuContent = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ paddingTop: 16 }}
      onClick={() => isMobile && setDrawerVisible(false)}
    >
      <Menu.Item key="/admin" icon={<HomeOutlined />}>
        <Link to="/admin">Dashboard</Link>
      </Menu.Item>

      <Menu.SubMenu key="thong-ke" icon={<PieChartOutlined />} title="Thống Kê">
        <Menu.Item key="/admin/thong-ke/ve" icon={<BarChartOutlined />}>
          <Link to="/admin/thong-ke/ve">Thống Kê Vé</Link>
        </Menu.Item>
        <Menu.Item key="/admin/thong-ke/doanh-thu" icon={<LineChartOutlined />}>
          <Link to="/admin/thong-ke/doanh-thu">Thống Kê Doanh Thu</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="/admin/don-ve" icon={<ShoppingOutlined />}>
        <Link to="/admin/don-ve">Quản Lý Đơn Vé</Link>
      </Menu.Item>

      <Menu.SubMenu
        key="movies"
        icon={<VideoCameraOutlined />}
        title="Quản Lý Phim"
      >
        <Menu.Item key="/admin/movies/list" icon={<UnorderedListOutlined />}>
          <Link to="/admin/movies/list">Danh Sách Phim</Link>
        </Menu.Item>
        {/*  */}

        <Menu.Item key="/admin/movies/trash" icon={<DeleteOutlined />}>
          <Link to="/admin/movies/trash">Thùng Rác</Link>
        </Menu.Item>
        <Menu.Item key="/admin/genre" icon={<WindowsOutlined />}>
          <Link to="/admin/genre">Thể Loại Phim</Link>
        </Menu.Item>
        <Menu.Item key="/admin/lichchieu/list" icon={<CarryOutOutlined />}>
          <Link to="/admin/lichchieu/list">Lịch Chiếu Phim</Link>
        </Menu.Item>
        <Menu.Item key="/admin/lichchieucu/list" icon={<CalendarOutlined />}>
          <Link to="/admin/lichchieucu/list">Lịch Chiếu Cũ</Link>
        </Menu.Item>
        <Menu.Item key="/admin/lichchieu/add" icon={<VideoCameraAddOutlined />}>
          <Link to="/admin/lichchieu/add">Thêm Lịch Chiếu</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="chair" icon={<AppstoreOutlined />} title="Quản Lý Ghế">
        <Menu.Item key="/admin/category_chair/list" icon={<GoldOutlined />}>
          <Link to="/admin/category_chair/list">Loại Ghế</Link>
        </Menu.Item>
        <Menu.Item key="/admin/chair/list" icon={<InsertRowAboveOutlined />}>
          <Link to="/admin/chair/list">Ghế</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="users"
        icon={<UserOutlined />}
        title="Quản Lý Tài Khoản"
      >
        <Menu.Item key="/admin/users" icon={<TeamOutlined />}>
          <Link to="/admin/users">Tài Khoản</Link>
        </Menu.Item>
        <Menu.Item key="/admin/vaitro" icon={<IdcardOutlined />}>
          <Link to="/admin/vaitro">Vai Trò</Link>
        </Menu.Item>
        <Menu.Item key="/admin/phanquyen" icon={<UsergroupAddOutlined />}>
          <Link to="/admin/phanquyen">Thêm Quyền</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="food"
        icon={<GiftOutlined />}
        title="Quản Lý Dịch vụ"
      >
        <Menu.Item key="/admin/food" icon={<CoffeeOutlined />}>
          <Link to="/admin/food">Quản Lý Đồ Ăn</Link>
        </Menu.Item>
        <Menu.Item key="/admin/vouchers/list" icon={<TagsOutlined />}>
          <Link to="/admin/vouchers/list">Quản Lý Vouchers</Link>
        </Menu.Item>
        <Menu.Item key="/admin/news" icon={<PaperClipOutlined />}>
          <Link to="/admin/news">Quản Lý Tin Tức</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="cinemas" icon={<BankOutlined />} title="Quản Lý Rạp">
        <Menu.Item key="/admin/cinemas/list" icon={<UnorderedListOutlined />}>
          <Link to="/admin/cinemas/list">Danh Sách Rạp</Link>
        </Menu.Item>
        <Menu.Item key="/admin/cinemas/add" icon={<PlusCircleOutlined />}>
          <Link to="/admin/cinemas/add">Thêm Mới Rạp</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="phongchieu"
        icon={<VideoCameraAddOutlined />}
        title="Quản Lý Phòng Chiếu"
      >
        <Menu.Item key="/admin/room/list" icon={<UnorderedListOutlined />}>
          <Link to="/admin/room/list">Danh Sách Phòng Chiếu</Link>
        </Menu.Item>
        <Menu.Item
          key="/admin/room/list/chuaxuat"
          icon={<CloseSquareOutlined />}
        >
          <Link to="/admin/room/list/chuaxuat">Phòng Chiếu Chưa Xuất</Link>
        </Menu.Item>
        <Menu.Item key="/admin/room/add" icon={<PlusCircleOutlined />}>
          <Link to="/admin/room/add">Thêm Mới Phòng Chiếu</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="comment"
        icon={<MailOutlined />}
        title="Quản Lý Phản Hồi"
      >
        <Menu.Item key="/admin/comment/phanhoinguoidung" icon={<CommentOutlined />}>
          <Link to="/admin/comment/phanhoinguoidung">Phản Hồi Người Dùng</Link>
        </Menu.Item>
        <Menu.Item key="/admin/danh-gia/list" icon={<StarOutlined />}>
          <Link to="/admin/danh-gia/list">Quản Lý Đánh Giá</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="banner"
        icon={<LaptopOutlined />}
        title="Quản Lý Banners"
      >
        <Menu.Item key="/admin/banner" icon={<UnorderedListOutlined />}>
          <Link to="/admin/banner">Danh Sách Banners</Link>
        </Menu.Item>

        <Menu.Item key="/admin/banner/het-han" icon={<StopOutlined />}>
          <Link to="/admin/banner/het-han">Banner Hết Hạn</Link>
        </Menu.Item>
        <Menu.Item key="/admin/banner/trash" icon={<DeleteOutlined />}>
          <Link to="/admin/banner/trash">Thùng Rác</Link>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  if (isMobile) {
    return (
      <Drawer
        open={drawerVisible}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        bodyStyle={{ padding: 0 }}
        width={sidebarWidth}
      >
        <div
          style={{
            padding: collapsed ? 8 : 16,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.05)",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => onCollapse(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <img
            src={logoStar}
            alt="Logo"
            style={{ width: 100, height: 30, objectFit: "contain" }}
          />
        </div>
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      className="custom-sidebar-scroll"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="dark"
      width={sidebarWidth}
      collapsedWidth={80}
      breakpoint="lg"
      style={{
        height: "100vh",
        position: "fixed",
        overflowY: "auto",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 999, // thấp hơn header
      }}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start", // căn giữa khi collapsed
          background: "rgba(255, 255, 255, 0.05)",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => onCollapse(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <img
          src={logoStar}
          alt="Logo"
          style={{
            width: 38, // logo to hơn
            height: 38,
            objectFit: "contain",
            transition: "all 0.3s ease",
            marginRight: collapsed ? 0 : 10, // có khoảng cách khi mở
          }}
        />
        {!collapsed && (
          <h2
            style={{
              color: "#fff",
              fontSize: 22, // to hơn chút
              margin: 0,
              fontFamily: "'Poppins', sans-serif", // font đổi sang Poppins
              fontWeight: 600,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            StarTickets
          </h2>
        )}
      </div>

      {menuContent}
    </Sider>
  );
};

export default SideBar;
