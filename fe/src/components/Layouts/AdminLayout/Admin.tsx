import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout, { Content } from 'antd/es/layout/layout';
import SideBar from './Side-bar';
import '../../assets/css/indexAdmin.css';
import HeaderAdmin from './HeaderAdmin';

const Admin: React.FC = () => {
  return (
    <Layout className="main-layout">
      <HeaderAdmin/>
      <Layout>
        <SideBar  />
        <Layout style={{ padding: '16px' }}>
          <Content className="content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Admin;