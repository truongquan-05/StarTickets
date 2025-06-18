import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  message,
  Space,
  Button,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  Card,
} from "antd";

import { useState } from "react";
import {
  useListCinemas,
  useUpdateCinema,
  useDeleteCinema,
} from "../../hook/thinhHook";
import { ICinemas } from "../Admin/interface/cinemas";

const ListCinemas = () => {
  const [editForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ICinemas | null>(null);

  const { data, isLoading } = useListCinemas({ resource: "rap" });
  const dataSource = data?.data ?? [];
  const { mutate: deleteMutate } = useDeleteCinema({ resource: "rap" });
  const { mutate: updateMutate } = useUpdateCinema({ resource: "rap" });

  const openEditModal = (record: ICinemas) => {
    setEditingItem(record);
    editForm.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    editForm.resetFields();
  };

  const onUpdate = (values: any) => {
    if (!editingItem) return;
    updateMutate(
      { id: editingItem.id, values },
      {
        onSuccess: () => {
          message.success("Cinema updated successfully");
          closeModal();
        },
        onError: () => {
          message.error("Update cinema failed");
        },
      }
    );
  };

  const onDelete = (id: number) => {
    deleteMutate(id);
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <EditOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "ten_rap",
      key: "name",
      width: "35%",
      ...getColumnSearchProps('ten_rap'),
    },
    {
      title: "Address",
      dataIndex: "dia_chi",
      key: "address",
      width: "35%",
      ...getColumnSearchProps('dia_chi'),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      width: "20%",
      render: (_: any, record: ICinemas) => (
        <Space>
          <Button
            title="Edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this cinema?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button title="Delete" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách rạp" bordered={true} style={{ margin: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)',background: "#fff", height: "95%"  }}>
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        bordered
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No cinemas found." }}
      />

      <Modal
        title={`Edit Cinema (ID: ${editingItem?.id ?? ""})`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={onUpdate}
          initialValues={editingItem ?? undefined}
        >
          <Form.Item
            label="Name"
            name="ten_rap"
            rules={[{ required: true, message: "Please enter cinema name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="dia_chi"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default ListCinemas;
