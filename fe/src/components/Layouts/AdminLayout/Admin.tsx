import React, { useState } from 'react';
import HeaderUser from './HeaderUser';
import { Outlet } from 'react-router-dom';
import Layout, { Content } from 'antd/es/layout/layout';
import SideBar from './Side-bar';
import '../../assets/css/indexAdmin.css';

const User: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("");
  return (
    <Layout className="main-layout">
      <HeaderUser/>
      <Layout>
        <SideBar setSelectedMenu={setSelectedMenu}  />
        <Layout style={{ padding: '16px' }}>
          <Content className="content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default User;