import { Table, Switch, Button, Popconfirm } from 'antd';
import { Food } from '../types/Uses';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  foods: Food[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const FoodTable: React.FC<Props> = ({ onEdit, onDelete }) => {
  const [food, setFoods] = useState<Food[]>([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/do_an')
      .then(res => {
        setFoods(res.data.data);
      })
      .catch(err => {
        console.error('Lỗi lấy dữ liệu:', err);
      });
  }, []);
  
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'Tên đồ ăn',
      dataIndex: 'ten_do_an',
    },
    {
      title: 'Mô tả',
      dataIndex: 'mo_ta',
    },
    {
      title: 'Giá',
      dataIndex: 'gia',
      render: (value: number) => `${value} ₫`,
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'so_luong_ton',
      render: (value: number) => `${value}`,
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

  return <Table rowKey="id" columns={columns} dataSource={food} />;
};

export default FoodTable;