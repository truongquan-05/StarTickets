import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../provider/duProvider";
import { User } from "../../types/Uses";
import { Link } from "react-router-dom";
import {Table, Button,Popconfirm,Space,Avatar,message,Tag,Card,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";


const ListUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      message.success("Đã xoá thành công");
    } catch (error) {
      message.error("Xoá thất bại, vui lòng thử lại");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (url: string) => <Avatar size="large" src={url} />,
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng hoạt động</Tag>
        ),
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
            okText="Xác nhận"
            cancelText="Huỷ"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách người dùng" bordered={true} style={{ margin: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Link to="/users/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm người dùng
          </Button>
        </Link>

      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có người dùng nào." }}
      />
    </Card>
  );
};

export default ListUser;
