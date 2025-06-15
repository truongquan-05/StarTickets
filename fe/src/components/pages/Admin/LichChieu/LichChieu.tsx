import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

import { ILichChieu } from "../interface/lichchieu";
import { IPhongChieu } from "../interface/phongchieu";
import { IMovies } from "../interface/movies";
import { useListLichChieu } from "../../../hook/hungHook";
import { getListMovies, getListPhongChieu } from "../../../provider/hungProvider";

const LichChieu = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // Lấy lịch chiếu - giả sử useListLichChieu trả về phân trang { data: ILichChieu[], ... }
  const { data: lichChieuResponse, isLoading, isError } = useListLichChieu({ resource: "lich_chieu" });

  // Lấy mảng lịch chiếu thực tế
  const lichChieu: ILichChieu[] = Array.isArray(lichChieuResponse?.data)
    ? lichChieuResponse.data
    : [];

  // Lấy danh sách phim - giả sử API trả về { data: IMovies[], ... }
  const { data: phimResponse } = useQuery({
    queryKey: ["phim"],
    queryFn: () => getListMovies({ resource: "phim" }),
  });

  const phimList: IMovies[] = Array.isArray(phimResponse?.data)
    ? phimResponse.data
    : [];

  // Lấy danh sách phòng chiếu - giả sử API trả về { data: IPhongChieu[], ... }
  const { data: phongResponse } = useQuery({
    queryKey: ["phong_chieu"],
    queryFn: () => getListPhongChieu({ resource: "phong_chieu" }),
  });

  const phongList: IPhongChieu[] = Array.isArray(phongResponse?.data)
    ? phongResponse.data
    : [];

  // Lấy tên phim theo id
  const getTenPhim = (phim_id?: number) => {
    if (phim_id == null) return "Không rõ";
    const phim = phimList.find((p) => p.id === phim_id);
    return phim ? phim.ten_phim : "Không rõ";
  };

  // Lấy tên phòng theo id
  const getTenPhong = (phong_id?: number) => {
    if (phong_id == null) return "Không rõ";
    const phong = phongList.find((p) => p.id === phong_id);
    return phong ? phong.ten_phong : "Không rõ";
  };

  // Lọc lịch chiếu theo ngày đã chọn
  const filteredLichChieu = lichChieu.filter((item) => {
    if (!item.gio_chieu) return false;
    const gioChieuDate = dayjs(item.gio_chieu);
    return gioChieuDate.isValid() && gioChieuDate.isSame(selectedDate, "day");
  });

  // Cột bảng
  const columns: ColumnsType<ILichChieu> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    {
      title: "Phim",
      dataIndex: "phim_id",
      key: "phim_id",
      render: (phim_id?: number) => getTenPhim(phim_id),
    },
    {
      title: "Phòng",
      dataIndex: "phong_id",
      key: "phong_id",
      render: (phong_id?: number) => getTenPhong(phong_id),
    },
    {
      title: "Chuyển Ngữ",
      dataIndex: "chuyen_ngu",
      key: "chuyen_ngu",
      render: (value?: string) => value || "Không rõ",
    },
    {
      title: "Giờ chiếu",
      dataIndex: "gio_chieu",
      key: "gio_chieu",
      render: (value?: string) => (value ? new Date(value).toLocaleString() : "Không rõ"),
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "gio_ket_thuc",
      key: "gio_ket_thuc",
      render: (value?: string) => (value ? new Date(value).toLocaleString() : "Không rõ"),
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
          disabledDate={(current) => current && current < dayjs().startOf("day")}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredLichChieu}
        rowKey={(record) => record.id?.toString() || Math.random().toString()}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LichChieu;
