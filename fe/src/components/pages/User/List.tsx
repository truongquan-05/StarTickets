import {Table, Button,Popconfirm,Space,Avatar,message,Tag,Card,Typography,
} from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import { User } from "../../types/Uses";
import { useDeleteUser, useListUsers } from "../../hook/duHook";

const { Title } = Typography;

const List = () => {
  const { data, isLoading } = useListUsers({ resource: "users" });
  const { mutate: deleteUser } = useDeleteUser({ resource: "users" });
  

  const handleDelete = async (id: number) => {
    try {
          deleteUser(id, {
            onSuccess: () => {
              message.success(`Deleted user success`);
            },
            onError: () => {
              message.error("Delete user failed");
            },
          });
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
          <Link to={`/admin/users/edit/${record.id}`}>
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
    <Card style={{ margin: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
           Danh sách người dùng
        </Title>
        <Link to="/admin/users/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm người dùng
          </Button>
        </Link> 
      </div>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có người dùng nào." }}
      />
    </Card>
  );
};

export default List;
