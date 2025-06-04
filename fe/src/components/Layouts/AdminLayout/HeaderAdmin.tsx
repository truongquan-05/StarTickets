import {
  UserOutlined,
  DownOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import ImageMain from "../../../assets/logo.png";
import Flag from "../../../assets/cờ.jpg"
const { Header } = Layout;
const userMenu = (
  <Menu
    items={[
      { key: "1", label: "Profile" },
      { key: "2", label: "Logout" },
    ]}
  />
);
const HeaderAdmin = () => {
  return (
    <Header className="header">
      <div className="header-left">
        <img className="imgMain" src={ImageMain} alt="Logo" />
        <Button id="toggle-btn" type="text" icon={<MenuOutlined />} />
        <div className="search">
          <input className="searchInput" type="text" placeholder="Tìm kiếm ..."/>
          <Button className="button-search" icon={<SearchOutlined/>} htmlType="submit"></Button>
        </div>
      </div>
      <Dropdown overlay={userMenu} placement="bottomRight" arrow>
        <div className="user-info">
          <div className="flag">
            <img src={Flag} alt="" />
          </div>
          <div className="avatar">
            <Avatar icon={<UserOutlined />} />
          <span className="user-name">Wade Warren</span>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderAdmin;
