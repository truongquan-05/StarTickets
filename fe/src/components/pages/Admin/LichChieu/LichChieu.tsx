import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, message, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

import { ILichChieu } from "../interface/lichchieu";
import { IPhongChieu } from "../interface/phongchieu";
import { IMovies } from "../interface/movies";

import { useDeleteLichChieu, useListCinemas, useListLichChieu } from "../../../hook/hungHook";
import {
  getListMovies,
  getListPhongChieu,
  getListChuyenNgu,
} from "../../../provider/hungProvider";
import { IChuyenNgu } from "../interface/chuyenngu";
import { DeleteOutlined } from "@ant-design/icons";

const LichChieu = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
   const { mutate: deleteCategoryChair } = useDeleteLichChieu({
        resource: "lich_chieu",
      });
  // Lấy lịch chiếu
  const { data: lichChieuResponse, isLoading, isError } = useListLichChieu({
    resource: "lich_chieu",
  });
  const lichChieu: ILichChieu[] = Array.isArray(lichChieuResponse)
    ? lichChieuResponse
    : [];

  // Lấy danh sách phim
  const { data: phimResponse } = useQuery({
    queryKey: ["phim"],
    queryFn: () => getListMovies({ resource: "phim" }),
  });
  const phimList: IMovies[] = Array.isArray(phimResponse?.data)
    ? phimResponse.data
    : [];

  // Lấy danh sách phòng chiếu
  const { data: phongResponse } = useQuery({
    queryKey: ["phong_chieu"],
    queryFn: () => getListPhongChieu({ resource: "phong_chieu" }),
  });
  const phongList: IPhongChieu[] = Array.isArray(phongResponse?.data)
    ? phongResponse.data
    : [];

  // Lấy danh sách chuyển ngữ
  const { data: chuyenNguResponse } = useQuery({
    queryKey: ["chuyen_ngu"],
    queryFn: () => getListChuyenNgu({ resource: "chuyen_ngu" }),
  });
  const chuyenNguList: IChuyenNgu[] = Array.isArray(chuyenNguResponse?.data)
    ? chuyenNguResponse.data
    : [];

  // Lấy danh sách rạp dùng hook của bạn
  const { data: rapList } = useListCinemas({ resource: "rap" });
  const rapListData = Array.isArray(rapList) ? rapList : [];

  // Hàm lấy tên phim theo id
  const getTenPhim = (phim_id?: number) => {
    if (phim_id == null) return "Không rõ";
    const phim = phimList.find((p) => p.id === phim_id);
    return phim ? phim.ten_phim : "Không rõ";
  };
  

  // Hàm lấy tên phòng theo id
  const getTenPhong = (phong_id?: number) => {
    if (phong_id == null) return "Không rõ";
    const phong = phongList.find((p) => p.id === phong_id);
    return phong ? phong.ten_phong : "Không rõ";
  };

  // Hàm lấy tên chuyển ngữ theo id
  const getTenChuyenNgu = (id?: number) => {
    if (id == null) return "Không rõ";
    const cn = chuyenNguList.find((x) => x.id === id);
    return cn ? cn.the_loai : "Không rõ";
  };

  // Hàm lấy tên rạp theo phong_id
  const getTenRapTheoPhongId = (phong_id?: number) => {
    if (phong_id == null) return "Không rõ";
    const phong = phongList.find((p) => p.id === phong_id);
    if (!phong) return "Không rõ";
    const rap = rapListData.find((r) => r.id === phong.rap_id);
    return rap ? rap.ten_rap : "Không rõ";
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
      title: "Rạp",
      dataIndex: "phong_id",
      key: "rap",
      render: (phong_id?: number) => getTenRapTheoPhongId(phong_id),
    },
    {
      title: "Phòng",
      dataIndex: "phong_id",
      key: "phong_id",
      render: (phong_id?: number) => getTenPhong(phong_id),
    },
    {
      title: "Chuyển Ngữ",
      dataIndex: "chuyen_ngu_id",
      key: "chuyen_ngu",
      render: (id?: number) => getTenChuyenNgu(id),
    },
    {
      title: "Giờ chiếu",
      dataIndex: "gio_chieu",
      key: "gio_chieu",
      render: (value?: string) =>
        value ? new Date(value).toLocaleString() : "Không rõ",
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "gio_ket_thuc",
      key: "gio_ket_thuc",
      render: (value?: string) =>
        value ? new Date(value).toLocaleString() : "Không rõ",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá thể loại này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => {
              deleteCategoryChair(record.id);
              message.success("Xóa thành công")
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
