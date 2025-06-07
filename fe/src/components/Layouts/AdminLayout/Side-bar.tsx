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

  // Tự động tính chiều rộng sidebar theo màn hình
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
        <Menu.Item key="/admin/movies/list">
          <span style={{ marginLeft: 8 }}>•</span>{" "}
          <Link to="/admin/movies/list">Danh Sách Phim</Link>
        </Menu.Item>
        <Menu.Item key="/admin/movies/add">
          <span style={{ marginLeft: 8 }}>•</span>{" "}
          <Link to="/admin/movies/add">Add</Link>
        </Menu.Item>
        <Menu.Item key="/admin/genre"><span style={{ marginLeft: 8 }}>•</span>{" "}
        <Link to="/admin/genre">Thể loại phim</Link>
      </Menu.Item>
      <Menu.Item key="/admin/lichchieu/list"><span style={{ marginLeft: 8 }}>•</span>{" "}
        <Link to="/admin/lichchieu/list">Lịch Chiếu phim</Link>
      </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="chair"
        icon={<TableOutlined />}
        title="Quản Lý Ghế"
      >
        <Menu.Item key="/admin/category_chair/list" >
        <Link to="/admin/category_chair/list">Loại Ghế</Link>
      </Menu.Item>
      </Menu.SubMenu>

      
      <Menu.SubMenu
        key="users"
        icon={<UserOutlined />}
        title="Quản Lý Tài Khoản"
      >
      <Menu.Item key="/admin/users"><span style={{ marginLeft: 8 }}>•</span>{" "}
        <Link to="/admin/users">Tài Khoản</Link>
      </Menu.Item>
      <Menu.Item key="/admin/vaitro"><span style={{ marginLeft: 8 }}>•</span>{" "}
        <Link to="/admin/vaitro">Vai Trò</Link>
      </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="food"
        icon={<GiftOutlined/>}
        title="Dịch vụ và ưu đãi"
      >
        <Menu.Item key="/admin/food">
          <span style={{ marginLeft: 8 }}>•</span>{" "}
          <Link to="/admin/food">Quản lý đồ ăn</Link>
        </Menu.Item>
      </Menu.SubMenu>
      
      <Menu.SubMenu key="cinemas" icon={<BankOutlined />} title="Quản Lý Rạp">
        <Menu.Item key="/admin/cinemas/list">
          <span style={{ marginLeft: 8 }}>•</span>{" "}
          <Link to="/admin/cinemas/list">List</Link>
        </Menu.Item>
        <Menu.Item key="/admin/cinemas/add">
          <span style={{ marginLeft: 8 }}>•</span>{" "}
          <Link to="/admin/cinemas/add">Add</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="/admin/bookings" icon={<TagsOutlined />}>
        <Link to="/admin/bookings">Bookings</Link>
      </Menu.Item>

      <Menu.Item key="/admin/orders" icon={<FileTextOutlined />}>
        <Link to="/admin/orders">Orders</Link>
      </Menu.Item>
    </Menu>
  );

  // Giao diện mobile dùng Drawer
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

  // Giao diện desktop
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
          style={{
            width: collapsed ? 40 : 160, 
            height: collapsed ? 40 : 50, 
            objectFit: "contain",
            transition: "width 0.3s",
            margin: "0 auto",
          }}
        />
      </div>
      {menuContent}
    </Sider>
  );
};

export default SideBar;
