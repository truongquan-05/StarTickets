import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Content, Footer } from 'antd/es/layout/layout'
import HeaderUser from './HeaderUser'
import FooterUser from './FooterUser'
import '../../assets/css/indexUser.css'

const User = () => {
  return (
    <Layout className="main-layout">
      <HeaderUser/>
        <Layout>
          <Content>
            <Outlet />
          </Content>
        </Layout>
        <FooterUser/>
    </Layout>
  )
}

export default User