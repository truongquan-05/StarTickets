import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ILichChieu } from '../interface/lichchieu';

const BASE_URL = "http://localhost:3000";

interface IPhim {
  id: number;
  ten_phim: string;
}

const fetchLichChieu = async (): Promise<ILichChieu[]> => {
  const res = await axios.get(`${BASE_URL}/lich_chieu`);
  return res.data.data || res.data;
};

const fetchPhim = async (): Promise<IPhim[]> => {
  const res = await axios.get(`${BASE_URL}/phim`);
  return res.data.data || res.data;
};

const LichChieu = () => {
  // Lấy lịch chiếu
  const { data: lichChieu, isLoading, isError } = useQuery({
    queryKey: ['lichChieu'],
    queryFn: fetchLichChieu,
  });

  // Lấy danh sách phim
  const { data: phimList } = useQuery({
    queryKey: ['phim'],
    queryFn: fetchPhim,
  });

  // Hàm tìm tên phim theo phim_id
  const getTenPhim = (phim_id: number) => {
    const phim = phimList?.find(p => p.id === phim_id);
    return phim ? phim.ten_phim : 'Không rõ';
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (isError) return <div>Đã xảy ra lỗi khi tải dữ liệu!</div>;

  const columns: ColumnsType<ILichChieu> = [
    {
      title: 'STT',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Phim',
      dataIndex: 'phim_id',
      key: 'phim_id',
      render: (phim_id: number) => getTenPhim(phim_id),
    },
    {
      title: 'Phòng ID',
      dataIndex: 'phong_id',
      key: 'phong_id',
    },
    {
      title: 'Giờ chiếu / Ngày Chiếu',
      dataIndex: 'gio_chieu',
      key: 'gio_chieu',
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: 'Giờ kết thúc / Ngày Chiếu',
      dataIndex: 'gio_ket_thuc',
      key: 'gio_ket_thuc',
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2>Danh sách lịch chiếu</h2>
      <Table
        columns={columns}
        dataSource={lichChieu}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LichChieu;
