import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  message,
  Typography,
  Space,
  Button,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
} from "antd";
import React, { useState } from "react";

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

  const { data, isLoading } = useListCinemas({ resource: "cinemas" });
  const { mutate: deleteMutate } = useDeleteCinema({ resource: "cinemas" });
  const { mutate: updateMutate } = useUpdateCinema({ resource: "cinemas" });

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

  const onDelete = (id: number, name: string) => {
    deleteMutate(id, {
      onSuccess: () => {
        message.success(`Deleted cinema: ${name}`);
      },
      onError: () => {
        message.error("Delete cinema failed");
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "35%",
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      width: "15%",
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
            onConfirm={() => onDelete(record.id, record.name)}
          >
            <Button title="Delete" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card card-table">
              <div className="card-body">
                <div className="title-header option-title d-sm-flex d-block">
                  <h5>Cinemas List</h5>
                  <div className="right-options">
                    <Space>
                      <Button icon={<ExportOutlined />} className="btn-export" />
                    </Space>
                  </div>
                </div>

                <div className="table-container">
                  <div className="table-responsive">
                    <Table
                      rowKey="id"
                      dataSource={data}
                      columns={columns}
                      loading={isLoading}
                      bordered
                      pagination={{ pageSize: 5 }}
                      locale={{ emptyText: "No cinemas found." }}
                    />
                  </div>
                </div>

                {/* Modal chỉnh sửa */}
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
                      name="name"
                      rules={[
                        { required: true, message: "Please enter cinema name" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[
                        { required: true, message: "Please enter address" },
                      ]}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCinemas;
