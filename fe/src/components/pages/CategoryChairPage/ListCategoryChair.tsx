import React from 'react';
import { useDeleteCategoryChair, useListCategoryChair } from '../../hook/hungHook';
import { Button, message, Popconfirm, Space, Table, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ListCategoryChair = () => {
  const { data } = useListCategoryChair({ resource: "loai_ghe" });
  const { mutate: deleteCategoryChair } = useDeleteCategoryChair({
      resource: "loai_ghe",
    });
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
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ListCategoryChair;
