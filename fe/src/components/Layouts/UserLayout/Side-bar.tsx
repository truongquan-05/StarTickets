import { HomeOutlined, ShoppingCartOutlined, ProjectOutlined, DashboardFilled, DashboardOutlined, DownOutlined, RightOutlined, HomeFilled, ProductFilled, ProductOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import React from "react";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const SideBar = () => {
  return (
    <Sider width={220} className="sider">
      <Menu className="menu" mode="inline" defaultSelectedKeys={['dashboard']} style={{ width: 220 }}>
        <Menu.Item key="dashboard" style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>< HomeOutlined style={{padding:'10px', fontSize: '17px'}}/> <Link to={""}>Dashboard</Link></Menu.Item>
      <SubMenu key="movies" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><ProductOutlined style={{padding:'10px', fontSize: '17px'}}/> Movies </span>}>
        <Menu.Item key="list"><Link to={"/movies/list"}>Movies List</Link></Menu.Item>
        <Menu.Item key="add-movies">Add New Products</Menu.Item>
      </SubMenu>
      <SubMenu key="category" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><AppstoreOutlined style={{padding:'10px', fontSize: '17px'}}/> Category</span>}>
        <Menu.Item key="electronics">Electronics</Menu.Item>
        <Menu.Item key="fashion">Fashion</Menu.Item>
      </SubMenu>
    </Menu>

    </Sider>
  );
};

export default SideBar;
