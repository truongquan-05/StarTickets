import { Table, Switch, Button, Popconfirm } from 'antd';
import { Food } from '../types/Uses';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
  foods: Food[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const FoodTable: React.FC<Props> = ({ foods, onEdit, onDelete }) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'Tên đồ ăn',
      dataIndex: 'name',
    },
    {
      title: 'Loại đồ ăn',
      dataIndex: 'type',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (url: string) => <img src={url} alt="food" width={50} />,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (value: number) => `${value} ₫`,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'status',
      render: (active: boolean) => <Switch checked={active} disabled />,
    },
    {
      title: 'Action',
      render: (_: any, record: Food) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record.id)} style={{ marginRight: 8 }} />
          <Popconfirm title="Bạn có muốn xóa nó không?" onConfirm={() => onDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={foods} />;
};

export default FoodTable;