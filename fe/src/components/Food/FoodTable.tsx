import { Table, Button, Popconfirm } from 'antd';
import { Food } from '../types/Uses'; // chỉnh lại nếu path khác
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
    title: 'Hình ảnh',
    dataIndex: 'hinh_anh',
    render: (url?: string) =>
      url ? (
        <img src={url} alt="Hình ảnh món ăn" style={{ width: 80, height: 80, objectFit: 'cover' }} />
      ) : (
        'Không có ảnh'
      ),
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
      render: (value?: number) =>
        value !== undefined && value !== null ? `${value.toLocaleString()} ₫` : 'N/A',
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'so_luong_ton',
      render: (value?: number) =>
        value !== undefined && value !== null ? value.toString() : 'N/A',
    },
    {
      title: 'Hành động',
      render: (_: any, record: Food) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record.id)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa món ăn này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={foods} />;
};

export default FoodTable;
