import { HomeOutlined, ShoppingCartOutlined, ProjectOutlined, DashboardFilled, DashboardOutlined, DownOutlined, RightOutlined, HomeFilled, ProductFilled, ProductOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import React from "react";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const SideBar = ({ setSelectedMenu }: { setSelectedMenu: (menu: string) => void }) => {
  return (
    <Sider width={220} className="sider">
      <Menu className="menu" mode="inline" defaultSelectedKeys={['dashboard']} style={{ width: 220 }} onClick={({ key }) => setSelectedMenu(key)}>
        <Menu.Item key="Dashboard" style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>< HomeOutlined style={{padding:'10px', fontSize: '17px'}}/> <Link to={""}>Dashboard</Link></Menu.Item>
      <SubMenu key="movies" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><ProductOutlined style={{padding:'10px', fontSize: '17px'}}/> Movies </span>}>
        <Menu.Item key="Genre List"><Link to={"/movies/genres"}>Genre List</Link></Menu.Item>
        <Menu.Item key="Genre Add "><Link to={"/movies/genres/add"}>Genre Add</Link></Menu.Item>
        <Menu.Item key="List Movies"><Link to={"/movies/list"}>List Movies</Link></Menu.Item>
        <Menu.Item key="Add New Movies"><Link to={"/movies/add"}>Add New Movies</Link></Menu.Item>
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
