import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../provider/index";
import { User } from "../../types/Uses";
import { Link } from "react-router-dom";
import { Table, Button, Popconfirm, Space, Avatar, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const List = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(res => setUsers(res.data));
  }, []);

  const handleDelete = async (id: number) => {
  try {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
    message.success("Đã xoá  thành công");
  } catch (error) {
    message.error("Xoá thất bại, vui lòng thử lại");
    
    
  }
};

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (url: string) => <Avatar src={url} />,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) => (value ? "✔️" : "❌"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: User) => (
        <Space>
          <Link to={`/users/edit/${record.id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <Link to="/users/add">
        <Button type="primary" style={{ marginBottom: 16, marginLeft: 900 }}>+ Thêm người dùng</Button>
      </Link>
      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có người dùng nào." }}
      />
    </div>
  );
};

export default List;
