import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Spin,
  Image,
  Space,
  Descriptions,
  Tag,
} from "antd";
import moment from "moment";
import {
  useListLichSuDonHang,
  useListLichSuDonHangChiTiet,
} from "../../../hook/hungHook";

const LichSuTatCaVe = () => {
  const { data: lichSu, isLoading: loadingLichSu } = useListLichSuDonHang({
    resource: "lich-su-ve",
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalChiTietVisible, setModalChiTietVisible] = useState(false);
  const [modalQRVisible, setModalQRVisible] = useState(false);

  const {
    data: chiTietData,
    isLoading: loadingChiTiet,
    refetch,
  } = useListLichSuDonHangChiTiet({
    resource: "lich-su-ve",
    id: selectedId ?? undefined,
  });
  console.log(chiTietData);

  const showModalChiTiet = (id: number) => {
    setSelectedId(id);
    setModalChiTietVisible(true);
    refetch();
  };

  const showModalQR = (id: number) => {
    setSelectedId(id);
    setModalQRVisible(true);
    refetch();
  };

  const handleCloseChiTiet = () => {
    setModalChiTietVisible(false);
    setSelectedId(null);
  };

  const handleCloseQR = () => {
    setModalQRVisible(false);
    setSelectedId(null);
  };

  const mergedData = useMemo(() => {
    if (!lichSu?.data) return [];

    return lichSu.data.map((don: any) => {
      const datVe = don.dat_ve;
      const lichChieu = datVe?.lich_chieu;
      const phim = lichChieu?.phim;
      const phong = lichChieu?.phong_chieu;
      const rap = phong?.rap;

      return {
        id: don.id,
        ma_giao_dich: don.ma_giao_dich,
        created_at: don.created_at,
        tong_tien: datVe?.tong_tien ? parseFloat(datVe.tong_tien) : 0,
        ten_phim: phim?.ten_phim || "",
        ten_rap: rap?.ten_rap || "Không rõ",
        thanh_toan_id: don.id,
      };
    });
  }, [lichSu]);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "ma_giao_dich",
      key: "ma_giao_dich",
    },
    {
      title: "Chi nhánh",
      dataIndex: "ten_rap",
      key: "chi_nhanh",
    },
    {
      title: "Ngày",
      dataIndex: "created_at",
      key: "ngay",
      render: (text: string) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Tổng cộng",
      dataIndex: "tong_tien",
      key: "tong_cong",
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="default"
            onClick={() => showModalQR(record.thanh_toan_id)}
          >
            Mã QR
          </Button>
          <Button
            type="primary"
            onClick={() => showModalChiTiet(record.thanh_toan_id)}
          >
            Xem chi tiết vé
          </Button>
        </Space>
      ),
    },
  ];

  if (loadingLichSu) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const gheDat =
    chiTietData?.dat_ve?.dat_ve_chi_tiet
      ?.map((ct: any) => ct.ghe_dat?.so_ghe)
      .join(", ") || "";

  const suatChieu = chiTietData?.dat_ve?.lich_chieu;

  const phim = suatChieu?.phim;
  const phong = suatChieu?.phong_chieu;
  const rap = phong?.rap;

  return (
    <>
      <h2
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 24,
          marginBottom: 16,
        }}
      >
        LỊCH SỬ MUA HÀNG
      </h2>

      <Table
        columns={columns}
        dataSource={mergedData}
        rowKey="id"
        pagination={false}
        style={{ backgroundColor: "#002147", color: "white" }}
      />

      {/* Modal Chi Tiết Vé */}
      <Modal
        title={`Chi tiết vé #${selectedId}`}
        open={modalChiTietVisible}
        onCancel={handleCloseChiTiet}
        footer={null}
        width={600}
      >
        {loadingChiTiet ? (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        ) : chiTietData ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Phim">
              {chiTietData.data.dat_ve.lich_chieu.phim.ten_phim}
            </Descriptions.Item>
            <Descriptions.Item label="Rạp">
              {chiTietData.data.dat_ve.lich_chieu.phong_chieu.rap.ten_rap}
            </Descriptions.Item>
            <Descriptions.Item label="Phòng">
              {chiTietData.data.dat_ve.lich_chieu.phong_chieu.ten_phong}
            </Descriptions.Item>
            <Descriptions.Item label="Thời lượng">
              {chiTietData.data.dat_ve.lich_chieu.phim.thoi_luong} phút
            </Descriptions.Item>
            <Descriptions.Item label="Giờ chiếu">
              {moment(chiTietData.data.dat_ve.lich_chieu.gio_chieu).format(
                "HH:mm DD/MM/YYYY"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ kết thúc">
              {moment(chiTietData.data.dat_ve.lich_chieu.gio_ket_thuc).format(
                "HH:mm DD/MM/YYYY"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ghế đã đặt">
              <Tag color="green">
                {chiTietData.data.dat_ve.dat_ve_chi_tiet
                  .map((item: any) => item.ghe_dat.so_ghe)
                  .join(", ")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {Number(chiTietData.data?.dat_ve?.tong_tien).toLocaleString(
                "vi-VN",
                {
                  style: "currency",
                  currency: "VND",
                }
              )}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div>Không có dữ liệu chi tiết vé</div>
        )}
      </Modal>

      {/* Modal QR Code */}
      <Modal
        title={`Mã QR vé #${selectedId}`}
        open={modalQRVisible}
        onCancel={handleCloseQR}
        footer={null}
        width={400}
      >
        {loadingChiTiet ? (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        ) : chiTietData?.data?.qr_code ? (
          <div style={{ textAlign: "center" }}>
            <Image
              src={`${chiTietData.data.qr_code}`}
              alt="QR Code"
              width={250}
              preview={false}
              style={{ margin: "0 auto" }}
            />
          </div>
        ) : (
          <div>Không có QR Code để hiển thị</div>
        )}
      </Modal>
    </>
  );
};

export default LichSuTatCaVe;
