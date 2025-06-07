import {
  Table,
  Button,
  Popconfirm,
  Space,
  message,
  Tag,
  Card,
  Typography,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import {
  CloseCircleFilled,
  DeleteOutlined,
  EyeFilled,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import { User } from "../../types/Uses";
import {
  useCreateUser,
  useDeleteUser,
  useListUsers,
  useListVaiTro,
  useUpdateUser,
} from "../../hook/duHook";

import { useEffect, useState } from "react";

const { Title } = Typography;

const UserList = () => {
  // Lấy dữ liệu người dùng
  const { data, isLoading, refetch } = useListUsers({ resource: "nguoi_dung" });
  const dataSource = data?.data || [];

  // Lấy dữ liệu vai trò từ hook useListVaiTro
  const { data: rolesData, isLoading: rolesLoading } = useListVaiTro({
    resource: "vai_tro",
  });
  const roles = rolesData?.data || [];

  // Xoá người dùng
  const { mutate: deleteUser } = useDeleteUser({ resource: "nguoi_dung" });
  const handleDelete = async (id: number) => {
    try {
      deleteUser(id, {
        onSuccess: () => {
          message.success("Xoá người dùng thành công");
          refetch();
        },
        onError: () => {
          message.error("Xoá thất bại, vui lòng thử lại");
        },
      });
    } catch (error) {
      message.error("Xoá thất bại, vui lòng thử lại");
      console.log(error);
    }
  };

  // Modal và form
  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | undefined>(undefined);

  const createOrUpdateOpenModal = (record: User | undefined) => {
    setModalOpen(true);
    setEditingItem(record);

    if (!record) {
      form.resetFields();
    }
  };

  const { mutate: createUser } = useCreateUser({ resource: "nguoi_dung" });

  const onCreateOrUpdate = (values: User) => {
    if (!editingItem) {
      createUser(values, {
        onSuccess: () => {
          message.success("Thêm mới thành công");
          setModalOpen(false);
          form.resetFields();
          refetch();
        },
        onError: (error) => {
          message.error("Thêm mới thất bại");
          console.log(error);
        },
      });
    }
  };
  const { mutate: updateUser } = useUpdateUser({ resource: "nguoi_dung" });
  const handleToggleStatus = (user: User) => {
    const updatedUser = {
      ...user,
      trang_thai: !user.trang_thai, // toggle trạng thái
    };

    updateUser(
      { id: user.id, values: updatedUser },
      {
        onSuccess: () => {
          message.success(
            `Đã ${updatedUser.trang_thai ? "kích hoạt" : "khóa"} người dùng`
          );
          refetch();
        },
        onError: () => {
          message.error("Cập nhật trạng thái thất bại");
        },
      }
    );
  };

  useEffect(() => {
    if (isModalOpen && editingItem) {
      form.setFieldsValue({
        ...editingItem,
      });
    }
  }, [isModalOpen, editingItem]);

  // Map vai trò id sang tên để hiển thị trong bảng
  const roleMap = roles.reduce((acc: Record<number, string>, role: any) => {
    acc[role.id] = role.ten_vai_tro;
    return acc;
  }, {});

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "so_dien_thoai", key: "so_dien_thoai" },
    {
      title: "Role",
      dataIndex: "vai_tro_id",
      key: "vai_tro_id",
      render: (roleId: number) => roleMap[roleId] || "Chưa có",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
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
          <Button
            danger={record.trang_thai}
            type={record.trang_thai ? "default" : "primary"}
            icon={
              record.trang_thai ? <CloseCircleFilled /> : <UnlockOutlined />
            }
            onClick={() => handleToggleStatus(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xác nhận"
            cancelText="Huỷ"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="primary"
            icon={<EyeFilled />}
            onClick={() => createOrUpdateOpenModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: "15px" }}>
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => createOrUpdateOpenModal(undefined)}
        />
      </div>

      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có người dùng nào." }}
        loading={isLoading || rolesLoading}
      />

      <Modal
        title={editingItem ? "Chi tiết người dùng" : "Thêm người dùng"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={onCreateOrUpdate} layout="vertical">
          <Form.Item
            label="Tên"
            name="ten"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="SĐT" name="so_dien_thoai">
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={
              editingItem
                ? []
                : [
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                  ]
            }
            hidden={!!editingItem} // Ẩn nếu đang sửa hoặc xem chi tiết
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="trang_thai"
            initialValue={true}
            rules={
              editingItem
                ? []
                : [{ required: true, message: "Vui lòng chọn trạng thái" }]
            }
            hidden={!!editingItem}
          >
            <Select>
              <Select.Option value={true}>Kích hoạt</Select.Option>
              <Select.Option value={false}>Khóa</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="vai_tro_id"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              loading={rolesLoading}
              allowClear
            >
              {roles.map((role: any) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.ten_vai_tro}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserList;
