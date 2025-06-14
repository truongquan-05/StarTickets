import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IGhe } from "../interface/ghe";
import { useListCategoryChair, useListChair, useListGhe, useListPhongChieu } from "../../../hook/hungHook";
import { ICategoryChair } from "../interface/categoryChair";
import { IPhongChieu } from "../interface/phongchieu";

const Chair = () => {
  // Danh sách ghế
  const { data: gheResponse, isLoading, isError } = useListChair({ resource: "ghe" });
  console.log("Ghe response:", gheResponse);
  const gheList: IGhe[] = gheResponse?.data || [];

  // Danh sách phòng chiếu
  const { data: phongResponse } = useListPhongChieu({ resource: "phong_chieu" });
  console.log("Phong response:", phongResponse);
  const phongList: IPhongChieu[] = phongResponse?.data || [];

  // Danh sách loại ghế
  const { data: loaiGheResponse } = useListCategoryChair({ resource: "loai_ghe" });
  console.log("Loai ghe response:", loaiGheResponse);
  const loaiGheList: ICategoryChair[] = loaiGheResponse?.data || [];

  // Hàm lấy tên phòng
  const getTenPhong = (phong_id?: number) => {
    const phong = phongList.find((p) => p.id === phong_id);
    return phong ? phong.ten_phong : "Không rõ";
  };

  // Hàm lấy tên loại ghế
  const getTenLoaiGhe = (loai_ghe_id?: number) => {
    const loai = loaiGheList.find((l) => l.id === loai_ghe_id);
    return loai ? loai.ten_loai_ghe : "Không rõ";
  };

  // Cột bảng
  const columns: ColumnsType<IGhe> = [
    {
      title: "STT",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    {
      title: "Phòng",
      dataIndex: "phong_id",
      key: "phong_id",
      render: (phong_id: number) => getTenPhong(phong_id),
    },
    {
      title: "Loại Ghế",
      dataIndex: "loai_ghe_id",
      key: "loai_ghe_id",
      render: (loai_ghe_id: number) => getTenLoaiGhe(loai_ghe_id),
    },
    {
      title: "Số Ghế",
      dataIndex: "so_ghe",
      key: "so_ghe",
    },
    {
      title: "Hàng",
      dataIndex: "hang",
      key: "hang",
    },
    {
      title: "Cột",
      dataIndex: "cot",
      key: "cot",
    },
    
  ];

  if (isLoading) return <div>Đang tải danh sách ghế...</div>;
  if (isError) return <div>Đã xảy ra lỗi khi tải danh sách ghế.</div>;

  return (
    <div>
      <h2>Danh sách ghế</h2>
      <Table
        dataSource={gheList}
        columns={columns}
        rowKey={(record) => record.id.toString()}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Chair;
