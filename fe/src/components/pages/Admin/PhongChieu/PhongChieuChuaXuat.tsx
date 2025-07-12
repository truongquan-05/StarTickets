import  { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Button, Modal, message, Space, Popconfirm, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IPhongChieu } from "../interface/phongchieu";
import {
  getListCinemas,
  getListPhongChieu,
} from "../../../provider/hungProvider";
import { useDeletePhongChieu, useListGhe, useUpdatePhongChieu } from "../../../hook/hungHook";
import SoDoGhe from "./SoDoGhe";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface IRap {
  id: number;
  ten_rap: string;
}

const PhongChieuChuaXuat = () => {
  const navigate = useNavigate();  // <-- moved here

  const [open, setOpen] = useState(false);
  const [selectedPhong, setSelectedPhong] = useState<IPhongChieu | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [phongToConfirm, setPhongToConfirm] = useState<IPhongChieu | null>(null);

  const updatePhongChieuMutation = useUpdatePhongChieu({
    resource: "phong_chieu",
  });
  const { mutate: deletePhongChieu } = useDeletePhongChieu({
    resource: "phong_chieu",
  });

  // Lấy danh sách phòng chiếu
  const {
    data: phongChieuDataRaw,
    isLoading: isLoadingPhong,
    isError: isErrorPhong,
  } = useQuery({
    queryKey: ["phong_chieu"],
    queryFn: () =>
      getListPhongChieu({ resource: "phong_chieu" }).then((res) => res.data),
  });

  // Đảm bảo phongChieuData luôn là mảng
  const phongChieuData = Array.isArray(phongChieuDataRaw) ? phongChieuDataRaw : [];

  // Lọc các phòng chưa xuất
  const phongChieuChuaXuatData = useMemo(() => {
    return phongChieuData.filter(
      (phong: IPhongChieu) => phong.trang_thai !== "1" && phong.trang_thai !== 1
    );
  }, [phongChieuData]);

  // Lấy danh sách rạp
  const {
    data: rapDataRaw,
    isLoading: isLoadingRap,
    isError: isErrorRap,
  } = useQuery({
    queryKey: ["rap"],
    queryFn: () => getListCinemas({ resource: "rap" }).then((res) => res.data),
  });

  const rapData = Array.isArray(rapDataRaw) ? rapDataRaw : [];

  // Map rạp id => tên rạp
  const rapMap = useMemo(() => {
    const map = new Map<number, string>();
    rapData.forEach((r: IRap) => map.set(r.id, r.ten_rap));
    return map;
  }, [rapData]);

  // Lấy danh sách ghế phòng được chọn
  const {
    data: danhSachGhe = [],
    isLoading: isLoadingGhe,
    isError: isErrorGhe,
  } = useListGhe({
    resource: "ghe",
    phong_id: selectedPhong?.id,
  });

  // Bấm "Chưa Xuất" sẽ hiện modal xác nhận
  const onClickChuaXuat = (phong: IPhongChieu) => {
    setPhongToConfirm(phong);
    setConfirmModalOpen(true);
  };

  // Xác nhận bật trạng thái phòng chiếu
  const onConfirm = () => {
    if (!phongToConfirm) return;

    updatePhongChieuMutation.mutate(
      {
        id: phongToConfirm.id,
        values: {
          ...phongToConfirm,
          trang_thai: 1,
        },
      },
      {
        onSuccess: () => {
          message.success("Phòng chiếu đã được kích hoạt!");
          setConfirmModalOpen(false);
          setSelectedPhong({ ...phongToConfirm, trang_thai: 1 });
          setPhongToConfirm(null);
          navigate("/admin/room/list"); // <-- dùng biến navigate đã khai báo ở trên
        },
        onError: () => {
          message.error("Cập nhật thất bại");
        },
      }
    );
  };

  const onCancelConfirm = () => {
    setConfirmModalOpen(false);
    setPhongToConfirm(null);
  };

  if (isLoadingPhong || isLoadingRap) {
    return <div style={{ padding: 20, fontSize: 16 }}>Đang tải dữ liệu...</div>;
  }

  if (isErrorPhong || isErrorRap) {
    return (
      <div style={{ padding: 20, fontSize: 16, color: "red" }}>
        Lỗi tải dữ liệu
      </div>
    );
  }

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
      render: (rap_id: number) => rapMap.get(rap_id) || "",
    },
    {
      title: "Tên phòng",
      dataIndex: "ten_phong",
      key: "ten_phong",
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
      render: (value: string | number, record: IPhongChieu) => {
        const isActive = value === "1" || value === 1;
        if (isActive) {
          return (
            <span style={{ color: "green", cursor: "default" }}>Hoạt động</span>
          );
        }
        return (
          <span
            style={{
              color: "red",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => onClickChuaXuat(record)}
            title="Nhấn để kích hoạt phòng chiếu"
          >
            Chưa Xuất
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_text, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => {
              if (record.trang_thai === "0" || record.trang_thai === 0) {
                setSelectedPhong(record);
                setOpen(true);
              }
            }}
          >
            Xem chi tiết ghế
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá phòng chiếu này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => {
              deletePhongChieu(record.id);
              message.success("Xóa mềm thành công");
            }}
          >
            <Button danger shape="circle" icon={<DeleteOutlined />} title="Xoá" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        padding: "20px 20px 0px 20px",
        backgroundColor: "#fff",
        borderRadius: 8,
        height: "100%",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Button style={{ marginBottom: 16 }} onClick={() => navigate("/admin/room/trashed/list")}>
        Hiển thị phòng đã xóa
      </Button>
      <Table
        dataSource={phongChieuChuaXuatData}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title="Xác nhận"
        open={confirmModalOpen}
        onOk={onConfirm}
        onCancel={onCancelConfirm}
        okText="Có"
        cancelText="Không"
        centered
      >
        <p>Bạn có muốn phòng chiếu này hoạt động không?</p>
        <p>
          <strong>{phongToConfirm?.ten_phong}</strong> - Rạp:{" "}
          {phongToConfirm ? rapMap.get(phongToConfirm.rap_id) : ""}
        </p>
      </Modal>

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
          flexDirection: "column",
          alignItems: "center",
          padding: 16,
          overflow: "visible",
          maxWidth: 1000,
        }}
        style={{ top: 50 }}
      >
        <SoDoGhe
          phongId={selectedPhong?.id || null}
          loaiSoDo={selectedPhong?.loai_so_do}
          danhSachGhe={danhSachGhe}
          isLoadingGhe={isLoadingGhe}
          isErrorGhe={isErrorGhe}
          trangThaiPhong={0}
        />
      </Modal>
    </Card>
  );
};

export default PhongChieuChuaXuat;
