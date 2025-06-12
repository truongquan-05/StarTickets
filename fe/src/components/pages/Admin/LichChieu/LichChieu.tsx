import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DatePicker, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ILichChieu } from "../interface/lichchieu";
import { IPhongChieu } from "../interface/phongchieu";
import dayjs, { Dayjs } from "dayjs";

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

const fetchPhong = async (): Promise<IPhongChieu[]> => {
  const res = await axios.get(`${BASE_URL}/phong_chieu`);
  return res.data.data || res.data;
};

const LichChieu = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const {
    data: lichChieu,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lichChieu"],
    queryFn: fetchLichChieu,
  });

  const { data: phimList } = useQuery({
    queryKey: ["phim"],
    queryFn: fetchPhim,
  });

  const { data: phongList } = useQuery({
    queryKey: ["phong"],
    queryFn: fetchPhong,
  });

  const getTenPhim = (phim_id: number) => {
    const phim = phimList?.find((p) => p.id === phim_id);
    return phim ? phim.ten_phim : "Không rõ";
  };

  const getTenPhong = (phong_id: number) => {
    const phong = phongList?.find((p) => p.id === phong_id);
    return phong ? phong.ten_phong : "Không rõ";
  };

  const filteredLichChieu = lichChieu?.filter((item) => {
    const gioChieuDate = dayjs(item.gio_chieu);
    if (!gioChieuDate.isValid()) {
      return false;
    }
    const sameDay = gioChieuDate.isSame(selectedDate, "day");
    return sameDay;
  });

  const columns: ColumnsType<ILichChieu> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Phim",
      dataIndex: "phim_id",
      key: "phim_id",
      render: (phim_id: number) => getTenPhim(phim_id),
    },
    {
      title: "Phòng",
      dataIndex: "phong_id",
      key: "phong_id",
      render: (phong_id: number) => getTenPhong(phong_id),
    },
    {
      title: "Giờ chiếu",
      dataIndex: "gio_chieu",
      key: "gio_chieu",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "gio_ket_thuc",
      key: "gio_ket_thuc",
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  if (isLoading) return <div>Đang tải...</div>;
  if (isError) return <div>Đã xảy ra lỗi khi tải dữ liệu!</div>;

  return (
    <div>
      <h2>Danh sách lịch chiếu</h2>
      <div style={{ marginBottom: 16 }}>
        <span>Chọn ngày:&nbsp;</span>
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date || dayjs())}
          format="YYYY-MM-DD"
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredLichChieu}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LichChieu;
