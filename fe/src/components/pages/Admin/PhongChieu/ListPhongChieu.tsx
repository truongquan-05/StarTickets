import  { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Modal, Card } from "antd";
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
    queryFn: async () => {
      try {
        const res = await getListPhongChieu({ resource: "phong_chieu" });
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.data)) return res.data.data;
        return []; // fallback an toàn
      } catch (error) {
        console.error("Lỗi khi fetch phong_chieu:", error);
        return [];
      }
    },
  });

  // Bảo vệ khi phongChieuData không phải mảng
  const filteredPhongChieuData = useMemo(() => {
    if (!Array.isArray(phongChieuData)) return [];
    return phongChieuData.filter(
      (phong: IPhongChieu) => phong.trang_thai === 1 || phong.trang_thai === "1"
    );
  }, [phongChieuData]);

  const {
    data: rapData = [],
    isLoading: isLoadingRap,
    isError: isErrorRap,
  } = useQuery({
    queryKey: ["rap"],
    queryFn: async () => {
      try {
        const res = await getListCinemas({ resource: "rap" });
        if (Array.isArray(res?.data)) return res.data;
        return [];
      } catch (error) {
        console.error("Lỗi khi fetch rap:", error);
        return [];
      }
    },
  });

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
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      align: "center",
      render: (value: string) => {
        const isActive = value === "1";
        return (
          <span style={{ color: isActive ? "green" : "red" }}>
            {isActive ? "Hoạt động" : "Ngừng hoạt động"}
          </span>
        );
      },
    },
    {
      title: "Chi Tiết",
      key: "chi_tiet",
      align: "center",
      render: (_text, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Xem chi tiết ghế
        </Button>
      ),
    },
  ];

  return (
    <Card
      style={{
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        background: "#fff",
        height: "95%",
      }}
    >
      <Table
        dataSource={filteredPhongChieuData}
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
        width={1300}
        
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
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
          trangThaiPhong={1}
        />
      </Modal>
    </Card>
  );
};

export default ListPhongChieu;
