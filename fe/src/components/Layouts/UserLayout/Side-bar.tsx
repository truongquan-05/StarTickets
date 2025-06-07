import { HomeOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const SideBar = ({ setSelectedMenu }: { setSelectedMenu: (menu: string) => void }) => {
  return (
    <Sider width={220} className="sider">
      <Menu className="menu" mode="inline" defaultSelectedKeys={['dashboard']} style={{ width: 220 }} onClick={({ key }) => setSelectedMenu(key)}>
        <Menu.Item key="Dashboard" style={{color:'#43b9b2',fontFamily:'"Outfit", sans-serif',fontWeight:'600'}}>< HomeOutlined style={{padding:'10px', fontSize: '17px'}}/> <Link to={""}>Dashboard</Link></Menu.Item>
    </Menu>

    </Sider>
  );
};

export default SideBar;
