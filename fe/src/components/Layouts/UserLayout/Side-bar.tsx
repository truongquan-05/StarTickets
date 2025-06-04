import { HomeOutlined, ProductOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const SideBar = ({ setSelectedMenu }: { setSelectedMenu: (menu: string) => void }) => {
  return (
    <Sider width={220} className="sider">
      <Menu className="menu" mode="inline" defaultSelectedKeys={['dashboard']} style={{ width: 220 }} onClick={({ key }) => setSelectedMenu(key)}>
        <Menu.Item key="Dashboard" style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>< HomeOutlined style={{padding:'10px', fontSize: '17px'}}/> <Link to={""}>Dashboard</Link></Menu.Item>
        <SubMenu key="users" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><AppstoreOutlined style={{padding:'10px', fontSize: '17px'}}/>Người dùng</span>}>
        <Menu.Item key="Users List"><Link to={"/users"}>Quản lý người dùng</Link></Menu.Item>
        
      </SubMenu>
       <SubMenu key="genre" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><ProductOutlined style={{padding:'10px', fontSize: '17px'}}/> Thể loại </span>}>
        <Menu.Item key="Genre List"><Link to={"/movies/genre"}>Danh sách thể loại</Link></Menu.Item>
        </SubMenu>
      <SubMenu key="movies" title={<span style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}><ProductOutlined style={{padding:'10px', fontSize: '17px'}}/> Phim </span>}>
        <Menu.Item key="List Movies"><Link to={"/movies/list"}>List Movies</Link></Menu.Item>
        <Menu.Item key="Add New Movies"><Link to={"/movies/add"}>Add New Movies</Link></Menu.Item>
      </SubMenu>
    </Menu>

    </Sider>
  );
};

export default SideBar;
