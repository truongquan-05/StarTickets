import React, { useEffect, useState } from 'react';
import { useCreateCategoryChairs, useDeleteCategoryChair, useListCategoryChair, useUpdateCategoryChair } from '../../hook/hungHook';
import { Button, message, Popconfirm, Space, Table, Card, Form, Select, Input, InputNumber, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ICategoryChair } from '../interface/categoryChair';

const ListCategoryChair = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { data } = useListCategoryChair({ resource: "loai_ghe" });
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ICategoryChair | undefined>(undefined);
  const { mutate: deleteCategoryChair } = useDeleteCategoryChair({
      resource: "loai_ghe",
    });
  const createOrUpdateOpenModal = (record: ICategoryChair | undefined) => {
      setModalOpen(true);
      setEditingItem(record);
    };
  const { mutate: createCategoryChair } = useCreateCategoryChairs({ resource: "loai_ghe" });
  const { mutate: updateCategoryChair } = useUpdateCategoryChair({ resource: "loai_ghe" });
  const onCreateOrUpdate = (values: ICategoryChair) => {
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
            ...editingItem
          });
        }
      }, [isModalOpen, editingItem]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      align: "center" as const,
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
      width: "60%",
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
            onClick={()=>createOrUpdateOpenModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá thể loại này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => {
              deleteCategoryChair(record.id);
              message.success("Đã xoá thể loại: " + record.name);
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
    <Card title="Danh sách thể loại ghế" style={{ margin: '20px' }}>
      <div className='btn-category-chair'><Button className="add-category-chair" onClick={()=>createOrUpdateOpenModal(undefined)}>Thêm mới</Button></div>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <div>
        <Modal
        title={"Category Chair Detail"}
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
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên loại ghế!" }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editingItem == undefined ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Form>
      </Modal>
      </div>
    </Card>
  );
};

export default ListCategoryChair;
