import { useEffect, useState } from "react";

import {
  Button,
  message,
  Popconfirm,
  Space,
  Table,
  Card,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IVaiTro } from "../Admin/interface/vaitro";
import {
  useCreateVaiTro,
  useDeleteVaiTro,
  useListVaiTro,
  useUpdateVaiTro,
} from "../../hook/hungHook";

const VaiTro = () => {
  const [form] = Form.useForm();
  const { data } = useListVaiTro({ resource: "vai_tro" });
  const dataSource = data?.data || [];
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IVaiTro | undefined>(
    undefined
  );
  const { mutate: deleteCategoryChair } = useDeleteVaiTro({
    resource: "vai_tro",
  });
  const createOrUpdateOpenModal = (record: IVaiTro | undefined) => {
    setModalOpen(true);
    setEditingItem(record);
  };
  const { mutate: createCategoryChair } = useCreateVaiTro({
    resource: "vai_tro",
  });
  const { mutate: updateCategoryChair } = useUpdateVaiTro({
    resource: "vai_tro",
  });
  const onCreateOrUpdate = (values: IVaiTro) => {
    if (editingItem === undefined) {
      createCategoryChair(values);
    } else {
      updateCategoryChair({ id: editingItem.id, values });
    }
    setModalOpen(false);
    form.resetFields();
  };
  useEffect(() => {
    if (isModalOpen && editingItem) {
      form.setFieldsValue({
        ...editingItem,
      });
    }
  }, [isModalOpen, editingItem]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // width: "10%",
      align: "center" as const,
    },
    {
      title: "Tên Vai Trò",
      dataIndex: "ten_vai_tro",
      key: "name",
      // width: "60%",
    },
    {
      title: "Menu",
      dataIndex: "menu",
      key: "menu",
      width: "30%",
      render: (menu: number) => {
        if (menu === 1) return "Menu Admin";
        if (menu === 4) return "Menu Quản lý";
        if (menu === 3) return "Menu Nhân viên";
      },
    },

    {
      title: "Mô Tả",
      dataIndex: "mo_ta",
      key: "name",
      width: "30%",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            title="Sửa"
            onClick={() => createOrUpdateOpenModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá thể loại này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => {
              deleteCategoryChair(record.id);
              // message.success("Đã xoá thể loại: " + record.ten_vai_tro);
            }}
          >
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              title="Xoá"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Card
      title="Danh sách vai trò"
      bordered={true}
      style={{
        margin: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        background: "#fff",
        height: "95%",
        minWidth: "590px",
      }}
    >
      <div className="btn-category-chair">
        <Button
          className="add-category-chair"
          onClick={() => createOrUpdateOpenModal(undefined)}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <div>
        <Modal
          title={editingItem == undefined ? "Thêm mới" : "Cập nhật"}
          open={isModalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={(values) => {
              onCreateOrUpdate(values);
            }}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="ten_vai_tro"
              rules={[
                { required: true, message: "Vui lòng nhập tên vai trò!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Menu"
              name="menu"
              rules={[{ required: true, message: "Vui lòng chọn menu!" }]}
            >
              <Select placeholder="Chọn menu">
                {[
                  { value: 1, label: "Menu Admin" },
                  { value: 4, label: "Menu Quản lý" },
                  { value: 3, label: "Menu Nhân viên" },
                ].map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Mô Tả" name="mo_ta">
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              {editingItem == undefined ? "Lưu" : "Sửa"}
            </Button>
          </Form>
        </Modal>
      </div>
    </Card>
  );
};

export default VaiTro;
