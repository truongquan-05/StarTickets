import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  VideoCameraOutlined,
  HomeOutlined,
  BankOutlined,
  TagsOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UserOutlined,
  TableOutlined,
  GiftOutlined,
  CommentOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  OrderedListOutlined,
  WindowsOutlined,
  CalendarOutlined,
  InsertRowAboveOutlined,
  TeamOutlined,
  IdcardOutlined,
  CoffeeOutlined,
  VideoCameraAddOutlined,
  MailOutlined,
  MessageOutlined,
  EditOutlined,
  StarOutlined,
  SolutionOutlined,
  ShoppingOutlined,
  GoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import logoStar from "../../../assets/logoStar.png";
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
      setIsMobile(window.innerWidth < 768);
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

      <Menu.Item key="/admin/thongke/list" icon={<BarChartOutlined />}>
        <Link to="/admin/thongke/list">Thống Kê</Link>
      </Menu.Item>

      <Menu.SubMenu
        key="movies"
        icon={<VideoCameraOutlined />}
        title="Quản Lý Phim"
      >
        <Menu.Item key="/admin/movies/list" icon={<UnorderedListOutlined />}>
          <Link to="/admin/movies/list">Danh Sách Phim</Link>
        </Menu.Item>
        <Menu.Item key="/admin/movies/add" icon={<PlusCircleOutlined />}>
          <Link to="/admin/movies/add">Add</Link>
        </Menu.Item>
        <Menu.Item key="/admin/genre" icon={<WindowsOutlined />}>
          <Link to="/admin/genre">Thể loại phim</Link>
        </Menu.Item>
        <Menu.Item key="/admin/lichchieu/list" icon={<CalendarOutlined />}>
          <Link to="/admin/lichchieu/list">Lịch Chiếu phim</Link>
        </Menu.Item>
        <Menu.Item key="/admin/lichchieucu/list" icon={<CalendarOutlined />}>
          <Link to="/admin/lichchieucu/list">Lịch Chiếu phim cũ</Link>
        </Menu.Item>
        <Menu.Item key="/admin/lichchieu/add" icon={<CalendarOutlined />}>
          <Link to="/admin/lichchieu/add">Thêm Lịch Chiếu</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="chair"
        icon={<AppstoreOutlined/>}
        title="Quản Lý Ghế"
      >
      <Menu.Item key="/admin/category_chair/list" icon={<GoldOutlined/>}>
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
      </Menu.SubMenu>
      <Menu.SubMenu
        key="food"
        icon={<GiftOutlined />}
        title="Dịch vụ và ưu đãi"
      >
        <Menu.Item key="/admin/food" icon={<CoffeeOutlined />}>
          <Link to="/admin/food">Quản lý đồ ăn</Link>
        </Menu.Item>
        <Menu.Item key="/admin/vouchers/list" icon={<TagsOutlined />}>
          <Link to="/admin/vouchers/list">Quản lý vouchers</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="cinemas" icon={<BankOutlined />} title="Quản Lý Rạp">
        <Menu.Item key="/admin/cinemas/list" icon={<UnorderedListOutlined />}>
          <Link to="/admin/cinemas/list">Danh Sách Rạp</Link>
        </Menu.Item>
        <Menu.Item key="/admin/cinemas/add" icon={<PlusCircleOutlined />}>
          <Link to="/admin/cinemas/add">Thêm Mới rạp</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="phongchieu" icon={<VideoCameraAddOutlined />} title="Quản Lý Phòng Chiếu">
        <Menu.Item key="/admin/room/list" icon={<UnorderedListOutlined />}>
          <Link to="/admin/room/list">Danh Sách Phòng Chiếu</Link>
        </Menu.Item>
        <Menu.Item key="/admin/room/list/chuaxuat" icon={<UnorderedListOutlined />}>
          <Link to="/admin/room/list/chuaxuat">Phòng Chiếu Chưa Xuất</Link>
        </Menu.Item>
        <Menu.Item key="/admin/room/add" icon={<PlusCircleOutlined />}>
          <Link to="/admin/room/add">Thêm mới Phòng Chiếu</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="comment"
        icon={<MailOutlined />}
        title="Quản Lý Phản Hồi"
      >
        <Menu.Item key="" icon={<CommentOutlined />}>
          <Link to="/admin/comment/phanhoinguoidung">Phản Hồi Người Dùng</Link>
        </Menu.Item>
        <Menu.Item key="" icon={<StarOutlined />}>
          <Link to="/admin/comment/phanhoinguoidung">Quản lý đánh giá</Link>
        </Menu.Item>
        <Menu.Item key="" icon={<EditOutlined />}>
          <Link to="/admin/comment/phanhoinguoidung">Quản lý bình luận</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="/admin/bookings" icon={<ShoppingOutlined />}>
        <Link to="/admin/bookings">Bookings</Link>
      </Menu.Item>

      <Menu.Item key="/admin/orders" icon={<FileTextOutlined />}>
        <Link to="/admin/orders">Orders</Link>
      </Menu.Item>
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
            style={{ width: 120, height: 40, objectFit: "contain" }}
          />
        </div>
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="dark"
      width={sidebarWidth}
      collapsedWidth={80}
      breakpoint="lg"
      style={{ minHeight: "100vh" }}
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
      width: 50, // logo to hơn
      height: 50,
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
      StarTicket
    </h2>
  )}
</div>

      {menuContent}
    </Sider>
  );
};

export default SideBar;