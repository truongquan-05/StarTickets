// src/Layouts/AdminLayout/HeaderAdmin.tsx
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
  ScanOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Button,
  Space,
  Avatar,
  Typography,
  Dropdown,
  theme as antdTheme,
  Menu,
} from 'antd';
import { useState } from 'react';

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
  const [darkMode, setDarkMode] = useState(false);
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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  const user = {
    name: 'Nguyễn Văn A',
    role: 'Quản trị viên',
    avatar: '',
  };

  const accountMenu = (
    <Menu
      items={[
        { key: '1', label: 'Thông tin cá nhân' },
        { key: '2', label: 'Đăng xuất' },
      ]}
    />
  );

  return (
    <Header
      style={{
        padding: '0 16px',
        background: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{ fontSize: 20 }}
      />
      <Space size="middle">
        <Button type="text" icon={<ScanOutlined />} style={{ fontSize: 20 }}/>
        <Button
          type="text"
          icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullScreen}
          style={{ fontSize: 20 }}
        />
        <Button
          type="text"
          icon={darkMode ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleDarkMode}
          style={{ fontSize: 20 }}
        />
        <Dropdown overlay={accountMenu} placement="bottomRight">
          <Space>
            <Avatar
              icon={<UserOutlined />}
              src={user.avatar}
              style={{ backgroundColor: '#87d068' }}
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
