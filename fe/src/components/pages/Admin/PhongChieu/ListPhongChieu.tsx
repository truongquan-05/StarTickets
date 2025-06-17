import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IPhongChieu } from "../interface/phongchieu";
import {
  getListCinemas,
  getListPhongChieu,
} from "../../../provider/hungProvider";
import { useListGhe } from "../../../hook/hungHook";
import SoDoGhe from "./SoDoGhe";

interface IRap {
  id: number;
  ten_rap: string;
}

const ListPhongChieu = () => {
  const [open, setOpen] = useState(false);
  const [selectedPhong, setSelectedPhong] = useState<IPhongChieu | null>(null);

  // Lấy danh sách phòng chiếu
  const {
    data: phongChieuData = [],
    isLoading: isLoadingPhong,
    isError: isErrorPhong,
  } = useQuery({
    queryKey: ["phong_chieu"],
    queryFn: () =>
      getListPhongChieu({ resource: "phong_chieu" }).then(
        (res) => (Array.isArray(res.data) ? res.data : []) // ✅ luôn trả về mảng
      ),
  });

  // Lấy danh sách rạp
  const {
    data: rapData = [],
    isLoading: isLoadingRap,
    isError: isErrorRap,
  } = useQuery({
    queryKey: ["rap"],
    queryFn: () => getListCinemas({ resource: "rap" }).then((res) => res.data),
  });

  // Dùng hook lấy danh sách ghế theo phòng
  const {
    data: danhSachGhe = [],
    isLoading: isLoadingGhe,
    isError: isErrorGhe,
  } = useListGhe({
    resource: "ghe",
    phong_id: selectedPhong?.id,
  });

  if (isLoadingPhong || isLoadingRap)
    return <div style={{ padding: 20, fontSize: 16 }}>Đang tải dữ liệu...</div>;

  if (isErrorPhong || isErrorRap)
    return (
      <div style={{ padding: 20, fontSize: 16, color: "red" }}>
        Đã xảy ra lỗi khi tải dữ liệu!
      </div>
    );

  const rapMap = new Map<number, string>();
  rapData.forEach((r: IRap) => {
    rapMap.set(r.id, r.ten_rap);
  });

  const openModal = (phong: IPhongChieu) => {
    setSelectedPhong(phong);
    setOpen(true);
  };

  const columns: ColumnsType<IPhongChieu> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Tên Rạp",
      dataIndex: "rap_id",
      key: "rap_id",
      align: "center",
      render: (rap_id: number) =>
        rapMap.get(rap_id) || `Không có rạp ID ${rap_id}`,
    },
    {
      title: "Tên phòng",
      dataIndex: "ten_phong",
      key: "ten_phong",
    },
    {
      title: "Loại sơ đồ",
      dataIndex: "loai_so_do",
      key: "loai_so_do",
      align: "center",
    },
    {
      title: "Hàng thường",
      dataIndex: "hang_thuong",
      key: "hang_thuong",
      align: "center",
    },
    {
      title: "Hàng VIP",
      dataIndex: "hang_vip",
      key: "hang_vip",
      align: "center",
    },
    {
      title: "Hàng Đôi",
      dataIndex: "hang_doi",
      key: "hang_doi",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_text, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Xem chi tiết ghế
        </Button>
      ),
    },
  ];

  // ✅ Tính toán chiều rộng modal theo số ghế mỗi hàng

  return (
    <>
      <Table
        dataSource={phongChieuData}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={`Danh sách ghế phòng: ${selectedPhong?.ten_phong || ""} - ${
          selectedPhong ? rapMap.get(selectedPhong.rap_id) : ""
        }`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
        bodyStyle={{
          display: "flex",
          flexDirection: "column", // xếp dọc: sơ đồ ghế trên, chú thích dưới
          alignItems: "center",
          padding: 16,
          overflow: "visible",
        }}
        style={{ top: 50 }}
      >
        <SoDoGhe
          phongId={selectedPhong?.id || null}
          loaiSoDo={selectedPhong?.loai_so_do}
          danhSachGhe={danhSachGhe}
          isLoadingGhe={isLoadingGhe}
          isErrorGhe={isErrorGhe}
        />

        {/* Phần chú thích dàn hàng ngang */}
        <div
          style={{
            marginTop: 24,
            width: "100%",
            maxWidth: 700,
            display: "flex",
            justifyContent: "center",
            gap: 40,
            fontWeight: 600,
            fontSize: 14,
            padding: 12,
            borderRadius: 6,
            flexWrap: "wrap", // nếu màn nhỏ thì xuống dòng
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "black",
                borderRadius: 4,
              }}
            ></div>
            <span>Ghế thường</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "red",
                borderRadius: 4,
              }}
            ></div>
            <span>Ghế VIP</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "blue",
                borderRadius: 4,
              }}
            ></div>
            <span>Ghế đôi</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>
              <strong>Click:</strong> Đổi loại ghế
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>
              <strong>Double click:</strong> Ẩn ghế
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ListPhongChieu;
