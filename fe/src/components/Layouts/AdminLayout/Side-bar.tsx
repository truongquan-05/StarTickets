import { HomeOutlined, ShoppingCartOutlined, ProjectOutlined, DashboardFilled, DashboardOutlined, DownOutlined, RightOutlined, HomeFilled, ProductFilled, ProductOutlined, AppstoreOutlined, AppstoreFilled } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import React from "react";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const SideBar = ({ setSelectedMenu }: { setSelectedMenu: (menu: string) => void }) => {
  return (
    <Sider width={220} className="sider">
      <Menu className="menu" mode="inline" defaultSelectedKeys={['dashboard']} style={{ width: 220 }} onClick={({ key }) => setSelectedMenu(key)}>
        <Menu.Item key="Dashboard" style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>< HomeOutlined style={{padding:'10px', fontSize: '17px'}}/> <Link to={""}>Trang Chủ</Link></Menu.Item>
      <SubMenu key="movies" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><ProductOutlined style={{padding:'10px', fontSize: '17px'}}/> Phim </span>}>
        <Menu.Item key="Danh sách"><Link to={"/movies/list"}>Danh sách</Link></Menu.Item>
        <Menu.Item key="Thêm mới"><Link to={"/movies/add"}>Thêm mới</Link></Menu.Item>
      </SubMenu>
      <SubMenu key="category" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><AppstoreOutlined style={{padding:'10px', fontSize: '17px'}}/> Thể Loại</span>}>
        <Menu.Item key="Danh sách"><Link to={"/category_chair/list"}>Thể loại ghế</Link></Menu.Item>
      </SubMenu>
    </Menu>

    </Sider>
  );
};

export default SideBar;
