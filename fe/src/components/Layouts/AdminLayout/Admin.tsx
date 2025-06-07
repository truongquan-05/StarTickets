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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
        onToggleDrawer={() => setDrawerVisible(!drawerVisible)}
      />
      <Layout>
        <HeaderAdmin
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          // onToggleDrawer={() => setDrawerVisible(!drawerVisible)}
        />
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
        <FooterAdmin />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
