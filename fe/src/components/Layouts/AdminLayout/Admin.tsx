import { Layout } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './Side-bar';
import HeaderAdmin from './HeaderAdmin';
import FooterAdmin from './FooterAdmin';

const { Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

const sidebarWidth = 250;

return (
  <Layout style={{ minHeight: '100vh' }}>
    <SideBar
      collapsed={collapsed}
      onCollapse={setCollapsed}
      drawerVisible={drawerVisible}
      setDrawerVisible={setDrawerVisible}
    />
    <Layout
      style={{
        marginLeft: collapsed ? 80 : sidebarWidth,
        transition: 'all 0.2s',
      }}
    >
      <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      <Content style={{ margin: '86px 16px 16px 16px' }}>
        <Outlet />
      </Content>
      <FooterAdmin />
    </Layout>
  </Layout>
);

};

export default AdminLayout;