// src/Layouts/AdminLayout/HeaderAdmin.tsx
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Button,
  Space,
  Avatar,
  Typography,
  Dropdown,
  theme as antdTheme,
  Menu,
} from "antd";
import axios from "axios";
import "./Header.css";
import { useEffect, useState } from "react";

const { Header } = Layout;
const { Text } = Typography;

const HeaderAdmin = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { token } = antdTheme.useToken();

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const getVaiTroById = async (id: any) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://127.0.0.1:8000/api/lay-vaitro/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [vaiTro, setVaiTro] = useState("");

  useEffect(() => {
    const fetchVaiTro = async () => {
      try {
        const res = await getVaiTroById(storedUser.vai_tro_id);
        setVaiTro(res.data.ten_vai_tro); // hoặc data.name tuỳ theo API trả về
      } catch (error) {
        console.error("Lỗi lấy vai trò:", error);
      }
    };

    if (storedUser.vai_tro_id) {
      fetchVaiTro();
    }
  }, [storedUser.vai_tro_id]);
  const user = {
    name: storedUser.ten || "",
    role: vaiTro || "Admin",
    avatar: storedUser.anh_dai_dien || "",
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://127.0.0.1:8000/api/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  const sidebarWidth = 250;
  // Menu vẫn như cũ
  const accountMenu = (
    <Menu
      className="custom-dropdown-menu"
      items={[
        {
          key: "1",
          label: (
            <a style={{ color: "black" }} href="/admin/profile">
              Thông tin cá nhân
            </a>
          ),
        },
        {
          key: "2",
          label: (
            <span onClick={logout} style={{ color: "red" }}>
              Đăng xuất
            </span>
          ),
        },
      ]}
    />
  );

  return (
    <Header
      style={{
        position: "fixed",
        left: collapsed ? 80 : sidebarWidth,
        right: 0,
        top: 0,
        height: 70,
        zIndex: 1000,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: token.colorBgContainer,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{ fontSize: 20 }}
      />
      <Space size="middle">
        <Button
          type="text"
          icon={
            isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
          onClick={toggleFullScreen}
          style={{ fontSize: 20 }}
        />

        <Dropdown overlay={accountMenu} placement="bottomRight">
          <Space>
            <Avatar
              icon={<UserOutlined />}
              src={
                user?.avatar?.startsWith("http")
                  ? user.avatar
                  : `http://127.0.0.1:8000/storage/${user?.avatar}`
              }
              style={{ backgroundColor: "#87d068" }}
            />

            <div style={{ lineHeight: 1 }}>
              <Text strong>Xin chào: {user.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.role}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderAdmin;
